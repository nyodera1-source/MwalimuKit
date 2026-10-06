import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import {
  matchesTranscribedGrade7,
  TRANSCRIBED_GRADE_7_AREAS,
} from "../lib/curriculum/transcribed-grade-7";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to check curriculum data.");
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  try {
    const grade = await prisma.grade.findUnique({
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
                    slos: { select: { description: true, order: true, verification: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    const current = matchesTranscribedGrade7(grade?.learningAreas ?? []);
    console.log(
      current
        ? `Grade 7 curriculum matches all ${TRANSCRIBED_GRADE_7_AREAS.length} transcribed subjects.`
        : "Grade 7 curriculum differs from the transcribed subjects. No changes were made."
    );
    if (!current) process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Curriculum check failed:", error);
  process.exitCode = 1;
});
