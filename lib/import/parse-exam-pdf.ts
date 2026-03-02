/**
 * Parses extracted PDF text from Kenyan exam papers into structured questions.
 *
 * Handles common patterns:
 *  - "SECTION A", "SECTION B", etc.
 *  - "1.", "2.", ... numbered questions
 *  - "(a)", "(b)", ... sub-questions
 *  - "(3 marks)", "(2mks)", "[4 marks]" marks annotations
 *  - Total marks from header (e.g. "TIME: 2½ HOURS", "Maximum marks: 80")
 */

export interface ParsedSubQuestion {
  label: string;
  text: string;
  marks: number | null;
}

export interface ParsedQuestion {
  questionNumber: string;
  section: string;
  text: string;
  marks: number | null;
  subQuestions: ParsedSubQuestion[];
}

export interface ParsedPaper {
  subject: string;
  gradeLevel: string;
  year: number | null;
  term: number | null;
  examType: string;
  school: string;
  totalMarks: number | null;
  timeMinutes: number | null;
  paperNumber: number | null;
  questions: ParsedQuestion[];
  rawText: string;
}

// ─── Header extraction helpers ───

function extractYear(text: string): number | null {
  // Look for 4-digit years 2010-2029
  const m = text.match(/\b(20[12]\d)\b/);
  return m ? Number(m[1]) : null;
}

function extractSubject(text: string): string {
  const subjects = [
    "Mathematics", "English", "Kiswahili", "Biology", "Chemistry", "Physics",
    "History", "Geography", "CRE", "IRE", "Business Studies", "Agriculture",
    "Home Science", "Computer Studies", "Art and Design", "Music",
    "French", "German", "Arabic", "Integrated Science", "Social Studies",
  ];
  const upper = text.toUpperCase();
  for (const s of subjects) {
    if (upper.includes(s.toUpperCase())) return s;
  }
  // Try common abbreviations
  if (/\bMATHS?\b/i.test(text)) return "Mathematics";
  if (/\bBIO\b/i.test(text)) return "Biology";
  if (/\bCHEM\b/i.test(text)) return "Chemistry";
  if (/\bPHY\b/i.test(text)) return "Physics";
  if (/\bHIST\b/i.test(text)) return "History";
  if (/\bGEO\b/i.test(text)) return "Geography";
  if (/\bB\.?\s*STUDIES\b/i.test(text)) return "Business Studies";
  if (/\bAGRI\b/i.test(text)) return "Agriculture";
  if (/\bCOMP\b/i.test(text)) return "Computer Studies";
  return "";
}

function extractGradeLevel(text: string): string {
  const m = text.match(/\bFORM\s+(\d)\b/i) || text.match(/\bF\.?\s*(\d)\b/i);
  if (m) return `Form ${m[1]}`;
  const g = text.match(/\bGRADE\s+(\d{1,2})\b/i);
  if (g) return `Grade ${g[1]}`;
  return "";
}

function extractExamType(text: string): string {
  const upper = text.toUpperCase();
  if (upper.includes("KCSE")) return "KCSE";
  if (upper.includes("PRE-MOCK") || upper.includes("PRE MOCK")) return "Pre-Mock";
  if (upper.includes("MOCK")) return "Mock";
  if (upper.includes("MID TERM") || upper.includes("MID-TERM") || upper.includes("MIDTERM")) return "Mid Term";
  if (upper.includes("END TERM") || upper.includes("END-TERM") || upper.includes("ENDTERM")) return "End Term";
  if (upper.includes("OPENING TERM")) return "Opening Term";
  if (upper.includes("CAT")) return "CAT";
  return "End Term";
}

function extractTerm(text: string): number | null {
  const m = text.match(/\bTERM\s+([1-3])\b/i);
  return m ? Number(m[1]) : null;
}

function extractTotalMarks(text: string): number | null {
  const m = text.match(/(?:maximum|total)\s*(?:marks?)?\s*[:\-]?\s*(\d+)/i)
    || text.match(/(\d+)\s*marks?\s*$/im);
  return m ? Number(m[1]) : null;
}

function extractTimeMinutes(text: string): number | null {
  // "2½ hours", "2.5 hours", "2 hours", "2 hrs", "120 minutes"
  const hm = text.match(/(\d+)\s*[½¼¾]?\s*(?:hours?|hrs?)/i);
  if (hm) {
    let mins = Number(hm[1]) * 60;
    if (/½/.test(hm[0])) mins += 30;
    if (/¼/.test(hm[0])) mins += 15;
    if (/¾/.test(hm[0])) mins += 45;
    return mins;
  }
  const mm = text.match(/(\d+)\s*(?:minutes?|mins?)/i);
  return mm ? Number(mm[1]) : null;
}

function extractPaperNumber(text: string): number | null {
  const m = text.match(/\bPAPER\s+(\d)\b/i) || text.match(/\bP\.?\s*(\d)\b/i);
  return m ? Number(m[1]) : null;
}

function extractSchool(text: string): string {
  // Look for lines ending with "SCHOOL", "SECONDARY", "HIGH" etc.
  const lines = text.split("\n").slice(0, 15);
  for (const line of lines) {
    const trimmed = line.trim();
    if (/(?:SCHOOL|SECONDARY|HIGH|ACADEMY|COLLEGE|GIRLS|BOYS)\s*$/i.test(trimmed) && trimmed.length < 80) {
      return trimmed;
    }
  }
  return "";
}

// ─── Marks extraction from question text ───

function extractMarksFromText(text: string): { clean: string; marks: number | null } {
  // Match patterns like (3 marks), (2mks), [4 marks], (3 mks), (1 mark)
  const marksRegex = /[\(\[]\s*(\d+)\s*(?:marks?|mks?)\s*[\)\]]/gi;
  let totalMarks = 0;
  let foundAny = false;
  let clean = text;

  // Find the LAST marks annotation (usually the total for that question)
  const matches = [...text.matchAll(marksRegex)];
  if (matches.length > 0) {
    const last = matches[matches.length - 1];
    totalMarks = Number(last[1]);
    foundAny = true;
    // Remove all marks annotations from the text
    clean = text.replace(marksRegex, "").trim();
  }

  return { clean, marks: foundAny ? totalMarks : null };
}

// ─── Main parser ───

export function parseExamPdf(rawText: string): ParsedPaper {
  // Use only first ~30 lines for header info
  const headerText = rawText.split("\n").slice(0, 30).join("\n");

  const paper: ParsedPaper = {
    subject: extractSubject(headerText),
    gradeLevel: extractGradeLevel(headerText),
    year: extractYear(headerText),
    term: extractTerm(headerText),
    examType: extractExamType(headerText),
    school: extractSchool(headerText),
    totalMarks: extractTotalMarks(headerText),
    timeMinutes: extractTimeMinutes(headerText),
    paperNumber: extractPaperNumber(headerText),
    questions: [],
    rawText,
  };

  // Split into lines and parse
  const lines = rawText.split("\n");
  let currentSection = "";
  let currentQuestion: ParsedQuestion | null = null;
  let currentSubQ: ParsedSubQuestion | null = null;

  // Patterns
  const sectionRegex = /^\s*SECTION\s+([A-E])\b/i;
  const questionRegex = /^\s*(\d{1,2})\s*[.)]\s*(.*)/;
  const subQuestionRegex = /^\s*\(([a-z])\)\s*(.*)/i;
  const romanSubRegex = /^\s*\(([ivxIVX]+)\)\s*(.*)/;

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Section header
    const secMatch = trimmed.match(sectionRegex);
    if (secMatch) {
      // Save current question before switching section
      if (currentSubQ && currentQuestion) {
        currentQuestion.subQuestions.push(currentSubQ);
        currentSubQ = null;
      }
      if (currentQuestion) {
        paper.questions.push(currentQuestion);
        currentQuestion = null;
      }
      currentSection = secMatch[1].toUpperCase();
      continue;
    }

    // Main question number (e.g. "1. State two...")
    const qMatch = trimmed.match(questionRegex);
    if (qMatch) {
      // Save previous
      if (currentSubQ && currentQuestion) {
        currentQuestion.subQuestions.push(currentSubQ);
        currentSubQ = null;
      }
      if (currentQuestion) {
        paper.questions.push(currentQuestion);
      }

      const { clean, marks } = extractMarksFromText(qMatch[2]);
      currentQuestion = {
        questionNumber: qMatch[1],
        section: currentSection,
        text: clean,
        marks,
        subQuestions: [],
      };
      continue;
    }

    // Sub-question (a), (b) etc.
    const subMatch = trimmed.match(subQuestionRegex) || trimmed.match(romanSubRegex);
    if (subMatch && currentQuestion) {
      if (currentSubQ) {
        currentQuestion.subQuestions.push(currentSubQ);
      }
      const { clean, marks } = extractMarksFromText(subMatch[2]);
      currentSubQ = {
        label: subMatch[1].toLowerCase(),
        text: clean,
        marks,
      };
      continue;
    }

    // Continuation line — append to current sub-question or question
    if (currentSubQ) {
      const { clean, marks } = extractMarksFromText(trimmed);
      currentSubQ.text += " " + clean;
      if (marks !== null) currentSubQ.marks = marks;
    } else if (currentQuestion) {
      const { clean, marks } = extractMarksFromText(trimmed);
      currentQuestion.text += " " + clean;
      if (marks !== null) currentQuestion.marks = marks;
    }
  }

  // Save last question
  if (currentSubQ && currentQuestion) {
    currentQuestion.subQuestions.push(currentSubQ);
  }
  if (currentQuestion) {
    paper.questions.push(currentQuestion);
  }

  // Clean up question texts
  for (const q of paper.questions) {
    q.text = q.text.replace(/\s+/g, " ").trim();
    for (const sq of q.subQuestions) {
      sq.text = sq.text.replace(/\s+/g, " ").trim();
    }
  }

  return paper;
}
