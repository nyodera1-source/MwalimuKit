/**
 * Regression guard for the transcribed Grade 7 Social Studies curriculum.
 *
 * This is the first subject where the design contradicts itself: its summary
 * table totals 120 lessons, matching the official allocation of 4 periods a
 * week over 30 weeks, while four body headings state 4 where the summary
 * states 5. The tests pin the transcribed values and the conflict list, so
 * neither can drift silently.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  grade7SocialStudiesData,
  SOURCE_CONFLICTS,
} from "../prisma/seed/data/grade-7-social-studies";
import { grade7Data } from "../prisma/seed/data/grade-7";

const strands = grade7SocialStudiesData.learningAreas[0].strands;
const subStrands = strands.flatMap((s) => s.subStrands);

describe("transcribed Grade 7 Social Studies", () => {
  test("has 5 strands including Community Service Learning", () => {
    assert.deepEqual(strands.map((s) => s.name), [
      "SOCIAL STUDIES AND PERSONAL DEVELOPMENT",
      "PEOPLE AND RELATIONSHIPS",
      "COMMUNITY SERVICE LEARNING",
      "NATURAL AND HISTORIC BUILT ENVIRONMENTS IN AFRICA",
      "POLITICAL DEVELOPMENT AND GOVERNANCE",
    ]);
  });

  test("CSL is present as its own strand", () => {
    // The previous seed had no CSL at all, which is a flagship CBC component.
    assert.ok(strands.some((s) => s.name === "COMMUNITY SERVICE LEARNING"));
    assert.ok(
      !strands.some((s) => s.name === "History" || s.name === "Geography"),
      "generic school-subject strands should be gone"
    );
  });

  test("has 20 sub-strands with body lesson counts totalling 114", () => {
    assert.equal(subStrands.length, 20);
    assert.equal(subStrands.reduce((n, s) => n + (s.suggestedLessons ?? 0), 0), 114);
  });

  test("records the four summary-versus-body lesson conflicts", () => {
    const countConflicts = SOURCE_CONFLICTS.filter((c) => c.summaryLessons !== c.bodyLessons);
    assert.equal(countConflicts.length, 4, "four lesson-count conflicts");
    assert.deepEqual(
      countConflicts.map((c) => c.subStrand).sort(),
      ["1.2", "2.3", "2.5", "5.4"]
    );
    // The stored value must be the body value, matching what is transcribed.
    for (const c of countConflicts) {
      const [strand, sub] = c.subStrand.split(".").map(Number);
      const stored = strands[strand - 1].subStrands.find((s) => s.order === sub);
      assert.ok(stored, `${c.subStrand} not found`);
      assert.equal(stored!.suggestedLessons, c.bodyLessons, c.subStrand);
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
    const SUS = /is guided to|suggested learning|key inquiry|core competencies|oral questions|written tests/i;
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
  test("six subjects are transcribed and each appears once", () => {
    const names = grade7Data.learningAreas.map((a) => a.name);
    for (const n of [
      "Mathematics",
      "English",
      "Kiswahili",
      "Pre-Technical Studies",
      "Integrated Science",
      "Social Studies",
    ]) {
      assert.equal(names.filter((x) => x === n).length, 1, `${n} count`);
    }
    assert.equal(new Set(names).size, names.length, "duplicate learning area");
    assert.equal(grade7Data.learningAreas.length, 9);
  });
});