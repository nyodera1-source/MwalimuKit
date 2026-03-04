import { jsPDF } from "jspdf";
import type { SchemeOfWorkExportData } from "./scheme-of-work-types";

export function generateSchemeOfWorkPdf(data: SchemeOfWorkExportData): Buffer {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;

  // ════════════════════════════════════════
  // PAGE 1: COVER PAGE
  // ════════════════════════════════════════

  // School name top-left
  if (data.schoolName) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(data.schoolName, margin, 20);
  }

  // Centered title block
  const centerY = pageHeight / 2 - 20;
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("SCHEME OF WORK", pageWidth / 2, centerY, { align: "center" });

  doc.setFontSize(18);
  doc.text(data.learningArea.toUpperCase(), pageWidth / 2, centerY + 12, { align: "center" });

  doc.setFontSize(16);
  doc.text(`${data.grade.toUpperCase()} ${data.year}`, pageWidth / 2, centerY + 24, { align: "center" });

  doc.setFontSize(16);
  doc.text(`TERM ${toRoman(data.term)}`, pageWidth / 2, centerY + 36, { align: "center" });

  if (data.schoolName) {
    doc.setFontSize(14);
    doc.text(data.schoolName.toUpperCase(), pageWidth / 2, centerY + 48, { align: "center" });
  }

  // (Page number added by footer loop below)

  // ════════════════════════════════════════
  // PAGE 2+: TABLE PAGES
  // ════════════════════════════════════════

  doc.addPage();
  let y = margin;

  // Column widths for 8 columns (A4 landscape = 297mm, content ≈ 277mm)
  const colRatios = [10, 10, 28, 30, 52, 50, 34, 35];
  const totalRatio = colRatios.reduce((a, b) => a + b, 0);
  const cols = colRatios.map((r) => (r / totalRatio) * contentWidth);

  const headers = [
    "WK", "LSN", "STRAND", "SUB-STRAND", "OBJECTIVES",
    "T/L ACTIVITIES", "T/L AIDS", "REFERENCE",
  ];

  const HEADER_COLOR = [55, 65, 81] as const; // Professional dark gray
  const LIGHT_BG = [249, 250, 251] as const; // Light gray background
  const LINE_HEIGHT = 3.5;

  function drawPageHeader() {
    // School name top-left on every page
    if (data.schoolName) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(data.schoolName, margin, y);
      y += 4;
    }
  }

  function drawTableHeader() {
    const headerHeight = 8;
    let x = margin;
    for (let i = 0; i < headers.length; i++) {
      doc.setFillColor(...HEADER_COLOR);
      doc.rect(x, y, cols[i], headerHeight, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(headers[i], x + 1.5, y + 5);
      x += cols[i];
    }
    doc.setTextColor(0, 0, 0);
    y += headerHeight;
  }

  function checkPageBreak(needed: number) {
    if (y + needed > pageHeight - margin - 12) {
      doc.addPage();
      y = margin;
      drawPageHeader();
      drawTableHeader();
    }
  }

  drawPageHeader();
  drawTableHeader();

  // Build combined break rows (multi-week breaks → single row e.g. "11-12")
  type BreakRow = { startWeek: number; endWeek: number; title: string };
  const breakRows: BreakRow[] = data.breaks.map((b) => ({
    startWeek: b.weekNumber,
    endWeek: b.weekNumber + b.duration - 1,
    title: b.title || "Break",
  }));

  // Set of all individual break weeks (for skipping in teaching loop)
  const breakWeekSet = new Set<number>();
  for (const b of data.breaks) {
    for (let w = b.weekNumber; w < b.weekNumber + b.duration; w++) {
      breakWeekSet.add(w);
    }
  }

  // Build ordered display items: lessons + breaks sorted by week
  type DisplayItem =
    | { kind: "lesson"; entry: (typeof data.entries)[0] }
    | { kind: "break"; row: BreakRow };
  const displayItems: DisplayItem[] = [];

  for (const entry of data.entries) {
    displayItems.push({ kind: "lesson", entry });
  }
  for (const row of breakRows) {
    displayItems.push({ kind: "break", row });
  }
  displayItems.sort((a, b) => {
    const wA = a.kind === "lesson" ? a.entry.week : a.row.startWeek;
    const wB = b.kind === "lesson" ? b.entry.week : b.row.startWeek;
    if (wA !== wB) return wA - wB;
    return a.kind === "break" ? -1 : 1;
  });

  for (let idx = 0; idx < displayItems.length; idx++) {
    const item = displayItems[idx];

    if (item.kind === "break") {
      const { startWeek, endWeek, title } = item.row;
      const weekLabel = startWeek === endWeek ? String(startWeek) : `${startWeek}-${endWeek}`;

      const rowHeight = 7;
      checkPageBreak(rowHeight + 1);

      doc.setFillColor(...LIGHT_BG);
      doc.rect(margin, y, cols[0], rowHeight, "FD");
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(weekLabel, margin + 2, y + 4.5);

      const mergedWidth = contentWidth - cols[0];
      doc.setFillColor(...LIGHT_BG);
      doc.rect(margin + cols[0], y, mergedWidth, rowHeight, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(title, margin + cols[0] + mergedWidth / 2, y + 4.5, { align: "center" });
      y += rowHeight;
      continue;
    }

    // Teaching entry
    const entry = item.entry;
    const values = [
      String(entry.week),
      entry.lesson,
      entry.topic || "—",
      entry.subTopic || "—",
      entry.objectives || "—",
      entry.tlActivities || "—",
      entry.tlAids || "—",
      entry.reference || "—",
    ];

    // Calculate row height
    let maxLines = 1;
    const cellTexts: string[][] = [];
    for (let i = 0; i < values.length; i++) {
      doc.setFontSize(8);
      const lines = doc.splitTextToSize(values[i], cols[i] - 3);
      cellTexts.push(lines);
      maxLines = Math.max(maxLines, lines.length);
    }

    const rowHeight = Math.max(6, maxLines * LINE_HEIGHT + 2);
    checkPageBreak(rowHeight + 1);

    let x = margin;
    for (let i = 0; i < cols.length; i++) {
      doc.rect(x, y, cols[i], rowHeight, "D");
      doc.setFontSize(8);
      doc.setFont("helvetica", i < 2 ? "bold" : "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(cellTexts[i], x + 1.5, y + 3);
      x += cols[i];
    }
    y += rowHeight;
  }

  // ── Footer: Page numbers + school name ──
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i}`, pageWidth / 2, pageHeight - 8, { align: "center" });
    // School name bottom-left on table pages
    if (i > 1 && data.schoolName) {
      doc.text(data.schoolName, margin, pageHeight - 8);
    }
  }

  return Buffer.from(doc.output("arraybuffer"));
}

function toRoman(num: number): string {
  const map: [number, string][] = [[3, "III"], [2, "II"], [1, "I"]];
  for (const [n, r] of map) {
    if (num === n) return r;
  }
  return String(num);
}
