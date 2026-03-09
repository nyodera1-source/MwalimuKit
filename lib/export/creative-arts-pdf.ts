import { jsPDF } from "jspdf";

export interface CreativeArtsExportData {
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
  performanceCriteria: string[];
  artMedium: string | null;
  inspirationNotes: string | null;
  relatedConcepts: string[];
}

const SECTION_COLOR = [220, 220, 225] as const;
const NOTICE_COLOR = [219, 234, 254] as const;
const CRITERIA_COLOR = [243, 232, 255] as const; // Light purple for performance criteria
const LINE_HEIGHT = 5;

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  visual_art: "Visual Art",
  music: "Music",
  drama: "Drama & Theatre",
  dance: "Dance",
};

function getActivityTypeLabel(type: string): string {
  return ACTIVITY_TYPE_LABELS[type] || type;
}

// ─── STUDENT WORKSHEET ───

export function generateCreativeArtsStudentPdf(
  data: CreativeArtsExportData
): Buffer {
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

  function drawSectionHeader(
    title: string,
    bgColor: readonly [number, number, number] = SECTION_COLOR,
    textColor: readonly [number, number, number] = [40, 40, 40]
  ) {
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

  // ─── School Name ───
  if (data.schoolName) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(data.schoolName.toUpperCase(), pageWidth / 2, y, {
      align: "center",
    });
    y += 7;
  }

  // ─── Title ───
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text("STUDENT ACTIVITY WORKSHEET", pageWidth / 2, y, {
    align: "center",
  });
  y += 8;

  doc.setFontSize(13);
  const titleLines = doc.splitTextToSize(data.activityName, contentWidth);
  doc.text(titleLines, pageWidth / 2, y, { align: "center" });
  y += titleLines.length * 6 + 6;

  // ─── Activity Type Badge ───
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text(
    `Type: ${getActivityTypeLabel(data.activityType)}${data.artMedium ? `  |  Medium: ${data.artMedium}` : ""}`,
    pageWidth / 2,
    y,
    { align: "center" }
  );
  doc.setTextColor(0, 0, 0);
  y += 7;

  // ─── Student Info ───
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${"_".repeat(40)}`, margin + 3, y);
  doc.text(
    `Date: ${data.activityDate.toLocaleDateString("en-KE")}`,
    pageWidth - margin - 50,
    y
  );
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

  // ─── Materials / Tools ───
  drawSectionHeader("MATERIALS / TOOLS");
  drawList(data.materials, false);

  // ─── Instructions ───
  drawSectionHeader("INSTRUCTIONS");
  drawList(data.instructions, true);

  // ─── Creative Work Space ───
  drawSectionHeader("YOUR CREATIVE WORK");
  drawBlankLines(8, "Describe, sketch, or reflect on your creative work below:");

  // ─── Self-Assessment ───
  if (data.performanceCriteria.length > 0) {
    drawSectionHeader("SELF-ASSESSMENT", CRITERIA_COLOR);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    doc.text(
      "Rate yourself on each criterion: Excellent / Good / Needs Improvement",
      margin + 3,
      y + 2
    );
    doc.setTextColor(0, 0, 0);
    y += 6;

    data.performanceCriteria.forEach((criterion, idx) => {
      const text = `${idx + 1}. ${criterion}`;
      const lines = doc.splitTextToSize(text, contentWidth - 50);
      checkPageBreak(lines.length * LINE_HEIGHT + 4);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(lines, margin + 3, y + 2);
      // Rating boxes
      doc.setDrawColor(180, 180, 180);
      const boxY = y;
      doc.rect(pageWidth - margin - 45, boxY, 12, 5);
      doc.rect(pageWidth - margin - 30, boxY, 12, 5);
      doc.rect(pageWidth - margin - 15, boxY, 12, 5);
      y += lines.length * LINE_HEIGHT + 3;
    });
    y += 4;
  }

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

export function generateCreativeArtsTeacherPdf(
  data: CreativeArtsExportData
): Buffer {
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

  function drawSectionHeader(
    title: string,
    bgColor: readonly [number, number, number] = SECTION_COLOR,
    textColor: readonly [number, number, number] = [40, 40, 40]
  ) {
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

  // ─── School Name ───
  if (data.schoolName) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(data.schoolName.toUpperCase(), pageWidth / 2, y, {
      align: "center",
    });
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
  const noticeText =
    "CONFIDENTIAL: This guide contains expected outcomes, performance criteria, and assessment guidance. Distribute only the Student Worksheet to learners.";
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
  doc.text(
    `Subject: Creative Arts  |  Grade: ${data.grade}  |  Type: ${getActivityTypeLabel(data.activityType)}${data.artMedium ? `  |  Medium: ${data.artMedium}` : ""}`,
    margin + 3,
    y
  );
  y += 5;
  doc.text(
    `Date: ${data.activityDate.toLocaleDateString("en-KE")}`,
    margin + 3,
    y
  );
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

  // ─── Materials / Tools ───
  drawSectionHeader("MATERIALS / TOOLS");
  drawList(data.materials, false);

  // ─── Instructions ───
  drawSectionHeader("INSTRUCTIONS");
  drawList(data.instructions, true);

  // ─── Expected Outcome ───
  drawSectionHeader("EXPECTED OUTCOME");
  drawTextSection(data.expectedOutcome);

  // ─── Performance Criteria ───
  if (data.performanceCriteria.length > 0) {
    drawSectionHeader("PERFORMANCE CRITERIA", CRITERIA_COLOR);
    drawList(data.performanceCriteria, true);
  }

  // ─── Inspiration Notes ───
  if (data.inspirationNotes) {
    drawSectionHeader("INSPIRATION & REFERENCE NOTES");
    drawTextSection(data.inspirationNotes);
  }

  // ─── Assessment Guidance ───
  drawSectionHeader("ASSESSMENT GUIDANCE");
  const assessmentText = generateAssessmentContent(data);
  drawTextSection(assessmentText);

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

// ─── Assessment Content Generator ───

function generateAssessmentContent(data: CreativeArtsExportData): string {
  const typeLabel = getActivityTypeLabel(data.activityType);
  const criteriaList = data.performanceCriteria
    .map((c, idx) => `${idx + 1}. ${c}`)
    .join("\n");
  const conceptsList = data.relatedConcepts.map((c) => `- ${c}`).join("\n");

  return `This activity (${data.activityName}) is a ${typeLabel} activity designed to develop creative skills and artistic expression aligned to the CBC curriculum.

Aim: ${data.aim}

Expected Outcome:
${data.expectedOutcome}

Performance Criteria for Assessment:

${criteriaList}

Guidance for Assessment:

1. Observe students during the activity process, not just the final product. Creative arts assessment values effort, growth, and creative thinking alongside technical skill.

2. Use the performance criteria above as a rubric. For each criterion, assess students on a scale: Excellent (demonstrates mastery and originality), Good (meets expectations with competence), Needs Improvement (shows effort but requires further practice).

3. Encourage peer feedback: have students share their work and provide constructive comments to classmates, building communication and critical thinking skills.

4. Connect the assessment to the following related concepts:
${conceptsList}

5. Document outstanding work and creative approaches for display or portfolio purposes. Celebrate diversity of expression and individual artistic voice.`;
}
