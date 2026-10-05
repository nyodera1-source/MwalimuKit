/**
 * Regression guard for the transcribed Grade 7 Christian Religious Education
 * curriculum.
 *
 * The design does not reconcile with the allocation printed in the same
 * document — 100 published lessons against 4 a week over 30 weeks — and three
 * separate layout problems cost the first pass a sub-strand, a strand name and
 * a phantom unit. Each is pinned here.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { grade7CreData } from "../prisma/seed/data/grade-7-cre";
import { grade7Data } from "../prisma/seed/data/grade-7";

const area = grade7CreData.learningAreas[0];
const strands = area.strands;
const subStrands = strands.flatMap((s) => s.subStrands);

describe("transcribed Grade 7 Christian Religious Education", () => {
  test("keeps the six body strands, with the contents-page variant collapsed", () => {
    // The contents page prints "EARLY LIFE OF JESUS CHRIST" where the body
    // prints "THE EARLY LIFE OF JESUS CHRIST". De-duplicating on the raw name
    // kept both and left every later sub-strand attributed to the wrong
    // strand, so a seventh, phantom strand appeared.
    assert.deepEqual(strands.map((s) => s.name), [
      "INTRODUCTION TO CHRISTIAN RELIGIOUS EDUCATION",
      "CREATION",
      "THE BIBLE",
      "THE EARLY LIFE OF JESUS CHRIST",
      "THE CHURCH",
      "CHRISTIAN LIVING TODAY",
    ]);
    assert.deepEqual(strands.map((s) => s.order), [1, 2, 3, 4, 5, 6]);
  });

  test("has 18 sub-strands", () => {
    // Two independent passes over the source agree on this count: the lesson
    // parentheticals, and the "should be able to" cue counted strand by strand
    // (1, 4, 4, 2, 2, 5).
    assert.equal(subStrands.length, 18);
    assert.equal(strands.map((s) => s.subStrands.length).reduce((a, b) => a + b, 0), 18);
    assert.equal(strands[0].subStrands.length, 1);
    assert.deepEqual(strands.slice(1, 5).map((s) => s.subStrands.length), [4, 4, 2, 2]);
    assert.equal(strands[5].subStrands.length, 5);
  });

  test("publishes 100 lessons, short of the 120 the allocation allows", () => {
    // The time-allocation table in this same document gives Religious
    // Education (CRE, HRE, IRE) 4 lessons a week: 4 x 30 = 120. The design
    // publishes 100. Two independent counts of the sub-strands say the content
    // is all here, so the gap is in the source. It is transcribed as published
    // and left for a teacher to resolve, not smoothed over.
    assert.equal(subStrands.reduce((n, s) => n + (s.suggestedLessons ?? 0), 0), 100);
    assert.notEqual(subStrands.reduce((n, s) => n + (s.suggestedLessons ?? 0), 0), 4 * 30);
  });

  test("keeps 4.1, whose lesson count prints across a page break", () => {
    // "4.1 Prophecies about the Messiah" is followed by three sentences and a
    // running footer before "(6 lessons)". Requiring the count to sit next to
    // the name dropped the sub-strand and its 6 lessons.
    const one = strands[3].subStrands[0];
    assert.equal(one.name, "Prophecies about the Messiah");
    assert.equal(one.suggestedLessons, 6);
    assert.match(one.sourceRef!, /p\.22, Strand 4\.0, Sub-strand 4\.1/);
    assert.ok(one.slos.length >= 3);
  });

  test("does not take the assessment appendix as a unit", () => {
    // Appendix 1 repeats every sub-strand with suggested assessment methods.
    // It carries a lesson count and no outcomes, so it was taken as a unit of
    // its own: a phantom "6.2 Christian Marriage and Family (7)".
    const marriage = subStrands.filter((s) => s.name === "Christian Marriage and Family");
    assert.equal(marriage.length, 1);
    assert.equal(marriage[0].suggestedLessons, 5);
    assert.ok(marriage[0].slos.length > 0);
    assert.ok(!subStrands.some((s) => s.suggestedLessons === 7));
  });

  test("stitches the outcome the page break split in two", () => {
    // The row for 6.2 runs across a page, so outcome (b) begins before the
    // learning-experience column and the running footer and resumes after it.
    const marriage = subStrands.find((s) => s.name === "Christian Marriage and Family")!;
    const split = marriage.slos.find((o) => o.description.includes("promote values among young"));
    assert.ok(split, "the split outcome is missing");
    assert.match(split!.description, /promote values among young people before marriage$/);
  });

  test("every sub-strand carries a lesson count and a page citation", () => {
    for (const s of subStrands) {
      assert.ok(s.suggestedLessons, `${s.name} has no suggestedLessons`);
      assert.ok(s.sourceRef, `${s.name} has no sourceRef`);
      // This design prints a recoverable "Page | N" marker, unlike the three
      // that only print a bare page number.
      assert.match(s.sourceRef!, /KICD G7 Christian Religious Education p\.\d+, Strand \d+\.0, Sub-strand \d+\.\d/, s.name);
    }
  });

  test("outcomes are single sentences free of learning-experience text", () => {
    const SUS = /guided to|suggested learning|key inquiry|core competencies|government of kenya|not for sale|page \|/i;
    const LEAK = /[A-Za-z]{4,}\.\s+[A-Za-z]/;
    const TAIL = /[\s,;.]*(?:(?:The|the)\s+)?(?:Learner|Mwanafunzi)s?(?:\s+(?:is|aelekezwe))?$/i;
    assert.ok(subStrands.every((s) => s.slos.length > 0));
    for (const s of subStrands) {
      for (const o of s.slos) {
        assert.ok(!SUS.test(o.description), `${s.name}: contaminated "${o.description}"`);
        assert.ok(!LEAK.test(o.description), `${s.name}: text after a full stop "${o.description}"`);
        assert.ok(!TAIL.test(o.description.trim()), `${s.name}: terminator fragment "${o.description}"`);
        assert.ok(o.description.trim().length >= 15, `${s.name}: outcome too short`);
      }
    }
  });

  test("nothing is marked verified before teacher review", () => {
    for (const s of subStrands) assert.equal(s.verification, "unverified", s.name);
  });
});

describe("Grade 7 Religious Education split", () => {
  test("replaces the hand-written Religious Education area with the design", () => {
    const names = grade7Data.learningAreas.map((a) => a.name);
    assert.equal(names.filter((n) => n === "Christian Religious Education").length, 1);
    // The single seeded area is gone: KICD publishes Christian and Islamic as
    // separate designs with their own strands and their own lesson counts, so
    // keeping it would put three RE entries in the subject picker.
    assert.equal(names.filter((n) => n === "Religious Education").length, 0);
    assert.equal(new Set(names).size, names.length, "duplicate learning area");
    assert.equal(grade7Data.learningAreas.length, 9);
  });
});
