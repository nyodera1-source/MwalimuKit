import { jsPDF } from "jspdf";

export interface TeachingNotesExportData {
  title: string;
  grade: string;
  learningArea: string;
  strand: string;
  subStrand: string;
  noteType: string;
  schoolName?: string;
  classGroup?: string;
  introduction: string;
  keyConcepts: string;
  detailedExplanations: string;
  examples: string;
  studentActivities: string;
  assessmentQuestions: string;
  teacherTips: string;
}

const NOTE_TYPE_LABELS: Record<string, string> = {
  lecture: "Lecture Notes",
  discussion: "Discussion Guide",
  revision: "Revision Notes",
};

export function generateTeachingNotesPdf(
  data: TeachingNotesExportData
): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const HEADER_COLOR = [55, 65, 81] as const; // Professional dark gray
  const GRAY_BG = [249, 250, 251] as const; // Light gray
  const LINE_HEIGHT = 5;

  function checkPageBreak(needed: number) {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  function drawSectionHeader(title: string) {
    checkPageBreak(10);
    doc.setFillColor(...HEADER_COLOR);
    doc.rect(margin, y, contentWidth, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 3, y + 5);
    doc.setTextColor(0, 0, 0);
    y += 9;
  }

  function drawInfoRow(label: string, value: string) {
    const labelWidth = 40;
    const valueWidth = contentWidth / 2 - labelWidth;
    const lines = doc.splitTextToSize(value || "—", valueWidth - 4);
    const rowHeight = Math.max(7, lines.length * LINE_HEIGHT + 3);

    doc.setFillColor(...GRAY_BG);
    doc.rect(margin + (y % 2 === 0 ? 0 : contentWidth / 2), y, labelWidth, rowHeight, "FD");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(label, margin + 2, y + 4.5);

    doc.rect(margin + labelWidth, y, valueWidth, rowHeight, "D");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(lines, margin + labelWidth + 2, y + 4.5);

    return rowHeight;
  }

  function drawContentSection(title: string, text: string) {
    if (!text) return;

    drawSectionHeader(title);

    const lines = doc.splitTextToSize(text, contentWidth - 6);

    // Process in chunks to handle page breaks
    let lineIdx = 0;
    while (lineIdx < lines.length) {
      const pageHeight = doc.internal.pageSize.getHeight();
      const availableLines = Math.floor(
        (pageHeight - margin - y) / LINE_HEIGHT
      );
      const chunk = lines.slice(lineIdx, lineIdx + Math.max(1, availableLines));

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(chunk, margin + 3, y + 2);
      y += chunk.length * LINE_HEIGHT + 2;
      lineIdx += chunk.length;

      if (lineIdx < lines.length) {
        doc.addPage();
        y = margin;
      }
    }

    y += 3;
  }

  // ─── School Name ───
  if (data.schoolName) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(data.schoolName.toUpperCase(), pageWidth / 2, y, {
      align: "center",
    });
    y += 7;
  }

  // ─── Title ───
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...HEADER_COLOR);
  const titleLines = doc.splitTextToSize(
    data.title || "Teaching Notes",
    contentWidth
  );
  doc.text(titleLines, pageWidth / 2, y, { align: "center" });
  y += titleLines.length * 7 + 2;

  // Note type subtitle
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(
    NOTE_TYPE_LABELS[data.noteType] || data.noteType,
    pageWidth / 2,
    y,
    { align: "center" }
  );
  doc.setTextColor(0, 0, 0);
  y += 8;

  // ─── Header Info ───
  drawSectionHeader("Curriculum Details");

  const infoRows = [
    ["Grade", data.grade],
    ["Subject", data.learningArea],
    ["Strand", data.strand],
    ["Sub-Strand", data.subStrand],
  ];

  for (const [label, value] of infoRows) {
    const labelW = 35;
    const valueW = contentWidth - labelW;
    const lines = doc.splitTextToSize(value || "—", valueW - 6);
    const rowH = Math.max(7, lines.length * LINE_HEIGHT + 3);

    checkPageBreak(rowH + 2);

    doc.setFillColor(...GRAY_BG);
    doc.rect(margin, y, labelW, rowH, "FD");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(label, margin + 2, y + 4.5);

    doc.rect(margin + labelW, y, valueW, rowH, "D");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(lines, margin + labelW + 3, y + 4.5);

    y += rowH;
  }

  y += 4;

  // ─── Content Sections ───
  drawContentSection("Introduction / Overview", data.introduction);
  drawContentSection("Key Concepts & Definitions", data.keyConcepts);
  drawContentSection("Detailed Explanations", data.detailedExplanations);
  drawContentSection("Examples & Illustrations", data.examples);
  drawContentSection("Student Activities", data.studentActivities);
  drawContentSection("Assessment Questions", data.assessmentQuestions);
  drawContentSection(
    "Teacher's Tips / Common Misconceptions",
    data.teacherTips
  );

  // ─── Footer ───
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated by MwalimuKit — Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }

  return Buffer.from(doc.output("arraybuffer"));
}
