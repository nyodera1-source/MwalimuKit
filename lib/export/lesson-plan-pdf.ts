import { jsPDF } from "jspdf";
import type { LessonPlanExportData } from "./lesson-plan-types";

export function generateLessonPlanPdf(data: LessonPlanExportData): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const HEADER_COLOR = [39, 55, 78] as const;
  const TEXT_COLOR = [31, 41, 55] as const;
  const MUTED_COLOR = [100, 116, 139] as const;
  const LABEL_BG = [242, 246, 250] as const;
  const BORDER_COLOR = [203, 213, 225] as const;
  const ACCENT_COLOR = [238, 122, 32] as const;
  const LINE_HEIGHT = 4.5;
  const LABEL_WIDTH = 48;
  const BOTTOM_LIMIT = doc.internal.pageSize.getHeight() - margin - 8;

  function checkPageBreak(needed: number) {
    if (y + needed > BOTTOM_LIMIT) {
      doc.addPage();
      y = margin;
    }
  }

  function estimateRowHeight(value: string, valueWidth = contentWidth - LABEL_WIDTH) {
    const lines = doc.splitTextToSize(value || "Not specified", valueWidth - 6);
    return Math.max(7, lines.length * LINE_HEIGHT + 3);
  }

  function formatActivity(value: string | undefined) {
    if (!value?.trim()) return "Not specified";
    return value
      .split(/\r?\n/)
      .map((line) => line.replace(/^Learners work on:\s*/i, "- ").trim())
      .filter(Boolean)
      .join("\n");
  }

  function formatTitle(title: string) {
    return title.replace(/\s+-\s+/g, " | ");
  }

  function drawSectionHeader(title: string) {
    checkPageBreak(12);
    doc.setFillColor(...HEADER_COLOR);
    doc.rect(margin, y, contentWidth, 7, "F");
    doc.setFillColor(...ACCENT_COLOR);
    doc.rect(margin, y, 2.5, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 3, y + 5);
    doc.setTextColor(0, 0, 0);
    y += 10;
  }

  function drawRow(label: string, value: string, emptyValue = "Not specified") {
    const labelWidth = LABEL_WIDTH;
    const valueWidth = contentWidth - labelWidth;
    const valueLines = doc.splitTextToSize(value?.trim() || emptyValue, valueWidth - 6);
    const rowHeight = Math.max(7, valueLines.length * LINE_HEIGHT + 3);

    checkPageBreak(rowHeight + 1);
    doc.setDrawColor(...BORDER_COLOR);
    doc.setLineWidth(0.25);

    // Label cell
    doc.setFillColor(...LABEL_BG);
    doc.rect(margin, y, labelWidth, rowHeight, "FD");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...TEXT_COLOR);
    doc.text(label, margin + 2, y + 4.5);

    // Value cell
    doc.rect(margin + labelWidth, y, valueWidth, rowHeight, "D");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    doc.setTextColor(...TEXT_COLOR);
    doc.text(valueLines, margin + labelWidth + 3, y + 4.5);

    y += rowHeight;
  }

  function drawListRow(label: string, items: string[]) {
    if (items.length === 0) {
      drawRow(label, "", "Not specified");
      return;
    }

    const labelWidth = LABEL_WIDTH;
    const valueWidth = contentWidth - labelWidth;
    const bulletLines: string[] = [];
    for (const item of items) {
      const wrapped = doc.splitTextToSize(`- ${item}`, valueWidth - 8);
      bulletLines.push(...wrapped);
    }
    const rowHeight = Math.max(7, bulletLines.length * LINE_HEIGHT + 3);

    checkPageBreak(rowHeight + 1);

    doc.setDrawColor(...BORDER_COLOR);
    doc.setLineWidth(0.25);
    doc.setFillColor(...LABEL_BG);
    doc.rect(margin, y, labelWidth, rowHeight, "FD");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...TEXT_COLOR);
    doc.text(label, margin + 2, y + 4.5);

    doc.rect(margin + labelWidth, y, valueWidth, rowHeight, "D");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    doc.setTextColor(...TEXT_COLOR);
    doc.text(bulletLines, margin + labelWidth + 3, y + 4.5);

    y += rowHeight;
  }

  // "LESSON PLAN" header
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...HEADER_COLOR);
  doc.text("LESSON PLAN", pageWidth / 2, y, { align: "center" });
  y += 7;

  // School name (if available)
  if (data.schoolName) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED_COLOR);
    doc.text(data.schoolName, pageWidth / 2, y, { align: "center" });
    y += 6;
  }

  // Divider line
  doc.setDrawColor(...HEADER_COLOR);
  doc.setLineWidth(0.35);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // Title
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...HEADER_COLOR);
  const titleLines = doc.splitTextToSize(formatTitle(data.title), contentWidth);
  doc.text(titleLines, pageWidth / 2, y, { align: "center" });
  y += titleLines.length * 5 + 2;

  // Sub-header
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED_COLOR);
  doc.text(
    `Teacher: ${data.teacherName}  |  Date: ${data.date}  |  Duration: ${data.duration} min`,
    pageWidth / 2,
    y,
    { align: "center" }
  );
  doc.setTextColor(0, 0, 0);
  y += 8;

  // Curriculum Details
  drawSectionHeader("Curriculum Details");
  drawRow("Grade", data.grade);
  drawRow("Learning Area", data.learningArea);
  drawRow("Strand", data.strand);
  drawRow("Sub-Strand", data.subStrand);
  drawListRow("Specific Learning Outcomes", data.slos);
  drawRow("Core Competencies", data.competencies.join(", "));
  y += 3;

  // Lesson Content
  drawSectionHeader("Lesson Content");
  drawRow("Lesson Objectives", data.objectives);
  drawRow("Key Inquiry Question", data.keyInquiryQuestion);
  drawRow("Learning Resources", data.resources);
  if (data.digitalResources?.trim()) {
    drawRow("Digital Resources", data.digitalResources);
  }
  y += 3;

  // Teaching Activities
  const activityValues = [
    formatActivity(data.activities.introduction),
    formatActivity(data.activities.development),
    formatActivity(data.activities.conclusion),
  ];
  const activityHeight =
    12 + activityValues.reduce((total, value) => total + estimateRowHeight(value), 0);
  checkPageBreak(activityHeight);
  drawSectionHeader("Teaching & Learning Activities");
  drawRow("Introduction", activityValues[0]);
  drawRow("Development", activityValues[1]);
  drawRow("Conclusion", activityValues[2]);
  y += 3;

  // Assessment and Reflection
  drawSectionHeader("Assessment and Reflection");
  drawRow("Assessment Strategy", data.assessmentStrategy);
  drawRow("Assessment Details", data.assessmentDescription);
  drawRow(
    "Reflection",
    data.reflection?.trim() ? data.reflection : "To be completed after the lesson."
  );

  // Footer on each page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED_COLOR);
    doc.text(
      `MwalimuKit  -  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }

  return Buffer.from(doc.output("arraybuffer"));
}
