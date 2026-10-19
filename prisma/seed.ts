import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import {
  CORE_COMPETENCIES,
  allGrades,
  type GradeData,
} from "./seed/data/index";
import { transcribedGrade7Areas } from "../lib/curriculum/transcribed-grade-7";
import {
  TRANSCRIBED_GRADE_LEVELS,
  isTranscribedCurriculumArea,
} from "../lib/curriculum/transcribed-curriculum";

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
    const transcribed = isTranscribedCurriculumArea(gradeData.level, laData.name);
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
            skillStrand: ssData.skillStrand ?? null,
            ...(transcribed ? { verification: ssData.verification ?? "unverified" } : {}),
          },
          create: {
            strandId: strand.id,
            name: ssData.name,
            order: ssData.order,
            suggestedTerm: ssData.suggestedTerm ?? null,
            suggestedLessons: ssData.suggestedLessons ?? null,
            sourceRef: ssData.sourceRef ?? null,
            skillStrand: ssData.skillStrand ?? null,
            verification: ssData.verification ?? "unverified",
          },
        });
        ssCount++;

        if (transcribed) {
          const existing = await prisma.sLO.findMany({
            where: { subStrandId: subStrand.id },
            orderBy: [{ order: "asc" }, { id: "asc" }],
            select: { id: true, order: true },
          });
          const used = new Set<string>();
          for (const [sloIndex, sloData] of ssData.slos.entries()) {
            const match = existing.find((row) => row.order === sloIndex + 1 && !used.has(row.id));
            const data = {
              description: sloData.description,
              cognitiveLevel: sloData.cognitiveLevel,
              order: sloIndex + 1,
              suggestedLessons: sloData.suggestedLessons ?? null,
              verification: sloData.verification ?? "unverified",
            };
            if (match) {
              await prisma.sLO.update({ where: { id: match.id }, data });
              used.add(match.id);
            } else {
              await prisma.sLO.create({ data: { ...data, subStrandId: subStrand.id } });
            }
            sloCount++;
          }
          const obsolete = existing.filter((row) => !used.has(row.id)).map((row) => row.id);
          if (obsolete.length) {
            await prisma.sLO.updateMany({
              where: { id: { in: obsolete } },
              data: { verification: "superseded" },
            });
          }
        } else {
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

    if (transcribed) {
      const canonical = new Map(laData.strands.map((strand) => [
        strand.name,
        new Set(strand.subStrands.map((sub) => sub.name)),
      ]));
      const stored = await prisma.strand.findMany({
        where: { learningAreaId: la.id },
        select: { name: true, subStrands: { select: { id: true, name: true } } },
      });
      const obsoleteIds = stored.flatMap((strand) =>
        strand.subStrands
          .filter((sub) => !canonical.get(strand.name)?.has(sub.name))
          .map((sub) => sub.id)
      );
      if (obsoleteIds.length) {
        await prisma.subStrand.updateMany({
          where: { id: { in: obsoleteIds } },
          data: { verification: "superseded" },
        });
      }
    }
  }

  if (gradeData.level === 10) {
    const canonicalAreaNames = gradeData.learningAreas.map((area) => area.name);
    const obsoleteAreas = await prisma.learningArea.findMany({
      where: {
        gradeId: grade.id,
        name: { notIn: canonicalAreaNames },
      },
      select: {
        strands: {
          select: {
            subStrands: { select: { id: true } },
          },
        },
      },
    });
    const obsoleteSubStrandIds = obsoleteAreas.flatMap((area) =>
      area.strands.flatMap((strand) =>
        strand.subStrands.map((subStrand) => subStrand.id)
      )
    );
    if (obsoleteSubStrandIds.length) {
      await prisma.subStrand.updateMany({
        where: { id: { in: obsoleteSubStrandIds } },
        data: { verification: "superseded" },
      });
      await prisma.sLO.updateMany({
        where: { subStrandId: { in: obsoleteSubStrandIds } },
        data: { verification: "superseded" },
      });
    }
  }

  console.log(`  ✓ ${gradeData.name}: ${laCount} areas, ${strandCount} strands, ${ssCount} sub-strands, ${sloCount} SLOs`);
}

async function main() {
  const publishedGradeArg = process.argv.find((arg) =>
    arg.startsWith("--published-grade=")
  );
  const requestedPublishedLevel = publishedGradeArg
    ? Number(publishedGradeArg.split("=")[1])
    : null;

  if (process.argv.includes("--published-curriculum") || requestedPublishedLevel) {
    if (
      requestedPublishedLevel &&
      !TRANSCRIBED_GRADE_LEVELS.includes(
        requestedPublishedLevel as (typeof TRANSCRIBED_GRADE_LEVELS)[number]
      )
    ) {
      throw new Error(`Grade ${requestedPublishedLevel} is not a published curriculum grade.`);
    }

    const targetLevels = requestedPublishedLevel
      ? [requestedPublishedLevel]
      : [...TRANSCRIBED_GRADE_LEVELS];
    console.log(
      `Synchronising source-backed curriculum for Grade${targetLevels.length > 1 ? "s" : ""} ${targetLevels.join(", ")}...`
    );
    await seedCompetencies();

    for (const gradeData of allGrades) {
      if (!targetLevels.includes(gradeData.level)) continue;

      const learningAreas = gradeData.learningAreas.filter((area) =>
        isTranscribedCurriculumArea(gradeData.level, area.name)
      );
      if (!learningAreas.length) {
        throw new Error(`No source-backed curriculum is available for ${gradeData.name}.`);
      }
      await seedGrade({ ...gradeData, learningAreas });
    }

    console.log("\nSource-backed curriculum synchronisation complete.");
    return;
  }

  if (process.argv.includes("--transcribed-grade-7")) {
    const grade7 = allGrades.find((grade) => grade.level === 7);
    if (!grade7 || transcribedGrade7Areas.length === 0) {
      throw new Error("No transcribed Grade 7 curriculum is available to seed.");
    }
    console.log("Synchronising transcribed Grade 7 curriculum only...");
    await seedGrade({ ...grade7, learningAreas: transcribedGrade7Areas });
    return;
  }

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
