import { jsPDF } from "jspdf";
import type { LessonPlanExportData } from "./lesson-plan-types";

export function generateLessonPlanPdf(data: LessonPlanExportData): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const HEADER_COLOR = [55, 65, 81] as const; // Professional dark gray (gray-700)
  const GRAY_BG = [249, 250, 251] as const; // Light gray (gray-50)
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

  function drawRow(label: string, value: string) {
    const labelWidth = 45;
    const valueWidth = contentWidth - labelWidth;
    const valueLines = doc.splitTextToSize(value || "—", valueWidth - 6);
    const rowHeight = Math.max(7, valueLines.length * LINE_HEIGHT + 3);

    checkPageBreak(rowHeight + 2);

    // Label cell
    doc.setFillColor(...GRAY_BG);
    doc.rect(margin, y, labelWidth, rowHeight, "FD");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(label, margin + 2, y + 4.5);

    // Value cell
    doc.rect(margin + labelWidth, y, valueWidth, rowHeight, "D");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(valueLines, margin + labelWidth + 3, y + 4.5);

    y += rowHeight;
  }

  function drawListRow(label: string, items: string[]) {
    if (items.length === 0) {
      drawRow(label, "—");
      return;
    }

    const labelWidth = 45;
    const valueWidth = contentWidth - labelWidth;
    const bulletLines: string[] = [];
    for (const item of items) {
      const wrapped = doc.splitTextToSize(`- ${item}`, valueWidth - 8);
      bulletLines.push(...wrapped);
    }
    const rowHeight = Math.max(7, bulletLines.length * LINE_HEIGHT + 3);

    checkPageBreak(rowHeight + 2);

    doc.setFillColor(...GRAY_BG);
    doc.rect(margin, y, labelWidth, rowHeight, "FD");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(label, margin + 2, y + 4.5);

    doc.rect(margin + labelWidth, y, valueWidth, rowHeight, "D");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(bulletLines, margin + labelWidth + 3, y + 4.5);

    y += rowHeight;
  }

  // "LESSON PLAN" header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...HEADER_COLOR);
  doc.text("LESSON PLAN", pageWidth / 2, y, { align: "center" });
  y += 8;

  // School name (if available)
  if (data.schoolName) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(data.schoolName, pageWidth / 2, y, { align: "center" });
    y += 6;
  }

  // Divider line
  doc.setDrawColor(...HEADER_COLOR);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...HEADER_COLOR);
  const titleLines = doc.splitTextToSize(data.title, contentWidth);
  doc.text(titleLines, pageWidth / 2, y, { align: "center" });
  y += titleLines.length * 6 + 2;

  // Sub-header
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
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
  drawRow("Core Competencies", data.competencies.join(", ") || "—");
  y += 3;

  // Lesson Content
  drawSectionHeader("Lesson Content");
  drawRow("Lesson Objectives", data.objectives);
  drawRow("Key Inquiry Question", data.keyInquiryQuestion);
  drawRow("Learning Resources", data.resources);
  drawRow("Digital Resources", data.digitalResources);
  y += 3;

  // Teaching Activities
  drawSectionHeader("Teaching & Learning Activities");
  drawRow("Introduction", data.activities.introduction || "");
  drawRow("Development", data.activities.development || "");
  drawRow("Conclusion", data.activities.conclusion || "");
  y += 3;

  // Assessment & Reflection
  drawSectionHeader("Assessment & Reflection");
  drawRow("Assessment Strategy", data.assessmentStrategy);
  drawRow("Assessment Details", data.assessmentDescription);
  drawRow("Reflection", data.reflection);

  // Footer on each page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated by MwalimuKit  -  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }

  return Buffer.from(doc.output("arraybuffer"));
}
