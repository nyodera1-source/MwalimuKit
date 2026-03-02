/**
 * Import extracted question bank JSON into PostgreSQL via Prisma.
 *
 * Usage:
 *   npx tsx scripts/extract-questions/import-to-db.ts extracted/paper1.json
 *   npx tsx scripts/extract-questions/import-to-db.ts extracted/   (all .json files)
 *
 * The JSON files should be output from extract.py and match the schema:
 * {
 *   "paper": { subject, gradeLevel, year, term, examType, ... },
 *   "questions": [{ questionNumber, section, text, marks, subQuestions, ... }],
 *   "diagrams": [{ filename, page, ... }]
 * }
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "../../lib/generated/prisma/client.js";
import fs from "fs";
import path from "path";

// ─── Prisma setup (same pattern as seed.ts) ───

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("ERROR: DATABASE_URL not set in .env");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// ─── Types ───

interface ExtractedQuestion {
  questionNumber: string;
  section: string | null;
  text: string;
  marks: number | null;
  hasImage: boolean;
  imageUrl: string | null;
  topic: string | null;
  subTopic: string | null;
  answer: string | null;
  subQuestions: { label: string; text: string; marks: number | null }[] | null;
}

interface ExtractedPaper {
  source_file: string;
  paper: {
    subject: string;
    gradeLevel: string;
    year: number;
    term: number | null;
    examType: string;
    school: string | null;
    source: string;
    paperNumber: number | null;
    totalMarks: number | null;
    timeMinutes: number | null;
  };
  questions: ExtractedQuestion[];
  diagrams: { filename: string; page: number }[];
}

// ─── Import logic ───

async function importPaper(data: ExtractedPaper): Promise<string> {
  const { paper, questions } = data;
  const subject = paper.subject;

  // Pool mode: find existing pool for this subject
  const existingPool = await prisma.questionPaper.findFirst({
    where: { subject: { equals: subject, mode: "insensitive" } },
    include: { _count: { select: { questions: true } } },
  });

  const validQuestions = questions.filter((q) => q.text && q.text.trim().length > 0);

  if (existingPool) {
    // Append questions to existing pool, starting numbering after current max
    const startNum = existingPool._count.questions + 1;

    await prisma.questionPaper.update({
      where: { id: existingPool.id },
      data: {
        questions: {
          create: validQuestions.map((q, i) => ({
            questionNumber: String(startNum + i),
            section: null, // No sections in pool mode
            text: q.text.trim(),
            marks: q.marks,
            hasImage: q.hasImage || false,
            imageUrl: q.imageUrl,
            topic: q.topic,
            subTopic: q.subTopic,
            answer: q.answer,
            subQuestions: q.subQuestions || undefined,
          })),
        },
      },
    });

    console.log(
      `  APPENDED ${validQuestions.length} questions to existing "${subject}" pool (Q${startNum}–${startNum + validQuestions.length - 1})`
    );
    return existingPool.id;
  }

  // No pool exists — create one
  const created = await prisma.questionPaper.create({
    data: {
      subject,
      gradeLevel: "Senior School",
      year: new Date().getFullYear(),
      term: null,
      examType: "Question Pool",
      school: null,
      source: paper.source || "ocr_extract",
      paperNumber: null,
      totalMarks: null,
      timeMinutes: null,
      questions: {
        create: validQuestions.map((q, i) => ({
          questionNumber: String(i + 1),
          section: null,
          text: q.text.trim(),
          marks: q.marks,
          hasImage: q.hasImage || false,
          imageUrl: q.imageUrl,
          topic: q.topic,
          subTopic: q.subTopic,
          answer: q.answer,
          subQuestions: q.subQuestions || undefined,
        })),
      },
    },
  });

  return created.id;
}

// ─── Main ───

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("Usage: npx tsx import-to-db.ts <file.json or folder/>");
    process.exit(1);
  }

  let jsonFiles: string[] = [];
  const stat = fs.statSync(inputPath);

  if (stat.isDirectory()) {
    jsonFiles = fs
      .readdirSync(inputPath)
      .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
      .map((f) => path.join(inputPath, f));
  } else {
    jsonFiles = [inputPath];
  }

  if (jsonFiles.length === 0) {
    console.error("No JSON files found");
    process.exit(1);
  }

  console.log(`Importing ${jsonFiles.length} file(s)...\n`);

  let imported = 0;
  let skipped = 0;
  let totalQuestions = 0;

  for (const file of jsonFiles) {
    const filename = path.basename(file);
    console.log(`Processing: ${filename}`);

    try {
      const raw = fs.readFileSync(file, "utf-8");
      const data = JSON.parse(raw);

      // Handle both single paper and batch array
      const papers: ExtractedPaper[] = Array.isArray(data) ? data : [data];

      for (const paper of papers) {
        const qCount = paper.questions?.length || 0;
        const id = await importPaper(paper);

        if (id) {
          console.log(
            `  OK: ${paper.paper.subject} ${paper.paper.gradeLevel} ` +
              `${paper.paper.year} — ${qCount} questions → ID: ${id}`
          );
          imported++;
          totalQuestions += qCount;
        } else {
          skipped++;
        }
      }
    } catch (err) {
      console.error(`  ERROR: ${err}`);
      skipped++;
    }
  }

  console.log(
    `\nDone! Imported: ${imported} papers (${totalQuestions} questions), Skipped: ${skipped}`
  );

  await prisma.$disconnect();
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
