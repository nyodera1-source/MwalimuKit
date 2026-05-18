import { jsPDF } from "jspdf";

export interface AssignmentPdfQuestion {
  orderNum: number;
  text: string;
  marks: number;
  answer?: string | null;
  cognitiveLevel?: string | null;
}

export interface AssignmentExportData {
  title: string;
  grade: string;
  learningArea: string;
  assignmentType: string;
  term: number;
  year: number;
  weekNumber: number | null;
  totalMarks: number | null;
  timeMinutes: number | null;
  instructions: string | null;
  questions: AssignmentPdfQuestion[];
}

const ASSIGNMENT_LABELS: Record<string, string> = {
  weekly: "WEEKLY ASSIGNMENT",
  mid_term: "MID-TERM ASSIGNMENT",
  end_term: "END-TERM ASSIGNMENT",
};

function ensureSpace(doc: jsPDF, y: number, needed = 24) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y > pageHeight - needed) {
    doc.addPage();
    return 20;
  }
  return y;
}

export function generateAssignmentPdf(data: AssignmentExportData): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(data.title.toUpperCase(), pageWidth / 2, y, { align: "center" });
  y += 8;

  doc.setFontSize(11);
  doc.text(ASSIGNMENT_LABELS[data.assignmentType] || "ASSIGNMENT", pageWidth / 2, y, { align: "center" });
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`${data.grade} - ${data.learningArea}`, pageWidth / 2, y, { align: "center" });
  y += 6;

  const meta: string[] = [`Term ${data.term}, ${data.year}`];
  if (data.assignmentType === "weekly" && data.weekNumber) meta.push(`Week ${data.weekNumber}`);
  if (data.timeMinutes) meta.push(`${data.timeMinutes} minutes`);
  if (data.totalMarks) meta.push(`${data.totalMarks} marks`);
  doc.text(meta.join(" | "), pageWidth / 2, y, { align: "center" });
  y += 8;

  doc.setDrawColor(0);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  if (data.instructions) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(data.instructions, contentWidth);
    for (const line of lines) {
      y = ensureSpace(doc, y, 18);
      doc.text(line, margin, y);
      y += 4.5;
    }
    y += 4;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Questions", margin, y);
  y += 7;

  for (const question of data.questions) {
    y = ensureSpace(doc, y, 24);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`${question.orderNum}.`, margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`(${question.marks} mark${question.marks === 1 ? "" : "s"})`, pageWidth - margin, y, { align: "right" });

    doc.setFontSize(10);
    const lines = doc.splitTextToSize(question.text, contentWidth - 26);
    for (let i = 0; i < lines.length; i++) {
      if (i > 0) y = ensureSpace(doc, y, 16);
      doc.text(lines[i], margin + 8, y);
      y += 5;
    }

    y += 5;
  }

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`Page ${page} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: "center" });
    doc.setTextColor(0);
  }

  return Buffer.from(doc.output("arraybuffer"));
}

export function generateAssignmentAnswersPdf(data: AssignmentExportData): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ANSWER GUIDE", pageWidth / 2, y, { align: "center" });
  y += 8;
  doc.setFontSize(11);
  doc.text(data.title.toUpperCase(), pageWidth / 2, y, { align: "center" });
  y += 8;

  doc.setDrawColor(0);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  for (const question of data.questions) {
    y = ensureSpace(doc, y, 26);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`Q${question.orderNum}. (${question.marks} mark${question.marks === 1 ? "" : "s"})`, margin, y);
    y += 5;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100);
    const preview = question.text.length > 120 ? `${question.text.slice(0, 120)}...` : question.text;
    for (const line of doc.splitTextToSize(preview, contentWidth)) {
      y = ensureSpace(doc, y, 16);
      doc.text(line, margin + 5, y);
      y += 4.5;
    }

    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");
    const answer = question.answer || "No answer guide provided.";
    for (const line of doc.splitTextToSize(answer, contentWidth - 8)) {
      y = ensureSpace(doc, y, 16);
      doc.text(line, margin + 5, y);
      y += 4.5;
    }
    y += 5;
  }

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`Page ${page} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: "center" });
    doc.setTextColor(0);
  }

  return Buffer.from(doc.output("arraybuffer"));
}
