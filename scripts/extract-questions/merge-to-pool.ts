/**
 * Merge all QuestionPapers for a given subject into ONE pool.
 *
 * - Picks the first paper as the "pool" record
 * - Moves all questions from other papers into the pool
 * - Re-numbers questions sequentially (1, 2, 3, …)
 * - Clears section field on all questions
 * - Deletes the now-empty papers
 * - Updates the pool record: subject label only, no grade/paper specifics
 *
 * Usage:
 *   npx tsx scripts/extract-questions/merge-to-pool.ts Biology
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "../../lib/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("ERROR: DATABASE_URL not set in .env");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const subjectArg = process.argv[2];
  if (!subjectArg) {
    console.error("Usage: npx tsx merge-to-pool.ts <Subject>");
    console.error("Example: npx tsx merge-to-pool.ts Biology");
    process.exit(1);
  }

  // Find all papers matching this subject (case-insensitive)
  const papers = await prisma.questionPaper.findMany({
    where: { subject: { contains: subjectArg, mode: "insensitive" } },
    include: {
      questions: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "asc" },
  });

  if (papers.length === 0) {
    console.log(`No papers found for subject "${subjectArg}"`);
    process.exit(0);
  }

  console.log(`Found ${papers.length} papers for "${subjectArg}":`);
  for (const p of papers) {
    console.log(
      `  - ${p.id}: ${p.subject} ${p.gradeLevel} ${p.year} ${p.examType}` +
        `${p.paperNumber ? ` P${p.paperNumber}` : ""} — ${p.questions.length} questions`
    );
  }

  // Use the first paper as the pool
  const poolPaper = papers[0];
  const otherPapers = papers.slice(1);

  // Collect ALL questions across all papers
  const allQuestions = papers.flatMap((p) => p.questions);
  console.log(`\nTotal questions to pool: ${allQuestions.length}`);

  // Move questions from other papers to the pool paper
  if (otherPapers.length > 0) {
    const otherIds = otherPapers.map((p) => p.id);

    // Move questions to pool paper
    const moved = await prisma.question.updateMany({
      where: { paperId: { in: otherIds } },
      data: { paperId: poolPaper.id },
    });
    console.log(`Moved ${moved.count} questions to pool paper ${poolPaper.id}`);

    // Delete now-empty papers
    const deleted = await prisma.questionPaper.deleteMany({
      where: { id: { in: otherIds } },
    });
    console.log(`Deleted ${deleted.count} empty papers`);
  }

  // Re-number all questions sequentially and clear sections
  const poolQuestions = await prisma.question.findMany({
    where: { paperId: poolPaper.id },
    orderBy: { createdAt: "asc" },
  });

  for (let i = 0; i < poolQuestions.length; i++) {
    await prisma.question.update({
      where: { id: poolQuestions[i].id },
      data: {
        questionNumber: String(i + 1),
        section: null,
      },
    });
  }
  console.log(`Re-numbered ${poolQuestions.length} questions (1–${poolQuestions.length})`);

  // Update pool paper metadata — just the subject label, clear paper-specific fields
  await prisma.questionPaper.update({
    where: { id: poolPaper.id },
    data: {
      subject: subjectArg, // Clean label e.g. "Biology"
      gradeLevel: "Senior School", // Generic for CBE Grades 10-12
      year: new Date().getFullYear(),
      term: null,
      examType: "Question Pool",
      school: null,
      paperNumber: null,
      totalMarks: null,
      timeMinutes: null,
    },
  });

  console.log(`\nDone! Pool paper: ${poolPaper.id}`);
  console.log(`  Subject: ${subjectArg}`);
  console.log(`  Questions: ${poolQuestions.length}`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
