import { jsPDF } from "jspdf";

export interface ActivityFormExportData {
  experimentName: string;
  subject: string;
  grade: string;
  learningArea: string;
  activityDate: Date;
  classGroup: string | null;
  schoolName?: string | null;
  aim: string;
  materials: string[];
  procedure: string[];
  safetyNotes: string[];
  relatedConcepts: string[];
  observations: string | null;
  results: string | null;
  teacherNotes: string | null;
  // Teacher copy only
  expectedResults?: string;
  teacherCopy?: {
    discussionAnswers?: string;
    assessmentNotes?: string;
  };
}

const HEADER_COLOR = [55, 65, 81] as const;
const SAFETY_COLOR = [220, 38, 38] as const; // Red for safety
const GRAY_BG = [249, 250, 251] as const;
const LINE_HEIGHT = 5;

// ─── STUDENT COPY ───

export function generateStudentCopyPdf(data: ActivityFormExportData): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function checkPageBreak(needed: number) {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  function drawSectionHeader(title: string, color: readonly [number, number, number] = HEADER_COLOR) {
    checkPageBreak(10);
    doc.setFillColor(...color);
    doc.rect(margin, y, contentWidth, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 3, y + 5);
    doc.setTextColor(0, 0, 0);
    y += 9;
  }

  function drawList(items: string[], numbered = false) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    items.forEach((item, idx) => {
      const prefix = numbered ? `${idx + 1}. ` : "• ";
      const cleanItem = item.replace(/^\d+\.\s*/, ""); // Remove existing numbering
      const text = prefix + cleanItem;
      const lines = doc.splitTextToSize(text, contentWidth - 8);

      checkPageBreak(lines.length * LINE_HEIGHT + 2);
      doc.text(lines, margin + 3, y + 2);
      y += lines.length * LINE_HEIGHT + 1;
    });
    y += 2;
  }

  function drawBlankLines(count: number, label: string) {
    checkPageBreak(count * LINE_HEIGHT + 10);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    doc.text(label, margin + 3, y + 2);
    doc.setTextColor(0, 0, 0);
    y += 5;

    for (let i = 0; i < count; i++) {
      checkPageBreak(6);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin + 3, y, pageWidth - margin - 3, y);
      y += 6;
    }
    y += 3;
  }

  // ─── School Name (if provided) ───
  if (data.schoolName) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...HEADER_COLOR);
    doc.text(data.schoolName.toUpperCase(), pageWidth / 2, y, { align: "center" });
    y += 7;
  }

  // ─── Title ───
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...HEADER_COLOR);
  doc.text("STUDENT ACTIVITY FORM", pageWidth / 2, y, { align: "center" });
  y += 8;

  doc.setFontSize(13);
  const titleLines = doc.splitTextToSize(data.experimentName, contentWidth);
  doc.text(titleLines, pageWidth / 2, y, { align: "center" });
  y += titleLines.length * 6 + 6;

  // ─── Student Info ───
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const infoY = y;
  doc.text(`Name: ${"_".repeat(40)}`, margin + 3, infoY);
  doc.text(`Date: ${data.activityDate.toLocaleDateString("en-KE")}`, pageWidth - margin - 50, infoY);
  y += 7;

  if (data.classGroup) {
    doc.text(`Class/Group: ${data.classGroup}`, margin + 3, y);
  } else {
    doc.text(`Class/Group: ${"_".repeat(30)}`, margin + 3, y);
  }
  y += 10;

  // ─── Aim ───
  drawSectionHeader("AIM");
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const aimLines = doc.splitTextToSize(data.aim, contentWidth - 6);
  checkPageBreak(aimLines.length * LINE_HEIGHT + 4);
  doc.text(aimLines, margin + 3, y + 2);
  y += aimLines.length * LINE_HEIGHT + 6;

  // ─── Materials ───
  drawSectionHeader("MATERIALS");
  drawList(data.materials, false);

  // ─── Procedure ───
  drawSectionHeader("PROCEDURE");
  drawList(data.procedure, true);

  // ─── Safety Notes ───
  if (data.safetyNotes.length > 0) {
    drawSectionHeader("⚠ SAFETY NOTES", SAFETY_COLOR);
    doc.setTextColor(150, 0, 0);
    drawList(data.safetyNotes, false);
    doc.setTextColor(0, 0, 0);
  }

  // ─── Observations ───
  drawSectionHeader("OBSERVATIONS");
  if (data.observations) {
    doc.setFontSize(9);
    const obsLines = doc.splitTextToSize(data.observations, contentWidth - 6);
    checkPageBreak(obsLines.length * LINE_HEIGHT + 4);
    doc.text(obsLines, margin + 3, y + 2);
    y += obsLines.length * LINE_HEIGHT + 6;
  } else {
    drawBlankLines(8, "Record what you observed during the experiment:");
  }

  // ─── Results ───
  drawSectionHeader("RESULTS");
  if (data.results) {
    doc.setFontSize(9);
    const resLines = doc.splitTextToSize(data.results, contentWidth - 6);
    checkPageBreak(resLines.length * LINE_HEIGHT + 4);
    doc.text(resLines, margin + 3, y + 2);
    y += resLines.length * LINE_HEIGHT + 6;
  } else {
    drawBlankLines(6, "Summarize the results:");
  }

  // ─── Discussion Questions ───
  drawSectionHeader("DISCUSSION");
  drawBlankLines(10, "Answer the following in relation to the concepts you've learned:");

  // ─── Related Concepts ───
  if (data.relatedConcepts.length > 0) {
    drawSectionHeader("RELATED CONCEPTS");
    doc.setFontSize(9);
    const concepts = data.relatedConcepts.join(" • ");
    const conceptLines = doc.splitTextToSize(concepts, contentWidth - 6);
    checkPageBreak(conceptLines.length * LINE_HEIGHT + 4);
    doc.text(conceptLines, margin + 3, y + 2);
    y += conceptLines.length * LINE_HEIGHT + 6;
  }

  // ─── Footer ───
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated by MwalimuKit — Student Copy — Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }

  return Buffer.from(doc.output("arraybuffer"));
}

// ─── TEACHER COPY ───

export function generateTeacherCopyPdf(data: ActivityFormExportData): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function checkPageBreak(needed: number) {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  function drawSectionHeader(title: string, color: readonly [number, number, number] = HEADER_COLOR) {
    checkPageBreak(10);
    doc.setFillColor(...color);
    doc.rect(margin, y, contentWidth, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 3, y + 5);
    doc.setTextColor(0, 0, 0);
    y += 9;
  }

  function drawList(items: string[], numbered = false) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    items.forEach((item, idx) => {
      const prefix = numbered ? `${idx + 1}. ` : "• ";
      const cleanItem = item.replace(/^\d+\.\s*/, "");
      const text = prefix + cleanItem;
      const lines = doc.splitTextToSize(text, contentWidth - 8);

      checkPageBreak(lines.length * LINE_HEIGHT + 2);
      doc.text(lines, margin + 3, y + 2);
      y += lines.length * LINE_HEIGHT + 1;
    });
    y += 2;
  }

  function drawTextSection(text: string) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, contentWidth - 6);

    let lineIdx = 0;
    while (lineIdx < lines.length) {
      const pageHeight = doc.internal.pageSize.getHeight();
      const availableLines = Math.floor((pageHeight - margin - y) / LINE_HEIGHT);
      const chunk = lines.slice(lineIdx, lineIdx + Math.max(1, availableLines));

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

  // ─── School Name (if provided) ───
  if (data.schoolName) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...HEADER_COLOR);
    doc.text(data.schoolName.toUpperCase(), pageWidth / 2, y, { align: "center" });
    y += 7;
  }

  // ─── Title ───
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...HEADER_COLOR);
  doc.text("TEACHER'S COPY", pageWidth / 2, y, { align: "center" });
  y += 6;

  doc.setFontSize(13);
  const titleLines = doc.splitTextToSize(data.experimentName, contentWidth);
  doc.text(titleLines, pageWidth / 2, y, { align: "center" });
  y += titleLines.length * 6 + 4;

  // Teacher note
  doc.setFillColor(254, 243, 199); // Light yellow
  doc.rect(margin, y, contentWidth, 8, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text("⚠ This copy contains expected results and discussion answers. For students only distribute the Student Copy.", margin + 3, y + 5);
  y += 12;

  // ─── Info ───
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${data.activityDate.toLocaleDateString("en-KE")}`, margin + 3, y);
  if (data.classGroup) {
    doc.text(`Class/Group: ${data.classGroup}`, margin + 3, y + 5);
    y += 10;
  } else {
    y += 8;
  }

  // ─── Aim ───
  drawSectionHeader("AIM");
  drawTextSection(data.aim);

  // ─── Materials ───
  drawSectionHeader("MATERIALS");
  drawList(data.materials, false);

  // ─── Procedure ───
  drawSectionHeader("PROCEDURE");
  drawList(data.procedure, true);

  // ─── Safety Notes ───
  if (data.safetyNotes.length > 0) {
    drawSectionHeader("⚠ SAFETY NOTES", SAFETY_COLOR);
    doc.setTextColor(150, 0, 0);
    drawList(data.safetyNotes, false);
    doc.setTextColor(0, 0, 0);
  }

  // ─── Expected Results ───
  if (data.expectedResults) {
    drawSectionHeader("EXPECTED RESULTS");
    drawTextSection(data.expectedResults);
  }

  // ─── Student Observations (if recorded) ───
  if (data.observations) {
    drawSectionHeader("OBSERVATIONS (Recorded)");
    drawTextSection(data.observations);
  }

  // ─── Student Results (if recorded) ───
  if (data.results) {
    drawSectionHeader("RESULTS (Recorded)");
    drawTextSection(data.results);
  }

  // ─── AI Discussion Answers ───
  if (data.teacherCopy?.discussionAnswers) {
    drawSectionHeader("DISCUSSION GUIDE");
    drawTextSection(data.teacherCopy.discussionAnswers);
  }

  // ─── Assessment Notes ───
  if (data.teacherCopy?.assessmentNotes) {
    drawSectionHeader("ASSESSMENT NOTES");
    drawTextSection(data.teacherCopy.assessmentNotes);
  }

  // ─── Teacher Notes (if any) ───
  if (data.teacherNotes) {
    drawSectionHeader("PERSONAL NOTES");
    drawTextSection(data.teacherNotes);
  }

  // ─── Related Concepts ───
  if (data.relatedConcepts.length > 0) {
    drawSectionHeader("RELATED CONCEPTS");
    doc.setFontSize(9);
    const concepts = data.relatedConcepts.join(" • ");
    const conceptLines = doc.splitTextToSize(concepts, contentWidth - 6);
    checkPageBreak(conceptLines.length * LINE_HEIGHT + 4);
    doc.text(conceptLines, margin + 3, y + 2);
    y += conceptLines.length * LINE_HEIGHT + 6;
  }

  // ─── Footer ───
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated by MwalimuKit — Teacher Copy — Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }

  return Buffer.from(doc.output("arraybuffer"));
}
