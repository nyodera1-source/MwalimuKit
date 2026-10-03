/**
 * Proves the curriculum audit can fail.
 *
 * The audit reports zero findings. That is only meaningful if the detectors are
 * shown to fire on known-bad input — otherwise "clean" and "blind" are
 * indistinguishable. These tests pin each check against the damage class it
 * exists to catch.
 *
 * Note on the seeded data: Grade 4 contains U+00D7 (multiplication sign) and
 * Grade 10 contains U+03C1 (Greek rho). Both are correct curriculum content
 * that happen to be non-ASCII. Flagging them would be a false positive, and
 * "correcting" them would corrupt good data — so they are asserted clean.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { findEncodingIssues, isCleanText } from "../lib/curriculum/checks";

const ch = String.fromCharCode;

describe("encoding detection", () => {
  test("catches a lone C1 control character", () => {
    // What a lossy encoding round-trip leaves behind: the intended Greek
    // letter is gone and a C1 control sits in its place.
    const damaged = `Derive and apply the equation P = ${ch(0x0081)}gh for pressure in fluids`;
    const issues = findEncodingIssues(damaged);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].code, "encoding.c1-control");
  });

  test("catches C1 controls across the whole range", () => {
    for (const code of [0x80, 0x85, 0x9b, 0x9f]) {
      const issues = findEncodingIssues(`bad${ch(code)}text`);
      assert.ok(
        issues.some((i) => i.code === "encoding.c1-control"),
        `expected U+${code.toString(16).toUpperCase()} to be flagged`
      );
    }
  });

  test("catches U+FFFD replacement characters", () => {
    const issues = findEncodingIssues(`topic ${ch(0xfffd)} broken`);
    assert.equal(issues[0]?.code, "encoding.replacement-char");
  });

  test("catches stray control characters but allows tab and newline", () => {
    assert.equal(
      findEncodingIssues(`a${ch(0x0007)}b`)[0]?.code,
      "encoding.control-char"
    );
    assert.equal(findEncodingIssues(`x${ch(0x7f)}y`)[0]?.code, "encoding.control-char");
    assert.deepEqual(findEncodingIssues("line one\nline two\tafter tab\r\n"), []);
  });

  test("accepts the multiplication sign in Grade 4", () => {
    const valid = `Recall multiplication tables up to 12 ${ch(0x00d7)} 12`;
    assert.deepEqual(findEncodingIssues(valid), []);
    assert.equal(isCleanText(valid), true);
  });

  test("accepts Greek rho and other legitimate notation", () => {
    assert.deepEqual(
      findEncodingIssues(`Derive and apply the equation P = ${ch(0x03c1)}gh for pressure in fluids`),
      []
    );
  });

  test("accepts accented text and non-Latin scripts", () => {
    assert.deepEqual(findEncodingIssues("Hadhihiki vitabu kwa ubora"), []);
    assert.deepEqual(findEncodingIssues("éèêë àâä çñ"), []);
    assert.deepEqual(findEncodingIssues("προσοχή · √25 · ±3"), []);
  });

  test("rejects blank text", () => {
    assert.equal(isCleanText(""), false);
    assert.equal(isCleanText("   "), false);
  });
});

describe("seeded curriculum", () => {
  test("every seeded outcome is encoding-clean", async () => {
    const { allGrades } = await import("../prisma/seed/data/index");

    const damaged: string[] = [];
    for (const grade of allGrades) {
      for (const la of grade.learningAreas) {
        for (const strand of la.strands) {
          for (const sub of strand.subStrands) {
            for (const slo of sub.slos) {
              if (findEncodingIssues(slo.description).length > 0) {
                damaged.push(`${grade.name} / ${la.name} / ${sub.name}`);
              }
            }
          }
        }
      }
    }

    assert.deepEqual(damaged, [], `damaged outcomes in: ${damaged.join(", ")}`);
  });

  test("maths and physics notation survives intact", async () => {
    const { grade4Data } = await import("../prisma/seed/data/grade-4");
    const { grade10Data } = await import("../prisma/seed/data/grade-10");

    const flat = (g: { learningAreas: { strands: { subStrands: { slos: { description: string }[] }[] }[] }[] }) =>
      g.learningAreas.flatMap((la) => la.strands).flatMap((s) => s.subStrands).flatMap((s) => s.slos).map((s) => s.description);

    const tables = flat(grade4Data).find((d) => d.includes("multiplication tables"));
    assert.ok(tables?.includes(ch(0x00d7)), "Grade 4 multiplication sign intact");

    const pressure = flat(grade10Data).find((d) => d.includes("pressure in fluids"));
    assert.ok(pressure?.includes(ch(0x03c1)), "Grade 10 Greek rho intact");
  });

  test("per-grade scale is unchanged outside Grade 7", async () => {
    const { allGrades } = await import("../prisma/seed/data/index");

    const count = (g: (typeof allGrades)[number]) => {
      let areas = 0, strands = 0, subStrands = 0, outcomes = 0;
      for (const la of g.learningAreas) {
        areas++;
        strands += la.strands.length;
        for (const s of la.strands) {
          subStrands += s.subStrands.length;
          for (const ss of s.subStrands) outcomes += ss.slos.length;
        }
      }
      return { areas, strands, subStrands, outcomes };
    };

    // Pinned per grade rather than in aggregate. Grade 7 moves as subjects are
    // re-transcribed from the KICD designs; a whole-corpus total would need
    // editing after every subject and would hide collateral damage to the
    // grades that have not been touched.
    const expected: Record<number, { areas: number; strands: number; subStrands: number; outcomes: number }> = {
      1: { areas: 7, strands: 20, subStrands: 39, outcomes: 88 },
      2: { areas: 7, strands: 26, subStrands: 61, outcomes: 162 },
      3: { areas: 7, strands: 26, subStrands: 69, outcomes: 193 },
      4: { areas: 10, strands: 38, subStrands: 78, outcomes: 212 },
      5: { areas: 10, strands: 32, subStrands: 51, outcomes: 109 },
      6: { areas: 10, strands: 35, subStrands: 72, outcomes: 191 },
      // Grade 7 is intentionally absent: Grade 7 Mathematics has been replaced
      // with the transcribed design and the other subjects are still pending.
      8: { areas: 9, strands: 33, subStrands: 67, outcomes: 189 },
      9: { areas: 9, strands: 32, subStrands: 47, outcomes: 101 },
      10: { areas: 39, strands: 106, subStrands: 157, outcomes: 316 },
    };

    for (const g of allGrades) {
      if (g.level === 7) continue;
      assert.deepEqual(count(g), expected[g.level], `Grade ${g.level} shape changed`);
    }

    assert.equal(allGrades.length, 10);
  });

  test("Grade 7 retains all nine learning areas", async () => {
    const { allGrades } = await import("../prisma/seed/data/index");
    const g7 = allGrades.find((g) => g.level === 7)!;
    assert.deepEqual(
      g7.learningAreas.map((a) => a.name).sort(),
      [
        "Agriculture",
        "Creative Arts and Sports",
        "English",
        "Integrated Science",
        "Kiswahili",
        "Mathematics",
        "Pre-Technical Studies",
        "Religious Education",
        "Social Studies",
      ]
    );
  });
});
