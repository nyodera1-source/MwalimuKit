import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { allGrades, type GradeData } from "../prisma/seed/data/index";
import {
  TRANSCRIBED_GRADE_LEVELS,
  isTranscribedCurriculumArea,
} from "../lib/curriculum/transcribed-curriculum";

interface StoredGrade {
  level: number;
  learningAreas: {
    name: string;
    strands: {
      name: string;
      order: number;
      subStrands: {
        name: string;
        order: number;
        suggestedTerm: number | null;
        suggestedLessons: number | null;
        sourceRef: string | null;
        skillStrand: string | null;
        verification: string;
        slos: {
          description: string;
          order: number;
          verification: string;
        }[];
      }[];
    }[];
  }[];
}

function matchesPublishedGrade(expected: GradeData, stored?: StoredGrade): boolean {
  if (!stored) return false;

  const expectedAreas = expected.learningAreas.filter((area) =>
    isTranscribedCurriculumArea(expected.level, area.name)
  );

  return expectedAreas.every((expectedArea) => {
    const area = stored.learningAreas.find((row) => row.name === expectedArea.name);
    if (!area) return false;

    const activeStrands = area.strands.filter((strand) =>
      strand.subStrands.some((subStrand) => subStrand.verification !== "superseded")
    );
    if (activeStrands.length !== expectedArea.strands.length) return false;

    return expectedArea.strands.every((expectedStrand) => {
      const strand = activeStrands.find((row) => row.name === expectedStrand.name);
      if (!strand || strand.order !== expectedStrand.order) return false;

      const activeSubStrands = strand.subStrands.filter(
        (row) => row.verification !== "superseded"
      );
      if (activeSubStrands.length !== expectedStrand.subStrands.length) return false;

      return expectedStrand.subStrands.every((expectedSubStrand) => {
        const subStrand = activeSubStrands.find(
          (row) => row.name === expectedSubStrand.name
        );
        if (
          !subStrand ||
          subStrand.order !== expectedSubStrand.order ||
          subStrand.suggestedTerm !== (expectedSubStrand.suggestedTerm ?? null) ||
          subStrand.suggestedLessons !== (expectedSubStrand.suggestedLessons ?? null) ||
          subStrand.sourceRef !== (expectedSubStrand.sourceRef ?? null) ||
          subStrand.skillStrand !== (expectedSubStrand.skillStrand ?? null)
        ) return false;

        const activeOutcomes = subStrand.slos.filter(
          (outcome) => outcome.verification !== "superseded"
        );
        return activeOutcomes.length === expectedSubStrand.slos.length &&
          expectedSubStrand.slos.every((expectedOutcome, index) =>
            activeOutcomes.some((outcome) =>
              outcome.order === index + 1 &&
              outcome.description === expectedOutcome.description
            )
          );
      });
    });
  });
}

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
    const [grades, learningAreas, strands, subStrands, outcomes, publishedGrades] = await Promise.all([
      prisma.grade.count(),
      prisma.learningArea.count(),
      prisma.strand.count(),
      prisma.subStrand.count(),
      prisma.sLO.count(),
      prisma.grade.findMany({
        where: { level: { in: [...TRANSCRIBED_GRADE_LEVELS] } },
        select: {
          level: true,
          learningAreas: {
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
                      suggestedTerm: true,
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

    const incompletePublishedLevels = allGrades
      .filter((grade) => TRANSCRIBED_GRADE_LEVELS.includes(
        grade.level as (typeof TRANSCRIBED_GRADE_LEVELS)[number]
      ))
      .filter((grade) => !matchesPublishedGrade(
          grade,
          publishedGrades.find((stored) => stored.level === grade.level)
        ))
      .map((grade) => grade.level);
    const publishedComplete = incompletePublishedLevels.length === 0;

    if (complete && publishedComplete) {
      console.log("Curriculum data matches the source-backed Grades 7-10 subjects.");
      return;
    }

    throw new Error(
      `Curriculum is not current (${grades}/${expected.grades} grades, ` +
        `${subStrands}/${expected.subStrands} sub-strands; ` +
        `mismatched published grades: ${incompletePublishedLevels.join(", ") || "none"}). ` +
        "Apply pending migrations and run the published curriculum sync before building."
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
