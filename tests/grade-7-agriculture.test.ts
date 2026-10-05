/**
 * Regression guard for the transcribed Grade 7 Agriculture and Nutrition
 * curriculum.
 *
 * The subject was renamed: the design publishes "Agriculture and Nutrition", a
 * combined subject, replacing a standalone "Agriculture" whose strands were not
 * the Junior School structure at all. Both names must not reach the subject
 * picker, so that is asserted.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { grade7AgricultureData } from "../prisma/seed/data/grade-7-agriculture";
import { grade7Data } from "../prisma/seed/data/grade-7";

const strands = grade7AgricultureData.learningAreas[0].strands;
const subStrands = strands.flatMap((s) => s.subStrands);

describe("transcribed Grade 7 Agriculture and Nutrition", () => {
  test("uses the four official strand names", () => {
    assert.deepEqual(strands.map((s) => s.name), [
      "CONSERVATION OF RESOURCES",
      "FOOD PRODUCTION PROCESSES",
      "HYGIENE PRACTICES",
      "PRODUCTION TECHNIQUES",
    ]);
  });

  test("has 14 sub-strands totalling 120 lessons, matching the official allocation", () => {
    assert.equal(subStrands.length, 14);
    // Agriculture and Nutrition is 4 periods a week over 30 teaching weeks.
    assert.equal(subStrands.reduce((n, s) => n + (s.suggestedLessons ?? 0), 0), 4 * 30);
  });

  test("keeps the four sub-strands whose names contain a colon", () => {
    // A name class without ":" dropped all four silently.
    const names = subStrands.map((s) => s.name);
    for (const n of [
      "Preparing Animal Products: Eggs and Honey",
      "Cooking: Grilling, Roasting and Steaming",
      "Laundry: Loose Coloured Items",
      "Sewing Skills: Knitting",
    ]) {
      assert.ok(names.includes(n), `missing "${n}"`);
    }
  });

  test("every sub-strand carries a lesson count and a citation", () => {
    for (const s of subStrands) {
      assert.ok(s.suggestedLessons, `${s.name} has no suggestedLessons`);
      assert.ok(s.sourceRef, `${s.name} has no sourceRef`);
      assert.match(s.sourceRef!, /Strand \d+\.0, Sub-strand \d+\.\d/, s.name);
    }
  });

  test("outcomes are free of learning-experience text", () => {
    // This design writes "Learners are guided to:", which a singular marker misses.
    const SUS = /are guided to|is guided to|suggested learning|key inquiry|core competencies/i;
    for (const s of subStrands) {
      assert.ok(s.slos.length > 0, `${s.name} has no outcomes`);
      for (const o of s.slos) {
        assert.ok(!SUS.test(o.description), `${s.name}: contaminated "${o.description}"`);
        assert.ok(o.description.trim().length >= 15, `${s.name}: outcome too short`);
      }
    }
  });

  test("nothing is marked verified before teacher review", () => {
    for (const s of subStrands) assert.equal(s.verification, "unverified", s.name);
  });
});

describe("Grade 7 assembly", () => {
  test("seven subjects are transcribed and each appears once", () => {
    const names = grade7Data.learningAreas.map((a) => a.name);
    for (const n of [
      "Mathematics",
      "English",
      "Kiswahili",
      "Pre-Technical Studies",
      "Integrated Science",
      "Social Studies",
      "Agriculture and Nutrition",
    ]) {
      assert.equal(names.filter((x) => x === n).length, 1, `${n} count`);
    }
    assert.equal(
      names.filter((n) => n === "Agriculture").length,
      0,
      "stale standalone Agriculture area must not appear alongside the renamed subject"
    );
    assert.equal(new Set(names).size, names.length, "duplicate learning area");
    assert.equal(grade7Data.learningAreas.length, 10);
  });
});