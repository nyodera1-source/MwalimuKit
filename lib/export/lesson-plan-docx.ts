import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  ShadingType,
} from "docx";
import type { LessonPlanExportData } from "./lesson-plan-types";

function headerCell(text: string): TableCell {
  return new TableCell({
    width: { size: 30, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.SOLID, color: "F5F5F5" },
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, size: 20 })],
      }),
    ],
  });
}

function valueCell(text: string, width = 70): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        children: [new TextRun({ text: text || "—", size: 20 })],
      }),
    ],
  });
}

function sectionRow(text: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        columnSpan: 2,
        shading: { type: ShadingType.SOLID, color: "2563EB" },
        children: [
          new Paragraph({
            children: [
              new TextRun({ text, bold: true, color: "FFFFFF", size: 22 }),
            ],
          }),
        ],
      }),
    ],
  });
}

function dataRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [headerCell(label), valueCell(value)],
  });
}

const borders = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
} as const;

export async function generateLessonPlanDocx(
  data: LessonPlanExportData
): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        children: [
          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: data.title, bold: true })],
          }),
          // Subtitle
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `Teacher: ${data.teacherName} | Date: ${data.date} | Duration: ${data.duration} min`,
                size: 20,
                color: "666666",
              }),
            ],
          }),

          // Curriculum Details
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders,
            rows: [
              sectionRow("Curriculum Details"),
              dataRow("Grade", data.grade),
              dataRow("Learning Area", data.learningArea),
              dataRow("Strand", data.strand),
              dataRow("Sub-Strand", data.subStrand),
              dataRow("Specific Learning Outcomes", data.slos.join("\n• ") ? "• " + data.slos.join("\n• ") : "—"),
              dataRow("Core Competencies", data.competencies.join(", ") || "—"),
            ],
          }),

          new Paragraph({ spacing: { before: 200 } }),

          // Lesson Content
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders,
            rows: [
              sectionRow("Lesson Content"),
              dataRow("Lesson Objectives", data.objectives),
              dataRow("Key Inquiry Question", data.keyInquiryQuestion),
              dataRow("Learning Resources", data.resources),
              dataRow("Digital Resources", data.digitalResources),
            ],
          }),

          new Paragraph({ spacing: { before: 200 } }),

          // Activities
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders,
            rows: [
              sectionRow("Teaching & Learning Activities"),
              dataRow("Introduction", data.activities.introduction || ""),
              dataRow("Development", data.activities.development || ""),
              dataRow("Conclusion", data.activities.conclusion || ""),
            ],
          }),

          new Paragraph({ spacing: { before: 200 } }),

          // Assessment
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders,
            rows: [
              sectionRow("Assessment & Reflection"),
              dataRow("Assessment Strategy", data.assessmentStrategy),
              dataRow("Assessment Details", data.assessmentDescription),
              dataRow("Reflection", data.reflection),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}
