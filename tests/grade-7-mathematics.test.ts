/**
 * Regression guard for the transcribed Grade 7 Mathematics curriculum.
 *
 * These assertions pin the figures published by the KICD design: five strands,
 * eighteen sub-strands and a total of 150 lessons. If a future refactor of the
 * transcription pipeline silently drops a sub-strand or a lesson count, the
 * coverage checker in Phase 4 would quietly produce wrong schedules — so fail
 * here instead.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  grade7MathematicsData,
  INCOMPLETE_IN_SOURCE,
} from "../prisma/seed/data/grade-7-mathematics";
import { grade7Data } from "../prisma/seed/data/grade-7";

const area = grade7MathematicsData.learningAreas[0];
const strands = area.strands;
const allSubStrands = strands.flatMap((s) => s.subStrands);

describe("transcribed Grade 7 Mathematics", () => {
  test("uses the five official KICD strand names", () => {
    assert.deepEqual(
      strands.map((s) => s.name),
      [
        "Numbers",
        "Algebra",
        "Measurements",
        "Geometry",
        "Data Handling and Probability",
      ]
    );
  });

  test("no longer contains the non-KICD strands from the old seed", () => {
    const names = strands.map((s) => s.name);
    assert.ok(!names.includes("Coordinates and Graphs"), "invented strand still present");
    assert.ok(!names.includes("Statistics"), "misnamed strand still present");
    assert.ok(names.includes("Measurements"), "Measurements was missing before");
  });

  test("has 18 sub-strands totalling 150 published lessons", () => {
    assert.equal(allSubStrands.length, 18);
    assert.equal(
      allSubStrands.reduce((n, s) => n + (s.suggestedLessons ?? 0), 0),
      150
    );
  });

  test("every sub-strand carries a lesson count and a page citation", () => {
    for (const s of allSubStrands) {
      assert.ok(s.suggestedLessons, `${s.name} has no suggestedLessons`);
      assert.ok(s.sourceRef, `${s.name} has no sourceRef`);
      assert.match(s.sourceRef!, /p\.\d+/, `${s.name} citation lacks a page`);
    }
  });

  test("strand numbering is 1..n and sub-strand order is contiguous", () => {
    strands.forEach((s, i) => {
      assert.equal(s.order, i + 1, `${s.name} strand order`);
      s.subStrands.forEach((ss, j) => {
        assert.equal(ss.order, j + 1, `${s.name}/${ss.name} sub-strand order`);
      });
    });
  });

  test("outcomes are present and none absorb learning-experience text", () => {
    assert.ok(allSubStrands.every((s) => s.slos.length > 0), "a sub-strand has no outcomes");
    const SUS = /guided to|suggested learning|key inquiry|core competencies/i;
    for (const s of allSubStrands) {
      for (const o of s.slos) {
        assert.ok(!SUS.test(o.description), `${s.name}: contaminated outcome "${o.description}"`);
        assert.ok(o.description.trim().length >= 15, `${s.name}: suspiciously short outcome`);
      }
    }
  });

  test("records the two outcomes that are incomplete in the source design", () => {
    assert.equal(INCOMPLETE_IN_SOURCE.length, 2);
    for (const item of INCOMPLETE_IN_SOURCE) {
      assert.ok(
        allSubStrands.some((s) => s.slos.some((o) => o.description === item.text)),
        `source-defect record not present in the data: ${item.text}`
      );
    }
  });

  test("nothing is marked verified before teacher review", () => {
    for (const s of allSubStrands) {
      assert.equal(s.verification, "unverified", `${s.name} must not claim verification`);
    }
  });
});

describe("Grade 7 assembly", () => {
  test("Mathematics leads the learning areas and pending subjects follow", () => {
    assert.equal(grade7Data.level, 7);
    assert.equal(grade7Data.learningAreas[0].name, "Mathematics");
    assert.equal(grade7Data.learningAreas.length, 10);
  });

  test("no duplicate learning area names", () => {
    const names = grade7Data.learningAreas.map((a) => a.name);
    assert.equal(new Set(names).size, names.length);
  });
});
