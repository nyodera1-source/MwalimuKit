import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { allGrades } from "../prisma/seed/data/index";

function expectedCurriculumSize() {
  let learningAreas = 0;
  let strands = 0;
  let subStrands = 0;
  let outcomes = 0;

  for (const grade of allGrades) {
    learningAreas += grade.learningAreas.length;
    for (const area of grade.learningAreas) {
      strands += area.strands.length;
      for (const strand of area.strands) {
        subStrands += strand.subStrands.length;
        for (const subStrand of strand.subStrands) outcomes += subStrand.slos.length;
      }
    }
  }

  return { grades: allGrades.length, learningAreas, strands, subStrands, outcomes };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to verify curriculum data.");
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  const expected = expectedCurriculumSize();

  try {
    const [grades, learningAreas, strands, subStrands, outcomes] = await Promise.all([
      prisma.grade.count(),
      prisma.learningArea.count(),
      prisma.strand.count(),
      prisma.subStrand.count(),
      prisma.sLO.count(),
    ]);

    const complete =
      grades >= expected.grades &&
      learningAreas >= expected.learningAreas &&
      strands >= expected.strands &&
      subStrands >= expected.subStrands &&
      outcomes >= expected.outcomes;

    if (complete) {
      console.log("Curriculum data is already present; seed skipped.");
      return;
    }

    console.log(
      `Curriculum incomplete (${grades}/${expected.grades} grades, ` +
        `${subStrands}/${expected.subStrands} sub-strands). Running one-time seed...`
    );
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }

  // seed.ts owns and closes its own connection. Import only after the guard
  // confirms that production needs recovery.
  await import("../prisma/seed");
}

main().catch((error) => {
  console.error("Curriculum readiness check failed:", error);
  process.exit(1);
});
