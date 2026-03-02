import { jsPDF } from "jspdf";

export interface ExamExportData {
  title: string;
  grade: string;
  learningArea: string;
  examType: string;
  assessmentType: string;
  term: number;
  year: number;
  totalMarks: number | null;
  timeMinutes: number | null;
  instructions: string | null;
  teacherName: string;
  questions: {
    orderNum: number;
    section: string | null;
    text: string;
    marks: number;
    imageUrl: string | null;
    hasImage: boolean;
    answer: string | null;
    subQuestions: { label: string; text: string; marks: number }[] | null;
  }[];
}

const ASSESSMENT_LABELS: Record<string, string> = {
  end_term: "END OF TERM EXAMINATION",
  mid_term: "MID-TERM EXAMINATION",
  cat: "CONTINUOUS ASSESSMENT TEST",
  opener: "OPENING TERM ASSESSMENT",
  formative: "FORMATIVE ASSESSMENT",
};

export function generateExamPdf(data: ExamExportData): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // ─── Header ───
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(data.title.toUpperCase(), pageWidth / 2, y, { align: "center" });
  y += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${data.grade} - ${data.learningArea}`,
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 6;

  const assessmentLabel = ASSESSMENT_LABELS[data.assessmentType] || data.assessmentType.toUpperCase();
  doc.setFont("helvetica", "bold");
  doc.text(assessmentLabel, pageWidth / 2, y, { align: "center" });
  y += 6;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Term ${data.term}, ${data.year}`, pageWidth / 2, y, { align: "center" });
  y += 8;

  // Time and marks line
  const metaLines: string[] = [];
  if (data.timeMinutes) metaLines.push(`Time: ${data.timeMinutes} minutes`);
  if (data.totalMarks) metaLines.push(`Total Marks: ${data.totalMarks}`);
  if (metaLines.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    if (metaLines.length === 2) {
      doc.text(metaLines[0], margin, y);
      doc.text(metaLines[1], pageWidth - margin, y, { align: "right" });
    } else {
      doc.text(metaLines[0], pageWidth / 2, y, { align: "center" });
    }
    y += 6;
  }

  // Horizontal rule
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Instructions
  if (data.instructions) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    const instrLines = doc.splitTextToSize(data.instructions, contentWidth);
    for (const line of instrLines) {
      if (y > pageHeight - 25) { doc.addPage(); y = margin; }
      doc.text(line, margin, y);
      y += 4.5;
    }
    y += 4;

    doc.setDrawColor(180);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  }

  // ─── Questions by section ───
  doc.setFont("helvetica", "normal");

  const sections = [...new Set(data.questions.map((q) => q.section || "A"))].sort();

  for (const section of sections) {
    const sectionQs = data.questions.filter((q) => (q.section || "A") === section);
    if (sectionQs.length === 0) continue;

    // Section header
    if (y > pageHeight - 30) { doc.addPage(); y = margin; }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`SECTION ${section}`, margin, y);
    y += 7;

    // Questions
    for (let i = 0; i < sectionQs.length; i++) {
      const q = sectionQs[i];

      if (y > pageHeight - 30) { doc.addPage(); y = margin; }

      // Question number + marks
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`${q.orderNum}.`, margin, y);

      // Marks right-aligned
      const marksText = `(${q.marks} mark${q.marks !== 1 ? "s" : ""})`;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(marksText, pageWidth - margin, y, { align: "right" });

      // Question text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const qTextWidth = contentWidth - 30; // Leave room for marks
      const textLines = doc.splitTextToSize(q.text, qTextWidth);
      for (let li = 0; li < textLines.length; li++) {
        if (li > 0 && y > pageHeight - 20) { doc.addPage(); y = margin; }
        doc.text(textLines[li], margin + 8, y);
        y += 5;
      }

      // Image placeholder
      if (q.hasImage && q.imageUrl) {
        if (y > pageHeight - 50) { doc.addPage(); y = margin; }
        try {
          doc.addImage(q.imageUrl, "JPEG", margin + 8, y, 60, 40);
          y += 44;
        } catch {
          // If image fails, add placeholder
          doc.setDrawColor(200);
          doc.rect(margin + 8, y, 60, 30);
          doc.setFontSize(8);
          doc.text("[Image]", margin + 30, y + 16, { align: "center" });
          y += 34;
        }
      }

      // Sub-questions
      if (q.subQuestions && q.subQuestions.length > 0) {
        for (const sq of q.subQuestions) {
          if (y > pageHeight - 20) { doc.addPage(); y = margin; }
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");

          const sqMarks = sq.marks > 0 ? ` (${sq.marks} mk${sq.marks !== 1 ? "s" : ""})` : "";
          const sqText = `(${sq.label}) ${sq.text}`;
          const sqLines = doc.splitTextToSize(sqText, qTextWidth - 8);
          for (const sLine of sqLines) {
            doc.text(sLine, margin + 14, y);
            y += 5;
          }
          if (sqMarks) {
            doc.setFontSize(9);
            doc.text(sqMarks, pageWidth - margin, y - 5, { align: "right" });
          }
        }
      }

      y += 4; // Gap between questions
    }

    y += 3; // Gap between sections
  }

  // ─── Footer on all pages ───
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: "center" });
    doc.setTextColor(0);
  }

  return Buffer.from(doc.output("arraybuffer"));
}

export function generateMarkingSchemePdf(data: ExamExportData): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // ─── Header ───
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("MARKING SCHEME", pageWidth / 2, y, { align: "center" });
  y += 8;

  doc.setFontSize(11);
  doc.text(data.title.toUpperCase(), pageWidth / 2, y, { align: "center" });
  y += 6;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${data.grade} - ${data.learningArea} | Term ${data.term}, ${data.year}`,
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 8;

  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // ─── Questions with answers ───
  for (const q of data.questions) {
    if (y > pageHeight - 30) { doc.addPage(); y = margin; }

    // Question number + marks
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Q${q.orderNum}. (${q.marks} mark${q.marks !== 1 ? "s" : ""})`, margin, y);
    y += 5;

    // Question text (abbreviated)
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100);
    const qPreview = q.text.length > 120 ? q.text.substring(0, 120) + "..." : q.text;
    const previewLines = doc.splitTextToSize(qPreview, contentWidth - 10);
    for (const line of previewLines) {
      if (y > pageHeight - 20) { doc.addPage(); y = margin; }
      doc.text(line, margin + 5, y);
      y += 4.5;
    }
    doc.setTextColor(0);
    y += 2;

    // Expected answer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Expected Answer:", margin + 5, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    if (q.subQuestions && q.subQuestions.length > 0) {
      // Show sub-question answers if available
      for (const sq of q.subQuestions) {
        if (y > pageHeight - 20) { doc.addPage(); y = margin; }
        doc.setFont("helvetica", "bold");
        doc.text(`(${sq.label})`, margin + 8, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${sq.text} [${sq.marks}mk${sq.marks !== 1 ? "s" : ""}]`, margin + 18, y);
        y += 5;
      }
    }

    // Main answer text (marking scheme)
    const answerText = q.answer || "No answer provided";
    if (typeof answerText === "string" && answerText.length > 0) {
      const answerLines = doc.splitTextToSize(answerText, contentWidth - 15);
      for (const line of answerLines) {
        if (y > pageHeight - 20) { doc.addPage(); y = margin; }
        doc.text(line, margin + 8, y);
        y += 4.5;
      }
    }

    y += 4;

    // Separator
    doc.setDrawColor(220);
    doc.setLineWidth(0.2);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  }

  // ─── Footer ───
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: "center" });
    doc.setTextColor(0);
  }

  return Buffer.from(doc.output("arraybuffer"));
}
