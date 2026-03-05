import { jsPDF } from "jspdf";

export interface SocialStudiesExportData {
  activityName: string;
  activityType: string;
  grade: string;
  learningArea: string;
  activityDate: Date;
  classGroup: string | null;
  schoolName?: string | null;
  aim: string;
  materials: string[];
  instructions: string[];
  backgroundInfo: string;
  expectedOutcome: string;
  discussionPoints: string[];
  relatedConcepts: string[];
}

const SECTION_COLOR = [220, 220, 225] as const; // Light grey for section headers
const SAFETY_COLOR = [254, 226, 226] as const; // Light red for safety
const NOTICE_COLOR = [219, 234, 254] as const; // Light blue for teacher notice
const LINE_HEIGHT = 5;

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  map_work: "Map Work",
  research: "Research Project",
  debate: "Structured Debate",
  field_study: "Field Study",
  case_study: "Case Study",
};

function getActivityTypeLabel(type: string): string {
  return ACTIVITY_TYPE_LABELS[type] || type;
}

// ─── STUDENT WORKSHEET ───

export function generateStudentWorksheetPdf(data: SocialStudiesExportData): Buffer {
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

  function drawSectionHeader(title: string, bgColor: readonly [number, number, number] = SECTION_COLOR, textColor: readonly [number, number, number] = [40, 40, 40]) {
    checkPageBreak(10);
    doc.setFillColor(...bgColor);
    doc.rect(margin, y, contentWidth, 7, "F");
    doc.setTextColor(...textColor);
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
      const prefix = numbered ? `${idx + 1}. ` : "- ";
      const cleanItem = item.replace(/^\d+\.\s*/, "");
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
    doc.setTextColor(40, 40, 40);
    doc.text(data.schoolName.toUpperCase(), pageWidth / 2, y, { align: "center" });
    y += 7;
  }

  // ─── Title ───
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text("STUDENT ACTIVITY WORKSHEET", pageWidth / 2, y, { align: "center" });
  y += 8;

  doc.setFontSize(13);
  const titleLines = doc.splitTextToSize(data.activityName, contentWidth);
  doc.text(titleLines, pageWidth / 2, y, { align: "center" });
  y += titleLines.length * 6 + 6;

  // ─── Activity Type Badge ───
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text(`Type: ${getActivityTypeLabel(data.activityType)}`, pageWidth / 2, y, { align: "center" });
  doc.setTextColor(0, 0, 0);
  y += 7;

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

  // ─── Background ───
  drawSectionHeader("BACKGROUND");
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const bgLines = doc.splitTextToSize(data.backgroundInfo, contentWidth - 6);
  checkPageBreak(bgLines.length * LINE_HEIGHT + 4);
  doc.text(bgLines, margin + 3, y + 2);
  y += bgLines.length * LINE_HEIGHT + 6;

  // ─── Aim ───
  drawSectionHeader("AIM");
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const aimLines = doc.splitTextToSize(data.aim, contentWidth - 6);
  checkPageBreak(aimLines.length * LINE_HEIGHT + 4);
  doc.text(aimLines, margin + 3, y + 2);
  y += aimLines.length * LINE_HEIGHT + 6;

  // ─── Materials / Resources ───
  drawSectionHeader("MATERIALS / RESOURCES");
  drawList(data.materials, false);

  // ─── Instructions ───
  drawSectionHeader("INSTRUCTIONS");
  drawList(data.instructions, true);

  // ─── Your Findings ───
  drawSectionHeader("YOUR FINDINGS");
  drawBlankLines(10, "Record your findings, observations, or arguments below:");

  // ─── Discussion Questions ───
  drawSectionHeader("DISCUSSION QUESTIONS");
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  data.discussionPoints.forEach((point, idx) => {
    const prefix = `${idx + 1}. `;
    const cleanPoint = point.replace(/^\d+\.\s*/, "");
    const text = prefix + cleanPoint;
    const lines = doc.splitTextToSize(text, contentWidth - 8);

    checkPageBreak(lines.length * LINE_HEIGHT + 3 * 6 + 8);
    doc.text(lines, margin + 3, y + 2);
    y += lines.length * LINE_HEIGHT + 2;

    // 3 blank lines after each question
    for (let i = 0; i < 3; i++) {
      checkPageBreak(6);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin + 3, y, pageWidth - margin - 3, y);
      y += 6;
    }
    y += 2;
  });
  y += 2;

  // ─── Related Concepts ───
  if (data.relatedConcepts.length > 0) {
    drawSectionHeader("RELATED CONCEPTS");
    doc.setFontSize(9);
    const concepts = data.relatedConcepts.join("  |  ");
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
      `Generated by MwalimuKit  --  Student Worksheet  --  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }

  return Buffer.from(doc.output("arraybuffer"));
}

// ─── TEACHER'S GUIDE ───

export function generateTeacherGuidePdf(data: SocialStudiesExportData): Buffer {
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

  function drawSectionHeader(title: string, bgColor: readonly [number, number, number] = SECTION_COLOR, textColor: readonly [number, number, number] = [40, 40, 40]) {
    checkPageBreak(10);
    doc.setFillColor(...bgColor);
    doc.rect(margin, y, contentWidth, 7, "F");
    doc.setTextColor(...textColor);
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
      const prefix = numbered ? `${idx + 1}. ` : "- ";
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
    doc.setTextColor(40, 40, 40);
    doc.text(data.schoolName.toUpperCase(), pageWidth / 2, y, { align: "center" });
    y += 7;
  }

  // ─── Title ───
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text("TEACHER'S GUIDE", pageWidth / 2, y, { align: "center" });
  y += 6;

  doc.setFontSize(13);
  const titleLines = doc.splitTextToSize(data.activityName, contentWidth);
  doc.text(titleLines, pageWidth / 2, y, { align: "center" });
  y += titleLines.length * 6 + 4;

  // ─── Teacher notice ───
  doc.setFillColor(...NOTICE_COLOR);
  const noticeText = "CONFIDENTIAL: This guide contains expected outcomes and discussion guidance. Distribute only the Student Worksheet to learners.";
  const noticeLines = doc.splitTextToSize(noticeText, contentWidth - 6);
  const noticeHeight = Math.max(8, noticeLines.length * 4 + 4);
  doc.rect(margin, y, contentWidth, noticeHeight, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(30, 64, 175);
  doc.text(noticeText, margin + 3, y + 5);
  doc.setTextColor(0, 0, 0);
  y += noticeHeight + 4;

  // ─── Info ───
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Subject: Social Studies  |  Grade: ${data.grade}  |  Activity Type: ${getActivityTypeLabel(data.activityType)}`, margin + 3, y);
  y += 5;
  doc.text(`Date: ${data.activityDate.toLocaleDateString("en-KE")}`, margin + 3, y);
  if (data.classGroup) {
    doc.text(`Class/Group: ${data.classGroup}`, margin + 80, y);
  }
  y += 8;

  // ─── Aim ───
  drawSectionHeader("AIM");
  drawTextSection(data.aim);

  // ─── Background Information ───
  drawSectionHeader("BACKGROUND INFORMATION");
  drawTextSection(data.backgroundInfo);

  // ─── Materials / Resources ───
  drawSectionHeader("MATERIALS / RESOURCES");
  drawList(data.materials, false);

  // ─── Instructions ───
  drawSectionHeader("INSTRUCTIONS");
  drawList(data.instructions, true);

  // ─── Expected Outcome ───
  drawSectionHeader("EXPECTED OUTCOME");
  drawTextSection(data.expectedOutcome);

  // ─── Discussion Guide ───
  drawSectionHeader("DISCUSSION GUIDE");
  const discussion = generateDiscussionContent(data);
  drawTextSection(discussion);

  // ─── Related Concepts ───
  if (data.relatedConcepts.length > 0) {
    drawSectionHeader("RELATED CONCEPTS");
    doc.setFontSize(9);
    const concepts = data.relatedConcepts.join("  |  ");
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
      `Generated by MwalimuKit  --  Teacher's Guide  --  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }

  return Buffer.from(doc.output("arraybuffer"));
}

// ─── Discussion Content Generator ───

function generateDiscussionContent(data: SocialStudiesExportData): string {
  const { activityName, activityType, aim, expectedOutcome, discussionPoints, relatedConcepts } = data;

  const typeLabel = getActivityTypeLabel(activityType);
  const conceptsList = relatedConcepts.map(c => `- ${c}`).join("\n");

  const pointsList = discussionPoints
    .map((point, idx) => `${idx + 1}. ${point.replace(/^\d+\.\s*/, "")}`)
    .join("\n");

  return `This activity (${activityName}) is a ${typeLabel} designed to help learners explore key concepts in Social Studies through active engagement and inquiry.

Aim: ${aim}

Expected Outcome:
${expectedOutcome}

Discussion Points for the Classroom:

${pointsList}

Guidance for facilitating discussion:

1. Begin by reviewing the background information with learners. Ensure they understand the context before diving into discussion. Ask probing questions to gauge prior knowledge.

2. For each discussion point above, encourage learners to support their arguments with evidence from their findings, the background material, or their own experiences. Guide them to consider multiple perspectives.

3. Connect the discussion to the following related concepts:
${conceptsList}

4. Assessment: Check that learners can (a) articulate the aim of the activity in their own words, (b) present findings or arguments supported by evidence, (c) demonstrate understanding of at least two of the related concepts listed above, and (d) respectfully engage with differing viewpoints.`;
}
