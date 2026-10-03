/**
 * Removes curriculum rows that the seed data no longer describes.
 *
 * Safe to run repeatedly. Dry-run unless --apply is passed.
 *
 * The seeder upserts and never deletes, so re-transcribing a subject leaves the
 * previous rows selectable alongside the new ones. This closes that gap without
 * ever removing a row a teacher's document still points at.
 *
 *   npx tsx scripts/reconcile-curriculum.ts            # report only
 *   npx tsx scripts/reconcile-curriculum.ts --apply    # delete
 */

import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { allGrades } from "../prisma/seed/data/index";
import {
  buildSeedIndex,
  collectReferencedIds,
  findOrphans,
  partitionByReference,
  type StrandRow,
  type SubStrandRow,
} from "../lib/curriculum/reconcile";

const APPLY = process.argv.includes("--apply");

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to reconcile curriculum data.");
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    // Rows the database has that the seed data does not describe.
    const dbStrands: StrandRow[] = await prisma.strand.findMany({
      select: {
        id: true,
        name: true,
        learningArea: { select: { name: true, grade: { select: { level: true } } } },
      },
    }).then((rows) =>
      rows.map((r) => ({
        id: r.id,
        gradeLevel: r.learningArea.grade.level,
        learningArea: r.learningArea.name,
        strand: r.name,
      }))
    );

    const dbSubStrands: SubStrandRow[] = await prisma.subStrand.findMany({
      select: {
        id: true,
        strandId: true,
        name: true,
        strand: {
          select: {
            name: true,
            learningArea: {
              select: { name: true, grade: { select: { level: true } } },
            },
          },
        },
      },
    }).then((rows) =>
      rows.map((r) => ({
        id: r.id,
        strandId: r.strandId,
        gradeLevel: r.strand.learningArea.grade.level,
        learningArea: r.strand.learningArea.name,
        strand: r.strand.name,
        subStrand: r.name,
      }))
    );

    const seed = buildSeedIndex(allGrades);
    const orphans = findOrphans(seed, dbStrands, dbSubStrands);

    if (orphans.length === 0) {
      console.log("Curriculum matches the seed data; nothing to reconcile.");
      return;
    }

    // Anything a teacher's document points at must survive.
    const plans = await prisma.lessonPlan.findMany({
      select: { strandId: true, subStrandId: true, sloIds: true },
    });
    const schemes = await prisma.schemeOfWork.findMany({
      select: { weeks: true },
    });

    const schemeSubStrandIds = schemes.map((s) => {
      const weeks = (s.weeks ?? {}) as { selectedSubStrandIds?: string[] };
      return Array.isArray(weeks.selectedSubStrandIds)
        ? weeks.selectedSubStrandIds
        : [];
    });

    const referenced = collectReferencedIds({
      planStrandIds: plans.map((p) => p.strandId),
      planSubStrandIds: plans.map((p) => p.subStrandId),
      planSloIds: plans.map((p) => p.sloIds),
      schemeSubStrandIds,
    });

    const { safe, referenced: kept } = partitionByReference(orphans, referenced);

    console.log(`\nOrphaned curriculum rows: ${orphans.length}`);
    for (const row of orphans) {
      const blocked = !safe.some((s) => s.id === row.id);
      console.log(`  [${blocked ? "KEEP" : "ORPHAN"}] ${row.kind}: ${row.label}`);
    }

    if (kept.length > 0) {
      console.log(
        `\n${kept.length} row(s) are referenced by a saved document and will be kept:`
      );
      for (const row of kept) console.log(`  ${row.label}`);
    }

    if (!APPLY) {
      console.log(`\nDry run. Re-run with --apply to delete ${safe.length} row(s).`);
      return;
    }

    if (safe.length === 0) {
      console.log("\nNothing safe to delete.");
      return;
    }

    // Sub-strands first, then strands. Deleting a strand cascades to its
    // sub-strands and their outcomes, which is why orphaned strands do not
    // report their children.
    const subStrandIds = safe.filter((r) => r.kind === "sub-strand").map((r) => r.id);
    const strandIds = safe.filter((r) => r.kind === "strand").map((r) => r.id);

    if (subStrandIds.length > 0) {
      const res = await prisma.subStrand.deleteMany({ where: { id: { in: subStrandIds } } });
      console.log(`\nDeleted ${res.count} sub-strand(s).`);
    }
    if (strandIds.length > 0) {
      const res = await prisma.strand.deleteMany({ where: { id: { in: strandIds } } });
      console.log(`Deleted ${res.count} strand(s).`);
    }

    console.log("\nReconciliation complete.");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Curriculum reconciliation failed:", error);
  process.exit(1);
});
