/**
 * Regression guard for the transcribed Grade 7 Integrated Science curriculum.
 *
 * Two levels, like Mathematics: strand and sub strand, with the published
 * lesson count on the sub strand. The 150 published lessons reconcile against
 * the official Junior School allocation of 5 periods a week over 30 teaching
 * weeks, which is the first independent check that a transcription is complete.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { grade7IntegratedScienceData } from "../prisma/seed/data/grade-7-integrated-science";
import { grade7Data } from "../prisma/seed/data/grade-7";

const strands = grade7IntegratedScienceData.learningAreas[0].strands;
const subStrands = strands.flatMap((s) => s.subStrands);

describe("transcribed Grade 7 Integrated Science", () => {
  test("uses the four official strand names", () => {
    assert.deepEqual(strands.map((s) => s.name), [
      "SCIENTIFIC INVESTIGATION",
      "MIXTURES",
      "LIVING THINGS AND THEIR ENVIRONMENT",
      "FORCE AND ENERGY",
    ]);
  });

  test("renames the strands the old seed got wrong", () => {
    const names = strands.map((s) => s.name);
    assert.ok(!names.includes("MATTER"), "design calls this strand Mixtures");
    assert.ok(!names.includes("LIVING THINGS"), "design includes 'and their environment'");
  });

  test("has 9 sub-strands totalling 150 published lessons", () => {
    assert.equal(subStrands.length, 9);
    assert.equal(subStrands.reduce((n, s) => n + (s.suggestedLessons ?? 0), 0), 150);
  });

  test("every sub-strand carries a lesson count and a page citation", () => {
    for (const s of subStrands) {
      assert.ok(s.suggestedLessons, `${s.name} has no suggestedLessons`);
      assert.ok(s.sourceRef, `${s.name} has no sourceRef`);
      assert.match(s.sourceRef!, /p\.\d+/, `${s.name} citation lacks a page`);
    }
  });

  test("outcomes are free of learning-experience text", () => {
    const SUS = /is guided to|the learner is guided|suggested learning|key inquiry|core competencies|government of kenya/i;
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
  test("five subjects are transcribed and each appears once", () => {
    const names = grade7Data.learningAreas.map((a) => a.name);
    for (const n of [
      "Mathematics",
      "English",
      "Kiswahili",
      "Pre-Technical Studies",
      "Integrated Science",
    ]) {
      assert.equal(names.filter((x) => x === n).length, 1, `${n} count`);
    }
    assert.equal(new Set(names).size, names.length, "duplicate learning area");
    assert.equal(grade7Data.learningAreas.length, 14);
  });
});
