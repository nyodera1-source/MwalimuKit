"""
MwalimuKit Question Bank Extractor
===================================
Extracts questions and diagrams from past exam PDFs using local OCR.

Output JSON matches the Prisma QuestionPaper + Question schema so the
Node.js import script can insert directly into PostgreSQL.

Prerequisites:
  pip install -r requirements.txt

  Windows:
    1. Install Tesseract: https://github.com/UB-Mannheim/tesseract/wiki
       (Add to PATH or set TESSERACT_CMD below)
    2. Install Poppler: https://github.com/oschwartz10612/poppler-windows/releases
       (Extract and add bin/ to PATH)

Usage:
  python extract.py input.pdf                      # Single PDF
  python extract.py input_folder/ --batch           # All PDFs in folder
  python extract.py input.pdf --subject Mathematics --grade "Grade 7" --year 2024

  # Image files (photos/scans of exam papers):
  python extract.py images_folder/ --images --subject Biology -o extracted_v4
  python extract.py papers/ --images --group-by folder --subject Biology -o out
      (each subfolder in papers/ treated as a separate paper)
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path

import cv2
import numpy as np
from pdf2image import convert_from_path
from PIL import Image

# ─── Tesseract config ───
# Uncomment and set path if tesseract is not in PATH:
# import pytesseract
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
import pytesseract


# ─── Constants ───

DPI = 300  # Higher = better OCR but slower
DIAGRAM_MIN_WIDTH = 150   # px at 300 DPI
DIAGRAM_MIN_HEIGHT = 150
DIAGRAM_MAX_ASPECT = 5.0  # Skip very elongated shapes (likely lines/borders)
DIAGRAMS_DIR = "diagrams"


# ─── PDF to Images ───

def pdf_to_images(pdf_path: str, dpi: int = DPI) -> list[Image.Image]:
    """Convert PDF pages to PIL Images."""
    print(f"  Converting PDF to images (DPI={dpi})...")
    images = convert_from_path(pdf_path, dpi=dpi)
    print(f"  Got {len(images)} page(s)")
    return images


# ─── Background Removal / Paper Detection ───

def _order_points(pts: np.ndarray) -> np.ndarray:
    """Order 4 points as: top-left, top-right, bottom-right, bottom-left."""
    rect = np.zeros((4, 2), dtype="float32")
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]   # top-left has smallest x+y
    rect[2] = pts[np.argmax(s)]   # bottom-right has largest x+y
    d = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(d)]   # top-right has smallest x-y
    rect[3] = pts[np.argmax(d)]   # bottom-left has largest x-y
    return rect


def remove_background(img: Image.Image) -> Image.Image:
    """
    Detect the paper region in a photo and return a perspective-corrected,
    cropped image of just the paper. Falls back to the original image if
    no clear paper boundary is found.

    Steps:
      1. Blur + Canny edge detection
      2. Find the largest quadrilateral contour (the paper)
      3. Perspective-warp to a flat rectangle
      4. Convert background to white
    """
    arr = np.array(img)
    h, w = arr.shape[:2]
    img_area = h * w

    gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 50, 150)

    # Dilate edges to close gaps in the paper boundary
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    edges = cv2.dilate(edges, kernel, iterations=2)

    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    best_quad = None
    best_area = 0

    for cnt in contours:
        area = cv2.contourArea(cnt)
        # Paper should be at least 20% of image and less than 98%
        if area < img_area * 0.20 or area > img_area * 0.98:
            continue

        peri = cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, 0.02 * peri, True)

        if len(approx) == 4 and area > best_area:
            best_area = area
            best_quad = approx

    if best_quad is None:
        # No paper boundary found — return original
        return img

    # Perspective transform to flatten the paper
    pts = best_quad.reshape(4, 2).astype("float32")
    rect = _order_points(pts)
    (tl, tr, br, bl) = rect

    # Compute output dimensions
    width_top = np.linalg.norm(tr - tl)
    width_bot = np.linalg.norm(br - bl)
    max_w = int(max(width_top, width_bot))

    height_left = np.linalg.norm(bl - tl)
    height_right = np.linalg.norm(br - tr)
    max_h = int(max(height_left, height_right))

    dst = np.array([
        [0, 0],
        [max_w - 1, 0],
        [max_w - 1, max_h - 1],
        [0, max_h - 1],
    ], dtype="float32")

    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(arr, M, (max_w, max_h),
                                  borderMode=cv2.BORDER_CONSTANT,
                                  borderValue=(255, 255, 255))

    return Image.fromarray(warped)


# ─── OCR ───

def ocr_page(img: Image.Image) -> str:
    """Extract text from a page image using Tesseract."""
    # Preprocess: convert to grayscale, threshold for cleaner OCR
    arr = np.array(img)
    gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
    # Adaptive threshold for varied print quality
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    processed = Image.fromarray(thresh)

    text = pytesseract.image_to_string(processed, lang="eng", config="--psm 6")
    return text.strip()


# ─── OCR Text Cleaning ───

# Watermark / footer patterns to remove entire lines
_NOISE_LINE_PATTERNS = re.compile(
    r"CamScanner|[Tt]eacher.{0,2}co.{0,2}ke|mwalimuresources"
    r"|For Marking Schemes Contact"
    r"|Download this and other FREE"
    r"|Call/WhatsApp"
    r"|Visit:\s*www\."
    r"|07\d{2}\s*\d{3}\s*\d{3}"
    r"|0746\s*222\s*000"
    r"|Turn over"
    r"|revision materials from",
    re.IGNORECASE,
)

# Instruction lines that should not be parsed as questions
_INSTRUCTION_PATTERNS = re.compile(
    r"Answer\s+ALL|Write your|INSTRUCTIONS"
    r"|FOR EXAMINER|printed pages"
    r"|check the question paper"
    r"|Unique Identification|Admission number"
    r"|Kenya Certificate of Secon"
    r"|This paper consists of"
    r"|Candidates?\s+should"
    r"|Candidates?\s+must"
    r"|answer\s+the\s+questions\s+in\s+English"
    r"|FOR EXAMINERS?\s*USE"
    r"|THIS IS THE LAST PRINTED PAGE"
    r"|All the Best",
    re.IGNORECASE,
)

# Repeated punctuation / single-char noise
_REPEATED_PUNCT = re.compile(r"([.\-_=|:;,*#@!~`'\"<>{}()\[\]\\/ ])\1{4,}")


def _alpha_ratio(text: str) -> float:
    """Return the fraction of characters that are alphanumeric or space."""
    if not text:
        return 0.0
    alnum = sum(1 for c in text if c.isalnum() or c == " ")
    return alnum / len(text)


def is_instruction_line(line: str) -> bool:
    """Return True if the line is an exam instruction, not a question."""
    return bool(_INSTRUCTION_PATTERNS.search(line))


def clean_ocr_text(text: str) -> str:
    """Clean raw OCR output: remove noise lines, garbage, and normalize marks."""
    cleaned_lines = []
    for line in text.split("\n"):
        stripped = line.strip()
        if not stripped:
            cleaned_lines.append("")
            continue

        # Remove watermark / footer lines
        if _NOISE_LINE_PATTERNS.search(stripped):
            continue

        # Remove instruction lines
        if is_instruction_line(stripped):
            continue

        # Remove very short lines that are just noise (single chars, brackets, etc.)
        alnum_in_line = sum(1 for c in stripped if c.isalnum())
        if len(stripped) <= 5 and alnum_in_line <= 2:
            continue

        # Remove lines that are mostly garbage (< 40% alphanumeric)
        if len(stripped) > 5 and _alpha_ratio(stripped) < 0.40:
            continue

        # Remove lines that are just single repeated characters
        if _REPEATED_PUNCT.fullmatch(stripped):
            continue

        # Remove lines that are just repeated single letters/symbols (OCR diagram noise)
        if len(stripped) > 10 and re.fullmatch(r"[\s\W\dA-Z]{5,}", stripped):
            # Check if it's mostly single-spaced capital letters (diagram label noise)
            words = stripped.split()
            if all(len(w) <= 2 for w in words) and len(words) > 3:
                continue

        # Normalize OCR-garbled marks
        stripped = re.sub(r"\b[Ss]marks\b", "5 marks", stripped)
        stripped = re.sub(r"\b(\d{1,2})\s*[iInN]arks\b", r"\1 marks", stripped)
        stripped = re.sub(r"\b(\d{1,2})\s*[mM]arks\b", r"\1 marks", stripped)
        stripped = re.sub(r"\b(\d{1,2})\s*narks\b", r"\1 marks", stripped, flags=re.IGNORECASE)

        # Collapse repeated punctuation into single instance
        stripped = _REPEATED_PUNCT.sub(r"\1", stripped)

        cleaned_lines.append(stripped)

    return "\n".join(cleaned_lines)


# ─── Diagram Detection ───

def detect_diagrams(
    img: Image.Image, page_num: int, output_dir: str, pdf_stem: str
) -> list[dict]:
    """Detect and crop diagram regions from a page image."""
    arr = np.array(img)
    gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)

    # Edge detection
    edges = cv2.Canny(gray, 30, 120)

    # Dilate to merge nearby edges into regions
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 15))
    dilated = cv2.dilate(edges, kernel, iterations=3)

    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    diagrams = []
    page_h, page_w = gray.shape

    for i, cnt in enumerate(contours):
        x, y, w, h = cv2.boundingRect(cnt)

        # Filter: minimum size, max aspect ratio, not full page
        if w < DIAGRAM_MIN_WIDTH or h < DIAGRAM_MIN_HEIGHT:
            continue
        aspect = max(w, h) / max(min(w, h), 1)
        if aspect > DIAGRAM_MAX_ASPECT:
            continue
        # Skip if it's nearly the full page (probably the page border)
        if w > page_w * 0.9 and h > page_h * 0.9:
            continue

        # Add padding
        pad = 10
        x1 = max(0, x - pad)
        y1 = max(0, y - pad)
        x2 = min(page_w, x + w + pad)
        y2 = min(page_h, y + h + pad)

        # Crop and save
        crop = img.crop((x1, y1, x2, y2))
        filename = f"{pdf_stem}_p{page_num + 1}_d{i + 1}.png"
        filepath = os.path.join(output_dir, filename)
        crop.save(filepath, "PNG")

        diagrams.append({
            "filename": filename,
            "page": page_num + 1,
            "bounds": [x1, y1, x2, y2],
            "width": x2 - x1,
            "height": y2 - y1,
        })

    return diagrams


# ─── Question Parsing ───

def parse_questions(full_text: str) -> list[dict]:
    """
    Parse OCR text into individual questions.
    Handles patterns like:
      1. Question text here  (3 marks)
      (a) Sub-question text  (2 marks)
    """
    lines = full_text.split("\n")
    questions = []
    current_q = None
    current_sub = None
    current_page = 1  # Track which page we're on via <<PAGE:N>> markers

    # Page marker pattern
    page_marker = re.compile(r"^<<PAGE:(\d+)>>$")

    # Patterns for question numbers: "1.", "1)", "1 Text..." (space then word with 3+ letters)
    q_pattern = re.compile(
        r"^\s*(\d{1,2})\s*[.)]\s*(.*)"                  # 1. or 1) followed by text
        r"|^\s*(\d{1,2})\s+([A-Za-z]{3,}[\s\S]*)",      # 1 Word... (word must be 3+ chars)
    )
    # Sub-question patterns: (a), a), a., (i), i)
    sub_pattern = re.compile(
        r"^\s*\(?([a-z]|[ivx]+)\s*[.)]\s*(.*)", re.IGNORECASE
    )
    # Marks pattern: (3 marks), (3mks), [3], 3 marks, 3 iarks, 3 narks
    marks_pattern = re.compile(
        r"\(?\s*(\d{1,2})\s*(?:m[ai]?rks?|mks?|narks?|pts?)\s*\)?|\[(\d{1,2})\]",
        re.IGNORECASE,
    )
    # Section headers
    section_pattern = re.compile(
        r"^\s*(?:SECTION|PART)\s+([A-C])\b", re.IGNORECASE
    )

    current_section = None

    def extract_marks(text: str) -> tuple[str, int | None]:
        """Extract marks from text and return (cleaned_text, marks)."""
        m = marks_pattern.search(text)
        if m:
            marks = int(m.group(1) or m.group(2))
            cleaned = marks_pattern.sub("", text).strip()
            return cleaned, marks
        return text.strip(), None

    def save_current():
        nonlocal current_q, current_sub
        if current_sub and current_q:
            current_q["subQuestions"].append(current_sub)
            current_sub = None
        if current_q:
            # Clean up text
            current_q["text"] = current_q["text"].strip()
            if current_q["text"]:
                questions.append(current_q)
            current_q = None

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Check for page marker
        pm = page_marker.match(line)
        if pm:
            current_page = int(pm.group(1))
            continue

        # Check for section header
        sec_match = section_pattern.match(line)
        if sec_match:
            current_section = sec_match.group(1).upper()
            continue

        # Check for new question number
        q_match = q_pattern.match(line)
        if q_match:
            save_current()
            q_num = q_match.group(1) or q_match.group(3)
            q_text = q_match.group(2) or q_match.group(4) or ""
            q_text, marks = extract_marks(q_text)
            current_q = {
                "questionNumber": q_num,
                "section": current_section,
                "text": q_text,
                "marks": marks,
                "subQuestions": [],
                "page": current_page,
            }
            continue

        # Check for sub-question
        if current_q:
            sub_match = sub_pattern.match(line)
            if sub_match:
                # Save previous sub
                if current_sub:
                    current_q["subQuestions"].append(current_sub)
                label = sub_match.group(1)
                sub_text = sub_match.group(2)
                sub_text, marks = extract_marks(sub_text)
                current_sub = {
                    "label": label,
                    "text": sub_text,
                    "marks": marks,
                }
                continue

            # Continuation of current sub-question or question
            text_add, marks = extract_marks(line)
            if current_sub:
                current_sub["text"] += " " + text_add
                if marks and not current_sub["marks"]:
                    current_sub["marks"] = marks
            elif current_q:
                current_q["text"] += " " + text_add
                if marks and not current_q["marks"]:
                    current_q["marks"] = marks

    # Save last question
    save_current()

    # ── Post-processing: split merged sub-questions ──
    # Sometimes OCR merges "(b) ... (c) ..." into one sub-question text.
    embedded_sub_re = re.compile(
        r"\s+\(?([a-z])\s*[.)]\s+", re.IGNORECASE
    )
    for q in questions:
        if not q.get("subQuestions"):
            continue
        new_subs = []
        for sub in q["subQuestions"]:
            text = sub["text"]
            # Look for embedded sub-question labels in the text
            parts = embedded_sub_re.split(text)
            if len(parts) >= 3:
                # First part belongs to the original sub
                first_text, first_marks = extract_marks(parts[0].strip())
                new_subs.append({
                    "label": sub["label"],
                    "text": first_text,
                    "marks": first_marks or sub.get("marks"),
                })
                # Remaining pairs are (label, text)
                for j in range(1, len(parts) - 1, 2):
                    split_label = parts[j]
                    split_text = parts[j + 1].strip() if j + 1 < len(parts) else ""
                    split_text, split_marks = extract_marks(split_text)
                    if split_text:
                        new_subs.append({
                            "label": split_label,
                            "text": split_text,
                            "marks": split_marks,
                        })
            else:
                new_subs.append(sub)
        q["subQuestions"] = new_subs

    # ── Post-processing: filter out garbage questions ──
    filtered = []
    for q in questions:
        text = q.get("text", "")
        # Skip questions with mostly non-alphanumeric text
        if len(text) > 5 and _alpha_ratio(text) < 0.40:
            continue
        # Skip questions with too little meaningful text
        alnum_count = sum(1 for c in text if c.isalnum())
        if alnum_count < 10:
            # Check if sub-questions have meaningful text
            has_good_sub = any(
                sum(1 for c in s.get("text", "") if c.isalnum()) >= 10
                for s in (q.get("subQuestions") or [])
            )
            if not has_good_sub:
                continue
        # Filter sub-questions too
        if q.get("subQuestions"):
            q["subQuestions"] = [
                s for s in q["subQuestions"]
                if _alpha_ratio(s.get("text", "")) >= 0.35
                and sum(1 for c in s.get("text", "") if c.isalnum()) >= 5
            ]
        filtered.append(q)

    return filtered


# ─── Header Parsing ───

def parse_header(full_text: str, filename: str) -> dict:
    """
    Try to extract paper metadata from the first page text.
    Returns partial dict — user can override via CLI args.
    """
    meta = {
        "subject": None,
        "gradeLevel": None,
        "year": None,
        "term": None,
        "examType": None,
        "school": None,
        "paperNumber": None,
        "totalMarks": None,
        "timeMinutes": None,
    }

    first_500 = full_text[:500].upper()

    # Year
    year_match = re.search(r"\b(20[12]\d)\b", full_text[:500])
    if year_match:
        meta["year"] = int(year_match.group(1))

    # Subject detection
    subjects = [
        "MATHEMATICS", "ENGLISH", "KISWAHILI", "SCIENCE", "SOCIAL STUDIES",
        "BIOLOGY", "CHEMISTRY", "PHYSICS", "HISTORY", "GEOGRAPHY",
        "BUSINESS STUDIES", "AGRICULTURE", "HOME SCIENCE", "CRE", "IRE",
        "COMPUTER STUDIES", "FRENCH", "GERMAN", "ARABIC", "MUSIC",
        "ART AND DESIGN", "INTEGRATED SCIENCE", "HEALTH EDUCATION",
        "LIFE SKILLS", "PRE-TECHNICAL STUDIES", "RELIGIOUS EDUCATION",
    ]
    for subj in subjects:
        if subj in first_500:
            meta["subject"] = subj.title()
            break

    # Grade/Form
    grade_match = re.search(r"(?:GRADE|FORM|CLASS)\s*(\d+)", first_500)
    if grade_match:
        num = int(grade_match.group(1))
        prefix = "GRADE" if "GRADE" in first_500 else "FORM" if "FORM" in first_500 else "CLASS"
        if prefix == "FORM":
            meta["gradeLevel"] = f"Form {num}"
        else:
            meta["gradeLevel"] = f"Grade {num}"

    # Exam type
    if "KCSE" in first_500:
        meta["examType"] = "KCSE"
    elif "KCPE" in first_500:
        meta["examType"] = "KCPE"
    elif "MOCK" in first_500:
        meta["examType"] = "Mock"
    elif "MID" in first_500 and "TERM" in first_500:
        meta["examType"] = "Mid Term"
    elif "END" in first_500 and "TERM" in first_500:
        meta["examType"] = "End Term"
    elif "CAT" in first_500:
        meta["examType"] = "CAT"

    # Term
    term_match = re.search(r"TERM\s*(\d)", first_500)
    if term_match:
        meta["term"] = int(term_match.group(1))

    # Paper number
    paper_match = re.search(r"PAPER\s*(\d)", first_500)
    if paper_match:
        meta["paperNumber"] = int(paper_match.group(1))

    # Total marks
    marks_match = re.search(r"(\d{2,3})\s*MARKS", first_500)
    if marks_match:
        meta["totalMarks"] = int(marks_match.group(1))

    # Time
    time_match = re.search(r"(\d+)\s*(?:HOURS?|HRS?)", first_500)
    if time_match:
        hours = int(time_match.group(1))
        meta["timeMinutes"] = hours * 60
    time_match2 = re.search(r"(\d+)\s*(?:MINUTES?|MINS?)", first_500)
    if time_match2:
        mins = int(time_match2.group(1))
        meta["timeMinutes"] = (meta.get("timeMinutes") or 0) + mins

    return meta


# ─── Diagram-to-Question Linking ───

# Words in question text that suggest a diagram is relevant
_DIAGRAM_HINT_WORDS = re.compile(
    r"figure|diagram|below|shown|drawing|sketch|illustration|picture|image"
    r"|graph|chart|map|table|represented|labelled|labeled|structure",
    re.IGNORECASE,
)


def link_diagrams_to_questions(
    questions: list[dict], diagrams: list[dict]
) -> list[dict]:
    """
    Match diagram images to questions based on page numbers.
    Updates each question dict in-place with hasImage and imageUrl fields.
    Returns the updated questions list.
    """
    if not diagrams:
        return questions

    # Group diagrams by page
    diagrams_by_page: dict[int, list[dict]] = {}
    for d in diagrams:
        pg = d["page"]
        diagrams_by_page.setdefault(pg, []).append(d)

    # Group questions by page
    questions_by_page: dict[int, list[dict]] = {}
    for q in questions:
        pg = q.get("page", 1)
        questions_by_page.setdefault(pg, []).append(q)

    # For each page that has diagrams, assign them to questions
    for page_num, page_diagrams in diagrams_by_page.items():
        # Find questions on this page or the previous page
        candidates = questions_by_page.get(page_num, [])
        if not candidates:
            candidates = questions_by_page.get(page_num - 1, [])
        if not candidates:
            # Try next page (diagram might be on a page before the question text)
            candidates = questions_by_page.get(page_num + 1, [])
        if not candidates:
            continue

        for diagram in page_diagrams:
            # Prefer questions that mention "figure", "diagram", "below", etc.
            hint_q = None
            for q in candidates:
                full_text = q.get("text", "")
                for sub in q.get("subQuestions") or []:
                    full_text += " " + sub.get("text", "")
                if _DIAGRAM_HINT_WORDS.search(full_text):
                    hint_q = q
                    break

            # If no hint, assign to the last question on the page
            target = hint_q or candidates[-1]

            # Set image fields (first diagram wins for imageUrl)
            target["hasImage"] = True
            if not target.get("imageUrl"):
                target["imageUrl"] = f"/diagrams/{diagram['filename']}"

    return questions


# ─── Main Pipeline ───

def _run_pipeline(
    images: list[Image.Image],
    source_name: str,
    output_dir: str,
    overrides: dict | None = None,
) -> dict:
    """
    Core pipeline: images -> OCR -> parse questions -> detect diagrams.
    Used by both process_pdf() and process_images().
    """
    diagrams_dir = os.path.join(output_dir, DIAGRAMS_DIR)
    os.makedirs(diagrams_dir, exist_ok=True)

    stem = Path(source_name).stem

    # Step 1: OCR all pages
    print("  Running OCR...")
    page_texts = []
    for i, img in enumerate(images):
        print(f"    Page {i + 1}/{len(images)}...")
        text = ocr_page(img)
        page_texts.append(text)

    full_text = "\n\n".join(page_texts)

    # Build page-tagged text
    page_tagged_text = ""
    for idx, pt in enumerate(page_texts):
        page_tagged_text += f"\n<<PAGE:{idx + 1}>>\n{pt}\n"

    # Step 2: Parse header metadata
    meta = parse_header(full_text, stem)
    if overrides:
        for k, v in overrides.items():
            if v is not None:
                meta[k] = v

    # Step 2.5: Clean OCR text
    print("  Cleaning OCR text...")
    cleaned_text = clean_ocr_text(page_tagged_text)

    # Step 3: Parse questions
    print("  Parsing questions...")
    questions = parse_questions(cleaned_text)
    print(f"  Found {len(questions)} question(s)")

    # Step 4: Detect diagrams
    print("  Detecting diagrams...")
    all_diagrams = []
    for i, img in enumerate(images):
        page_diagrams = detect_diagrams(img, i, diagrams_dir, stem)
        all_diagrams.extend(page_diagrams)
    print(f"  Found {len(all_diagrams)} diagram region(s)")

    # Step 4.5: Link diagrams to questions by page
    print("  Linking diagrams to questions...")
    questions = link_diagrams_to_questions(questions, all_diagrams)
    linked_count = sum(1 for q in questions if q.get("hasImage"))
    print(f"  Linked diagrams to {linked_count} question(s)")

    # Step 5: Build output
    output = {
        "source_file": source_name,
        "paper": {
            "subject": meta.get("subject") or "Unknown",
            "gradeLevel": meta.get("gradeLevel") or "Unknown",
            "year": meta.get("year") or 2024,
            "term": meta.get("term"),
            "examType": meta.get("examType") or "End Term",
            "school": meta.get("school"),
            "source": "ocr_extract",
            "paperNumber": meta.get("paperNumber"),
            "totalMarks": meta.get("totalMarks"),
            "timeMinutes": meta.get("timeMinutes"),
        },
        "questions": [],
        "diagrams": all_diagrams,
        "raw_text": full_text,
        "page_count": len(images),
    }

    for q in questions:
        question_data = {
            "questionNumber": q["questionNumber"],
            "section": q.get("section"),
            "text": q["text"],
            "marks": q.get("marks"),
            "hasImage": q.get("hasImage", False),
            "imageUrl": q.get("imageUrl"),
            "topic": None,
            "subTopic": None,
            "answer": None,
            "subQuestions": q.get("subQuestions") if q.get("subQuestions") else None,
        }
        output["questions"].append(question_data)

    return output


def process_pdf(
    pdf_path: str,
    output_dir: str,
    overrides: dict | None = None,
) -> dict:
    """
    Full pipeline: PDF -> images -> OCR -> parse questions -> detect diagrams.
    """
    pdf_path = os.path.abspath(pdf_path)
    images = pdf_to_images(pdf_path)
    return _run_pipeline(images, os.path.basename(pdf_path), output_dir, overrides)


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif", ".webp"}


def process_images(
    image_paths: list[str],
    source_name: str,
    output_dir: str,
    overrides: dict | None = None,
) -> dict:
    """
    Pipeline for image files: load images -> OCR -> parse questions -> detect diagrams.
    Each image is treated as one page.
    Includes background removal (paper detection + perspective correction) for photos.
    """
    print(f"  Loading {len(image_paths)} image(s)...")
    images = []
    for i, p in enumerate(image_paths):
        img = Image.open(p).convert("RGB")
        print(f"    [{i + 1}/{len(image_paths)}] Removing background from {os.path.basename(p)}...")
        img = remove_background(img)
        images.append(img)
    print(f"  Background removal complete for {len(images)} image(s)")
    return _run_pipeline(images, source_name, output_dir, overrides)


def main():
    parser = argparse.ArgumentParser(
        description="Extract questions from exam PDFs or images for MwalimuKit question bank"
    )
    parser.add_argument("input", help="PDF file, folder of PDFs (with --batch), or folder of images (with --images)")
    parser.add_argument("--batch", action="store_true", help="Process all PDFs in folder")
    parser.add_argument("--images", action="store_true",
                        help="Input is a folder of image files (jpg/png). "
                             "Images are sorted by name and treated as pages. "
                             "Use --group-by to split into separate papers.")
    parser.add_argument("--group-by", choices=["file", "folder"], default="file",
                        help="With --images: 'file' = all images are one paper, "
                             "'folder' = each subfolder is a separate paper (default: file)")
    parser.add_argument("--output", "-o", default="extracted", help="Output directory")
    parser.add_argument("--subject", help="Override subject (e.g. 'Mathematics')")
    parser.add_argument("--grade", help="Override grade (e.g. 'Grade 7', 'Form 2')")
    parser.add_argument("--year", type=int, help="Override year (e.g. 2024)")
    parser.add_argument("--term", type=int, help="Override term (1, 2, or 3)")
    parser.add_argument("--exam-type", help="Override exam type (e.g. 'KCSE', 'Mock')")
    parser.add_argument("--school", help="School name")
    parser.add_argument("--dpi", type=int, default=DPI, help="DPI for PDF conversion")
    args = parser.parse_args()

    overrides = {
        "subject": args.subject,
        "gradeLevel": args.grade,
        "year": args.year,
        "term": args.term,
        "examType": args.exam_type,
        "school": args.school,
    }

    os.makedirs(args.output, exist_ok=True)

    results = []

    if args.images:
        # ─── Image mode ───
        input_path = Path(args.input)
        if not input_path.is_dir():
            print(f"Error: {args.input} is not a directory")
            sys.exit(1)

        if args.group_by == "folder":
            # Each subfolder is a separate paper
            subfolders = sorted([d for d in input_path.iterdir() if d.is_dir()])
            if not subfolders:
                # No subfolders — treat the folder itself as one paper
                subfolders = [input_path]

            for folder in subfolders:
                img_files = sorted([
                    str(f) for f in folder.iterdir()
                    if f.suffix.lower() in IMAGE_EXTENSIONS
                ])
                if not img_files:
                    print(f"  No images in {folder.name}, skipping")
                    continue

                print(f"Processing folder: {folder.name} ({len(img_files)} images)")
                try:
                    result = process_images(img_files, folder.name, args.output, overrides)
                    results.append(result)

                    out_file = os.path.join(args.output, f"{folder.name}.json")
                    with open(out_file, "w", encoding="utf-8", errors="replace") as f:
                        json.dump(result, f, indent=2, ensure_ascii=False)
                    print(f"  Saved -> {out_file}")
                    print(f"  Summary: {len(result['questions'])} questions, "
                          f"{len(result['diagrams'])} diagrams\n")
                except Exception as e:
                    print(f"  ERROR: {str(e).encode('ascii', 'replace').decode()}\n")
                    continue
        else:
            # All images in one folder = one paper
            img_files = sorted([
                str(f) for f in input_path.iterdir()
                if f.suffix.lower() in IMAGE_EXTENSIONS
            ])
            if not img_files:
                print(f"No image files found in {args.input}")
                sys.exit(1)

            source_name = input_path.name or args.subject or "images"
            print(f"Processing {len(img_files)} image(s) as one paper: {source_name}")
            try:
                result = process_images(img_files, source_name, args.output, overrides)
                results.append(result)

                out_file = os.path.join(args.output, f"{source_name}.json")
                with open(out_file, "w", encoding="utf-8", errors="replace") as f:
                    json.dump(result, f, indent=2, ensure_ascii=False)
                print(f"  Saved -> {out_file}")
                print(f"  Summary: {len(result['questions'])} questions, "
                      f"{len(result['diagrams'])} diagrams\n")
            except Exception as e:
                print(f"  ERROR: {str(e).encode('ascii', 'replace').decode()}\n")

    else:
        # ─── PDF mode (original) ───
        if args.batch:
            pdf_files = sorted(Path(args.input).glob("*.pdf"))
            if not pdf_files:
                print(f"No PDF files found in {args.input}")
                sys.exit(1)
            print(f"Found {len(pdf_files)} PDF(s) to process\n")
        else:
            pdf_files = [Path(args.input)]

        for pdf_file in pdf_files:
            print(f"Processing: {pdf_file.name}")
            try:
                result = process_pdf(str(pdf_file), args.output, overrides)
                results.append(result)

                out_file = os.path.join(args.output, f"{pdf_file.stem}.json")
                with open(out_file, "w", encoding="utf-8", errors="replace") as f:
                    json.dump(result, f, indent=2, ensure_ascii=False)
                print(f"  Saved -> {out_file}")
                print(f"  Summary: {len(result['questions'])} questions, "
                      f"{len(result['diagrams'])} diagrams\n")
            except Exception as e:
                print(f"  ERROR: {str(e).encode('ascii', 'replace').decode()}\n")
                continue

    # Save combined batch file
    if len(results) > 1:
        batch_file = os.path.join(args.output, "_batch_all.json")
        with open(batch_file, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"Batch summary saved -> {batch_file}")

    total_q = sum(len(r["questions"]) for r in results)
    total_d = sum(len(r["diagrams"]) for r in results)
    print(f"\nDone! {len(results)} paper(s), {total_q} questions, {total_d} diagrams")


if __name__ == "__main__":
    main()
