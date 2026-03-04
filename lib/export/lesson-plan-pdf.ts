import { jsPDF } from "jspdf";
import type { LessonPlanExportData } from "./lesson-plan-types";

export function generateLessonPlanPdf(data: LessonPlanExportData): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;
  const MAX_PAGES = 3;
  let truncated = false;

  const HEADER_COLOR = [55, 65, 81] as const; // Professional dark gray (gray-700)
  const GRAY_BG = [249, 250, 251] as const; // Light gray (gray-50)
  const LINE_HEIGHT = 5;

  function checkPageBreak(needed: number): boolean {
    const pageHeight = doc.internal.pageSize.getHeight();
    const currentPage = doc.getNumberOfPages();

    // If we're on the last allowed page and adding content would exceed it, truncate
    if (currentPage >= MAX_PAGES && y + needed > pageHeight - margin - 15) {
      truncated = true;
      return false; // Signal to stop adding content
    }

    // If adding content would exceed current page but we can add another page
    if (y + needed > pageHeight - margin) {
      if (currentPage < MAX_PAGES) {
        doc.addPage();
        y = margin;
        return true;
      } else {
        truncated = true;
        return false;
      }
    }
    return true;
  }

  function drawSectionHeader(title: string): boolean {
    if (!checkPageBreak(10)) return false;
    doc.setFillColor(...HEADER_COLOR);
    doc.rect(margin, y, contentWidth, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 3, y + 5);
    doc.setTextColor(0, 0, 0);
    y += 9;
    return true;
  }

  function drawRow(label: string, value: string): boolean {
    const labelWidth = 45;
    const valueWidth = contentWidth - labelWidth;
    const valueLines = doc.splitTextToSize(value || "—", valueWidth - 6);
    const rowHeight = Math.max(7, valueLines.length * LINE_HEIGHT + 3);

    if (!checkPageBreak(rowHeight + 2)) return false;

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
    return true;
  }

  function drawListRow(label: string, items: string[]): boolean {
    if (items.length === 0) {
      return drawRow(label, "—");
    }

    const labelWidth = 45;
    const valueWidth = contentWidth - labelWidth;
    const bulletLines: string[] = [];
    for (const item of items) {
      const wrapped = doc.splitTextToSize(`- ${item}`, valueWidth - 8);
      bulletLines.push(...wrapped);
    }
    const rowHeight = Math.max(7, bulletLines.length * LINE_HEIGHT + 3);

    if (!checkPageBreak(rowHeight + 2)) return false;

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
    return true;
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

  // Draw content sections (with early termination if page limit reached)
  do {
    // Curriculum Details (essential - highest priority)
    if (!drawSectionHeader("Curriculum Details")) break;
    if (!drawRow("Grade", data.grade)) break;
    if (!drawRow("Learning Area", data.learningArea)) break;
    if (!drawRow("Strand", data.strand)) break;
    if (!drawRow("Sub-Strand", data.subStrand)) break;
    if (!drawListRow("Specific Learning Outcomes", data.slos)) break;
    if (!drawRow("Core Competencies", data.competencies.join(", ") || "—")) break;
    y += 3;

    // Lesson Content (essential)
    if (!drawSectionHeader("Lesson Content")) break;
    if (!drawRow("Lesson Objectives", data.objectives)) break;
    if (!drawRow("Key Inquiry Question", data.keyInquiryQuestion)) break;
    if (!drawRow("Learning Resources", data.resources)) break;
    if (!drawRow("Digital Resources", data.digitalResources)) break;
    y += 3;

    // Teaching Activities (essential)
    if (!drawSectionHeader("Teaching & Learning Activities")) break;
    if (!drawRow("Introduction", data.activities.introduction || "")) break;
    if (!drawRow("Development", data.activities.development || "")) break;
    if (!drawRow("Conclusion", data.activities.conclusion || "")) break;
    y += 3;

    // Assessment & Reflection (can be truncated if necessary)
    if (!drawSectionHeader("Assessment & Reflection")) break;
    if (!drawRow("Assessment Strategy", data.assessmentStrategy)) break;
    if (!drawRow("Assessment Details", data.assessmentDescription)) break;
    drawRow("Reflection", data.reflection);
  } while (false);

  // Add truncation notice if content was cut off
  if (truncated) {
    if (checkPageBreak(12)) {
      doc.setFillColor(255, 243, 224); // Light orange background
      doc.rect(margin, y, contentWidth, 10, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(180, 83, 9); // Orange text
      doc.text(
        "⚠ Content truncated to fit 3-page limit. Edit lesson plan to reduce content length.",
        margin + 3,
        y + 6
      );
      doc.setTextColor(0, 0, 0);
    }
  }

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
