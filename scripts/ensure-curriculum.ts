import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { allGrades } from "../prisma/seed/data/index";
import {
  matchesTranscribedGrade7,
  TRANSCRIBED_GRADE_7_AREAS,
} from "../lib/curriculum/transcribed-grade-7";

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
    const [grades, learningAreas, strands, subStrands, outcomes, grade7] = await Promise.all([
      prisma.grade.count(),
      prisma.learningArea.count(),
      prisma.strand.count(),
      prisma.subStrand.count(),
      prisma.sLO.count(),
      prisma.grade.findUnique({
        where: { level: 7 },
        select: {
          learningAreas: {
            where: { name: { in: TRANSCRIBED_GRADE_7_AREAS } },
            select: {
              name: true,
              strands: {
                select: {
                  name: true,
                  order: true,
                  subStrands: {
                    select: {
                      name: true,
                      order: true,
                      verification: true,
                      suggestedLessons: true,
                      sourceRef: true,
                      skillStrand: true,
                      slos: {
                        select: { description: true, order: true, verification: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    const complete =
      grades >= expected.grades &&
      learningAreas >= expected.learningAreas &&
      strands >= expected.strands &&
      subStrands >= expected.subStrands &&
      outcomes >= expected.outcomes;

    if (complete && matchesTranscribedGrade7(grade7?.learningAreas ?? [])) {
      console.log("Curriculum data matches the transcribed Grade 7 subjects.");
      return;
    }

    throw new Error(
      `Curriculum is not current (${grades}/${expected.grades} grades, ` +
        `${subStrands}/${expected.subStrands} sub-strands). ` +
        "Apply pending migrations and explicitly sync the transcribed Grade 7 subjects before building."
    );
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }

}

main().catch((error) => {
  console.error("Curriculum readiness check failed:", error);
  process.exit(1);
});
