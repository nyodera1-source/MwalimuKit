/**
 * Tests for curriculum reconciliation.
 *
 * The scenario that matters is real: Grade 7 Mathematics was re-transcribed,
 * gaining "Measurements" and "Data Handling and Probability" while the invented
 * "Coordinates and Graphs" and "Statistics" strands remained in the database.
 * These tests pin that behaviour, especially the refusal to delete rows a saved
 * document still references.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  buildSeedIndex,
  collectReferencedIds,
  findOrphans,
  partitionByReference,
  type StrandRow,
  type SubStrandRow,
} from "../lib/curriculum/reconcile";
import { grade7Data } from "../prisma/seed/data/grade-7";

// The transcribed seed: Mathematics now has Measurements and Data Handling and
// Probability, and no longer has Coordinates and Graphs or Statistics.
const seed = buildSeedIndex([grade7Data]);

function strand(id: string, gradeLevel: number, area: string, name: string): StrandRow {
  return { id, gradeLevel, learningArea: area, strand: name };
}
function subStrand(
  id: string,
  strandId: string,
  gradeLevel: number,
  area: string,
  strandName: string,
  name: string
): SubStrandRow {
  return { id, strandId, gradeLevel, learningArea: area, strand: strandName, subStrand: name };
}

const mathStrands: StrandRow[] = [
  strand("s-numbers", 7, "Mathematics", "Numbers"),
  strand("s-algebra", 7, "Mathematics", "Algebra"),
  strand("s-geometry", 7, "Mathematics", "Geometry"),
  strand("s-measurements", 7, "Mathematics", "Measurements"),
  strand("s-dhp", 7, "Mathematics", "Data Handling and Probability"),
  // Left behind by the previous seed.
  strand("s-coords", 7, "Mathematics", "Coordinates and Graphs"),
  strand("s-stats", 7, "Mathematics", "Statistics"),
];

const mathSubStrands: SubStrandRow[] = [
  subStrand("ss-whole", "s-numbers", 7, "Mathematics", "Numbers", "Whole Numbers"),
  subStrand("ss-factors", "s-numbers", 7, "Mathematics", "Numbers", "Factors"),
  subStrand("ss-measure-len", "s-measurements", 7, "Mathematics", "Measurements", "Length"),
  subStrand("ss-measure-money", "s-measurements", 7, "Mathematics", "Measurements", "Money"),
  // Child of an orphaned strand: should not be reported separately.
  subStrand("ss-cartesian", "s-coords", 7, "Mathematics", "Coordinates and Graphs", "Cartesian Plane"),
  // Child of a live strand, but no longer in the seed.
  subStrand("ss-integers", "s-numbers", 7, "Mathematics", "Numbers", "Integers"),
];

describe("seed index", () => {
  test("keys are normalised and delimited so names cannot collide", () => {
    const idx = buildSeedIndex([
      { level: 7, name: "Grade 7", learningAreas: [{ name: "Mathematics", strands: [{ name: "Data Handling and Probability", order: 5, subStrands: [] }] }] },
    ]);
    // norm() lowercases and collapses whitespace, so the key is not the
    // display name. This is what stops "Numbers " and "numbers" diverging.
    assert.ok(idx.strands.has("7|mathematics|data handling and probability"));
  });

  test("a delimiter collision cannot merge two different keys", () => {
    // Without an explicit separator, "7" + "math" + "ematics" and
    // "7" + "mathematics" would produce the same key.
    const idx = buildSeedIndex([
      { level: 7, name: "Grade 7", learningAreas: [{ name: "Mathematics", strands: [{ name: "Algebra", order: 1, subStrands: [] }] }] },
    ]);
    assert.equal(idx.strands.has("7|mathematics|algebra"), true);
    assert.equal(idx.strands.has("7|mathematics|algeb|ra"), false);
  });
});

describe("findOrphans", () => {
  test("finds strands the seed no longer describes", () => {
    const orphans = findOrphans(seed, mathStrands, mathSubStrands);
    const strandOrphans = orphans.filter((o) => o.kind === "strand").map((o) => o.label);
    assert.equal(strandOrphans.length, 2);
    assert.ok(strandOrphans.some((l) => l.includes("Coordinates and Graphs")));
    assert.ok(strandOrphans.some((l) => l.includes("Statistics")));
  });

  test("keeps strands that match the seed", () => {
    const orphans = findOrphans(seed, mathStrands, mathSubStrands);
    const kept = orphans.filter((o) => o.kind === "strand").map((o) => o.label);
    for (const name of ["Numbers", "Algebra", "Geometry", "Measurements", "Data Handling and Probability"]) {
      assert.ok(!kept.some((l) => l.endsWith(name)), `${name} should not be orphaned`);
    }
  });

  test("reports sub-strands under an orphaned strand so references can protect them", () => {
    const orphans = findOrphans(seed, mathStrands, mathSubStrands);
    // Hiding these would let a strand be deleted even though a saved scheme
    // still points at a sub-strand inside it.
    assert.ok(
      orphans.some((o) => o.id === "ss-cartesian"),
      "children of an orphaned strand must still be reported"
    );
  });

  test("reports sub-strands that are gone from a live strand", () => {
    const orphans = findOrphans(seed, mathStrands, mathSubStrands);
    const ss = orphans.filter((o) => o.kind === "sub-strand").map((o) => o.id);
    assert.ok(ss.includes("ss-integers"));
  });

  test("keeps sub-strands still present in the seed", () => {
    const orphans = findOrphans(seed, mathStrands, mathSubStrands);
    const ids = orphans.map((o) => o.id);
    for (const id of ["ss-whole", "ss-factors", "ss-measure-len", "ss-measure-money"]) {
      assert.ok(!ids.includes(id), `${id} should not be orphaned`);
    }
  });

  test("returns nothing when the database matches the seed", () => {
    const clean: StrandRow[] = [strand("s-numbers", 7, "Mathematics", "Numbers")];
    const cleanSubs: SubStrandRow[] = [subStrand("ss-whole", "s-numbers", 7, "Mathematics", "Numbers", "Whole Numbers")];
    assert.deepEqual(findOrphans(seed, clean, cleanSubs), []);
  });

  test("the grade is part of the key", () => {
    // Only Grade 7 is seeded here, so a Grade 8 strand is an orphan even though
    // its area and strand names match a Grade 7 one. This is what stops a
    // Grade 8 "Numbers" strand being deleted because Grade 7 has one.
    const orphans = findOrphans(
      seed,
      [strand("s-x", 8, "Mathematics", "Numbers")],
      []
    );
    assert.equal(orphans.length, 1);
    assert.equal(orphans[0].gradeLevel, 8);
  });
});

describe("reference protection", () => {
  test("collects ids from plans and schemes", () => {
    const ids = collectReferencedIds({
      planStrandIds: ["s-a"],
      planSubStrandIds: ["ss-a"],
      planSloIds: [["slo-1", "slo-2"]],
      schemeSubStrandIds: [["ss-b"]],
    });
    assert.deepEqual([...ids].sort(), ["s-a", "slo-1", "slo-2", "ss-a", "ss-b"]);
  });

  test("splits orphans into safe and referenced", () => {
    const orphans = findOrphans(seed, mathStrands, mathSubStrands);
    const { safe, referenced } = partitionByReference(orphans, new Set(["s-coords"]));
    assert.equal(referenced.length, 1);
    assert.equal(referenced[0].id, "s-coords");
    assert.ok(!safe.some((s) => s.id === "s-coords"));
    assert.ok(safe.some((s) => s.id === "s-stats"));
  });

  test("a strand a lesson plan points at is never deleted", () => {
    const orphans = findOrphans(seed, mathStrands, mathSubStrands);
    const referenced = collectReferencedIds({
      planStrandIds: ["s-stats"],
      planSubStrandIds: [],
      planSloIds: [],
      schemeSubStrandIds: [],
    });
    const { safe } = partitionByReference(orphans, referenced);
    assert.ok(!safe.some((s) => s.id === "s-stats"), "must survive a reference");
    assert.equal(safe.length, orphans.length - 1);
  });

  test("a referenced sub-strand protects its orphaned parent strand", () => {
    // The dangerous case: the parent strand is gone from the seed, but a saved
    // scheme still points at a sub-strand inside it. Deleting the strand would
    // cascade and destroy that scheme's content.
    const orphans = findOrphans(seed, mathStrands, mathSubStrands);
    const referenced = collectReferencedIds({
      planStrandIds: [],
      planSubStrandIds: [],
      planSloIds: [],
      schemeSubStrandIds: [["ss-cartesian"]],
    });
    const { safe, referenced: kept } = partitionByReference(orphans, referenced);

    assert.ok(!safe.some((s) => s.id === "s-coords"), "parent strand must survive");
    assert.ok(!safe.some((s) => s.id === "ss-cartesian"), "referenced child kept");
    assert.ok(
      kept.some((s) => s.id === "s-coords"),
      "parent reported as kept rather than silently deleted"
    );
    // Unrelated orphans remain deletable.
    assert.ok(safe.some((s) => s.id === "s-stats"));
    assert.ok(safe.some((s) => s.id === "ss-integers"));
  });

  test("protection does not leak across unrelated branches", () => {
    const orphans = findOrphans(seed, mathStrands, mathSubStrands);
    const referenced = collectReferencedIds({
      planStrandIds: [],
      planSubStrandIds: [],
      planSloIds: [],
      schemeSubStrandIds: [["ss-cartesian"]],
    });
    const { safe } = partitionByReference(orphans, referenced);
    assert.ok(safe.some((s) => s.id === "ss-integers"), "unrelated sub-strand still deletable");
    assert.ok(safe.some((s) => s.id === "s-stats"), "unrelated strand still deletable");
  });
});
