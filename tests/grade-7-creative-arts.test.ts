/**
 * Regression guard for the transcribed Grade 7 Creative Arts and Sports
 * curriculum.
 *
 * The design organises the subject by process — foundations, creating and
 * performing, appreciation — where the previous seed organised it by art form.
 * The 150 published lessons reconcile against the official allocation of 5
 * periods a week over 30 teaching weeks.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { grade7CreativeArtsData } from "../prisma/seed/data/grade-7-creative-arts";
import { grade7Data } from "../prisma/seed/data/grade-7";

const strands = grade7CreativeArtsData.learningAreas[0].strands;
const subStrands = strands.flatMap((s) => s.subStrands);

describe("transcribed Grade 7 Creative Arts and Sports", () => {
  test("organises the subject by process, not by art form", () => {
    assert.deepEqual(strands.map((s) => s.name), [
      "FOUNDATIONS OF CREATIVE ARTS AND SPORTS",
      "CREATING AND PERFORMING IN CREATIVE ARTS AND SPORTS",
      "APPRECIATION IN CREATIVE ARTS AND SPORTS",
    ]);
    for (const gone of ["Visual Arts", "Performing Arts", "Sports"]) {
      assert.ok(!strands.some((s) => s.name === gone), `${gone} is not a design strand`);
    }
  });

  test("has 12 sub-strands totalling 150 lessons, matching the official allocation", () => {
    assert.equal(subStrands.length, 12);
    // Creative Arts and Sports is 5 periods a week over 30 teaching weeks.
    assert.equal(subStrands.reduce((n, s) => n + (s.suggestedLessons ?? 0), 0), 5 * 30);
  });

  test("keeps the sub-strands numbered with a trailing dot", () => {
    // "1.1. Introduction", "1.2. Components", "2.5. Western Solo Instrument" all
    // carry a dot after the number. Requiring whitespace straight after dropped
    // three sub-strands and 28 lessons.
    const keys = subStrands.map((s) => s.name);
    for (const n of [
      "Introduction to Creative Arts and Sports",
      "Components of Creative Arts and Sports",
      "Western Solo Instrument",
    ]) {
      assert.ok(keys.includes(n), `missing "${n}"`);
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
    const SUS = /guided to|suggested learning|key inquiry|core competencies|government of kenya/i;
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
  test("eight of the nine core subjects are transcribed", () => {
    const names = grade7Data.learningAreas.map((a) => a.name);
    for (const n of [
      "Mathematics",
      "English",
      "Kiswahili",
      "Pre-Technical Studies",
      "Integrated Science",
      "Social Studies",
      "Agriculture and Nutrition",
      "Creative Arts and Sports",
    ]) {
      assert.equal(names.filter((x) => x === n).length, 1, `${n} count`);
    }
    assert.equal(new Set(names).size, names.length, "duplicate learning area");
    assert.equal(grade7Data.learningAreas.length, 9);
    // Religious Education is held back: the design publishes Christian and
    // Islamic separately and splitting the seeded single area needs a decision.
    assert.equal(names.filter((n) => n === "Religious Education").length, 1);
  });
});