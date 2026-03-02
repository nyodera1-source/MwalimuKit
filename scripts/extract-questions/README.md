# Question Bank Extractor

Extract questions and diagrams from past exam PDFs using local OCR, then import into the MwalimuKit database.

## Prerequisites (Windows)

### 1. Tesseract OCR
- Download installer: https://github.com/UB-Mannheim/tesseract/wiki
- Run the installer (default path: `C:\Program Files\Tesseract-OCR\`)
- Add to PATH: `C:\Program Files\Tesseract-OCR\`

### 2. Poppler (for pdf2image)
- Download: https://github.com/oschwartz10612/poppler-windows/releases
- Extract to e.g. `C:\poppler\`
- Add to PATH: `C:\poppler\Library\bin\`

### 3. Python packages
```bash
cd scripts/extract-questions
pip install -r requirements.txt
```

## Usage

### Step 1: Extract questions from PDFs

```bash
# Single file
python extract.py "C:\Users\User\Downloads\KCSE_2024_Math_P1.pdf"

# Single file with metadata overrides
python extract.py "C:\Users\User\Downloads\exam.pdf" \
  --subject "Mathematics" \
  --grade "Grade 7" \
  --year 2024 \
  --term 2 \
  --exam-type "End Term" \
  --school "Nairobi Primary"

# Batch: all PDFs in a folder
python extract.py "C:\Users\User\Downloads\past_papers\" --batch

# Custom output directory
python extract.py exam.pdf -o my_output_folder
```

Output:
- `extracted/<filename>.json` — structured data (paper metadata + questions)
- `extracted/diagrams/<filename>_p1_d1.png` — cropped diagram images

### Step 2: Review the JSON output

Open the JSON file and verify:
- Paper metadata (subject, grade, year, etc.)
- Questions are correctly parsed (text, marks, sub-questions)
- Edit anything that OCR got wrong

### Step 3: Import into database

```bash
# From the project root:
npx tsx scripts/extract-questions/import-to-db.ts extracted/paper1.json

# Or import all JSON files in a folder:
npx tsx scripts/extract-questions/import-to-db.ts extracted/
```

### Step 4: View in the app

Navigate to `/question-bank` in the web app to see imported papers.

## JSON Output Format

The output matches the Prisma `QuestionPaper` + `Question` schema:

```json
{
  "source_file": "KCSE_2024_Math_P1.pdf",
  "paper": {
    "subject": "Mathematics",
    "gradeLevel": "Form 4",
    "year": 2024,
    "term": null,
    "examType": "KCSE",
    "school": null,
    "source": "ocr_extract",
    "paperNumber": 1,
    "totalMarks": 100,
    "timeMinutes": 150
  },
  "questions": [
    {
      "questionNumber": "1",
      "section": "A",
      "text": "Evaluate 3/4 + 2/5 - 1/2",
      "marks": 3,
      "hasImage": false,
      "imageUrl": null,
      "topic": null,
      "subTopic": null,
      "answer": null,
      "subQuestions": null
    },
    {
      "questionNumber": "15",
      "section": "B",
      "text": "The figure below shows a triangle ABC.",
      "marks": 10,
      "hasImage": false,
      "imageUrl": null,
      "topic": null,
      "subTopic": null,
      "answer": null,
      "subQuestions": [
        { "label": "a", "text": "Find the length of AB", "marks": 3 },
        { "label": "b", "text": "Calculate the area", "marks": 4 }
      ]
    }
  ],
  "diagrams": [
    { "filename": "KCSE_2024_Math_P1_p3_d1.png", "page": 3 }
  ]
}
```

## Tips

- **Faded scans**: Use higher DPI (`--dpi 400`) for better OCR
- **Handwritten papers**: Tesseract struggles — use printed exams only
- **Review JSON before importing**: OCR isn't perfect, fix obvious errors
- **Diagrams**: Manually link diagram images to questions after import (via the web UI edit page)
