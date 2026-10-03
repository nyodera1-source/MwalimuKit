import type { GradeData } from "../../prisma/seed/data/index";

/**
 * Curriculum reconciliation.
 *
 * The seeder upserts by natural key and never deletes. That is the right default
 * — a blanket delete would destroy teacher documents — but it means re-
 * transcribing a subject leaves the previous rows behind. Grade 7 Mathematics
 * gained "Measurements" and "Data Handling and Probability" while keeping
 * "Coordinates and Graphs" and "Statistics", so a teacher can select either the
 * real strand or the invented one.
 *
 * This module finds rows that exist in the database but not in the seed data.
 * It decides nothing about deletion; scripts/reconcile-curriculum.ts applies
 * that, and only for rows nothing references.
 *
 * The logic is pure so it can be tested without a database.
 */

export interface StrandRow {
  id: string;
  gradeLevel: number;
  learningArea: string;
  strand: string;
}

export interface SubStrandRow {
  id: string;
  strandId: string;
  /** Resolved through the parent strand, so a grade is always available. */
  gradeLevel: number;
  learningArea: string;
  strand: string;
  subStrand: string;
}

export interface OrphanRow {
  id: string;
  kind: "strand" | "sub-strand";
  label: string;
  gradeLevel: number;
  learningArea: string;
  parentId: string | null;
}

const norm = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

/**
 * Key delimiter. Curriculum names never contain "|", so it cannot collide, and
 * it is visible in source — an earlier version used a NUL byte, which worked
 * silently but was invisible in every template literal that built a key.
 */
const SEP = "|";

/** Authoritative keys derived from the seed data. */
export interface SeedIndex {
  areas: Set<string>;
  strands: Set<string>;
  subStrands: Set<string>;
}

export function buildSeedIndex(grades: GradeData[]): SeedIndex {
  const areas = new Set<string>();
  const strands = new Set<string>();
  const subStrands = new Set<string>();

  for (const grade of grades) {
    for (const area of grade.learningAreas) {
      areas.add(`${grade.level}${SEP}${norm(area.name)}`);
      for (const strand of area.strands) {
        strands.add(
          `${grade.level}${SEP}${norm(area.name)}${SEP}${norm(strand.name)}`
        );
        for (const sub of strand.subStrands) {
          subStrands.add(
            `${grade.level}${SEP}${norm(area.name)}${SEP}${norm(strand.name)}${SEP}${norm(sub.name)}`
          );
        }
      }
    }
  }

  return { areas, strands, subStrands };
}

/**
 * Rows in the database that the seed data does not describe.
 *
 * Orphaned sub-strands are reported even when their parent strand is also
 * orphaned. Hiding them would be tidier but unsafe: a saved scheme can still
 * point at a sub-strand inside a strand the seed no longer describes, and the
 * parent must be told to stay alive for it. Reporting every row lets the
 * reference check make that call.
 */
export function findOrphans(
  seed: SeedIndex,
  dbStrands: StrandRow[],
  dbSubStrands: SubStrandRow[]
): OrphanRow[] {
  const orphans: OrphanRow[] = [];
  const liveStrandIds = new Set<string>();

  for (const row of dbStrands) {
    const key = `${row.gradeLevel}${SEP}${norm(row.learningArea)}${SEP}${norm(row.strand)}`;
    if (seed.strands.has(key)) {
      liveStrandIds.add(row.id);
      continue;
    }
    orphans.push({
      id: row.id,
      kind: "strand",
      label: `Grade ${row.gradeLevel} / ${row.learningArea} / ${row.strand}`,
      gradeLevel: row.gradeLevel,
      learningArea: row.learningArea,
      parentId: null,
    });
  }

  for (const row of dbSubStrands) {
    const parentLive = liveStrandIds.has(row.strandId);

    if (parentLive) {
      const key = `${row.gradeLevel}${SEP}${norm(row.learningArea)}${SEP}${norm(row.strand)}${SEP}${norm(row.subStrand)}`;
      if (seed.subStrands.has(key)) continue;
    }
    // Either the parent strand is gone from the seed, or this sub-strand is.

    orphans.push({
      id: row.id,
      kind: "sub-strand",
      label: `Grade ${row.gradeLevel} / ${row.learningArea} / ${row.strand} / ${row.subStrand}`,
      gradeLevel: row.gradeLevel,
      learningArea: row.learningArea,
      parentId: row.strandId,
    });
  }

  return orphans;
}

/** Splits orphans into those safe to delete and those a document still needs. */
export function partitionByReference<T extends OrphanRow>(
  orphans: T[],
  referencedIds: Set<string>
): { safe: T[]; referenced: T[] } {
  // A referenced sub-strand implies its parent strand is referenced too.
  // Deleting the strand cascades to the sub-strand, so protecting only the
  // child would still destroy a document's content.
  const effective = new Set(referencedIds);
  let grew = true;
  while (grew) {
    grew = false;
    for (const orphan of orphans) {
      if (
        orphan.kind === "sub-strand" &&
        orphan.parentId &&
        referencedIds.has(orphan.id) &&
        !effective.has(orphan.parentId)
      ) {
        effective.add(orphan.parentId);
        grew = true;
      }
    }
  }

  const safe: T[] = [];
  const referenced: T[] = [];
  for (const orphan of orphans) {
    (effective.has(orphan.id) ? referenced : safe).push(orphan);
  }
  return { safe, referenced };
}

/**
 * Collects every id a teacher document depends on.
 *
 * SchemeOfWork keeps its schedule in a JSON blob with selectedSubStrandIds
 * inside, so it has to be read rather than joined on.
 */
export function collectReferencedIds(input: {
  planStrandIds: string[];
  planSubStrandIds: string[];
  planSloIds: string[][];
  schemeSubStrandIds: string[][];
}): Set<string> {
  const ids = new Set<string>();
  for (const list of [
    input.planStrandIds,
    input.planSubStrandIds,
    ...input.planSloIds,
    ...input.schemeSubStrandIds,
  ]) {
    for (const id of list) if (id) ids.add(id);
  }
  return ids;
}
