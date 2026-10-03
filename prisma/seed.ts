import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import {
  CORE_COMPETENCIES,
  allGrades,
  type GradeData,
} from "./seed/data/index";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedCompetencies() {
  console.log("Seeding core competencies...");
  for (const comp of CORE_COMPETENCIES) {
    await prisma.coreCompetency.upsert({
      where: { name: comp.name },
      update: { description: comp.description },
      create: comp,
    });
  }
  console.log(`  ✓ ${CORE_COMPETENCIES.length} core competencies seeded`);
}

async function seedGrade(gradeData: GradeData) {
  console.log(`Seeding ${gradeData.name}...`);

  const grade = await prisma.grade.upsert({
    where: { level: gradeData.level },
    update: { name: gradeData.name },
    create: { level: gradeData.level, name: gradeData.name },
  });

  let laCount = 0, strandCount = 0, ssCount = 0, sloCount = 0;

  for (const [laIndex, laData] of gradeData.learningAreas.entries()) {
    const la = await prisma.learningArea.upsert({
      where: { gradeId_name: { gradeId: grade.id, name: laData.name } },
      update: { order: laIndex + 1 },
      create: { gradeId: grade.id, name: laData.name, order: laIndex + 1 },
    });
    laCount++;

    for (const strandData of laData.strands) {
      const strand = await prisma.strand.upsert({
        where: { learningAreaId_name: { learningAreaId: la.id, name: strandData.name } },
        update: { order: strandData.order },
        create: { learningAreaId: la.id, name: strandData.name, order: strandData.order },
      });
      strandCount++;

      for (const ssData of strandData.subStrands) {
        const subStrand = await prisma.subStrand.upsert({
          where: { strandId_name: { strandId: strand.id, name: ssData.name } },
          update: {
            order: ssData.order,
            suggestedTerm: ssData.suggestedTerm ?? null,
            suggestedLessons: ssData.suggestedLessons ?? null,
            sourceRef: ssData.sourceRef ?? null,
          },
          create: {
            strandId: strand.id,
            name: ssData.name,
            order: ssData.order,
            suggestedTerm: ssData.suggestedTerm ?? null,
            suggestedLessons: ssData.suggestedLessons ?? null,
            sourceRef: ssData.sourceRef ?? null,
          },
        });
        ssCount++;

        // Delete existing SLOs for this sub-strand to avoid duplicates on re-seed
        await prisma.sLO.deleteMany({ where: { subStrandId: subStrand.id } });

        for (const [sloIndex, sloData] of ssData.slos.entries()) {
          await prisma.sLO.create({
            data: {
              subStrandId: subStrand.id,
              description: sloData.description,
              cognitiveLevel: sloData.cognitiveLevel,
              order: sloIndex + 1,
              suggestedLessons: sloData.suggestedLessons ?? null,
            },
          });
          sloCount++;
        }
      }
    }
  }

  console.log(`  ✓ ${gradeData.name}: ${laCount} areas, ${strandCount} strands, ${ssCount} sub-strands, ${sloCount} SLOs`);
}

async function main() {
  console.log("🌱 Starting CBE curriculum seed...\n");

  await seedCompetencies();

  for (const gradeData of allGrades) {
    await seedGrade(gradeData);
  }

  console.log("\n✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
