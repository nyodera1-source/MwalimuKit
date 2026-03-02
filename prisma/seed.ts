import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { grade1Data } from "./seed/data/grade-1";
import { grade2Data } from "./seed/data/grade-2";
import { grade3Data } from "./seed/data/grade-3";
import { grade4Data } from "./seed/data/grade-4";
import { grade5Data } from "./seed/data/grade-5";
import { grade6Data } from "./seed/data/grade-6";
import { grade7Data } from "./seed/data/grade-7";
import { grade8Data } from "./seed/data/grade-8";
import { grade9Data } from "./seed/data/grade-9";
import { grade10Data } from "./seed/data/grade-10";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

const CORE_COMPETENCIES = [
  { name: "Communication and Collaboration", description: "Ability to communicate effectively and work with others" },
  { name: "Critical Thinking and Problem Solving", description: "Ability to think critically and solve problems creatively" },
  { name: "Creativity and Imagination", description: "Ability to think creatively and develop new ideas" },
  { name: "Citizenship", description: "Understanding of civic responsibility and national values" },
  { name: "Digital Literacy", description: "Ability to use digital technology effectively and responsibly" },
  { name: "Learning to Learn", description: "Ability to learn independently and manage own learning" },
  { name: "Self-Efficacy", description: "Confidence in own ability to succeed and overcome challenges" },
];

interface SLOData {
  description: string;
  cognitiveLevel: string;
}

interface SubStrandData {
  name: string;
  order: number;
  slos: SLOData[];
}

interface StrandData {
  name: string;
  order: number;
  subStrands: SubStrandData[];
}

interface LearningAreaData {
  name: string;
  strands: StrandData[];
}

interface GradeData {
  level: number;
  name: string;
  learningAreas: LearningAreaData[];
}

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
          update: { order: ssData.order },
          create: { strandId: strand.id, name: ssData.name, order: ssData.order },
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

  const allGrades: GradeData[] = [
    grade1Data, grade2Data, grade3Data, grade4Data, grade5Data,
    grade6Data, grade7Data, grade8Data, grade9Data, grade10Data,
  ];

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
