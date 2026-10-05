/**
 * Regression guard for the transcribed Grade 7 Islamic Religious Education
 * curriculum.
 *
 * Three layout problems cost the first pass: every sub-strand's strand, half
 * of two sub-strand names, and four outcomes replaced by seven from a
 * different section. Each is pinned here.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { grade7IreData } from "../prisma/seed/data/grade-7-ire";
import { grade7Data } from "../prisma/seed/data/grade-7";

const area = grade7IreData.learningAreas[0];
const strands = area.strands;
const subStrands = strands.flatMap((s) => s.subStrands);

describe("transcribed Grade 7 Islamic Religious Education", () => {
  test("keeps the seven strands read from the table header", () => {
    // This design has no "STRAND n.0" heading. The strand sits in the last
    // column of the repeating table header — "... Key Inquiry Question(s)
    // 5.0 Akhlaq (Moral values) 5.1 ..." — once per sub-strand, while the
    // contents page spells the names in capitals. A pass looking for the
    // heading found nothing and left all sixteen sub-strands strandless.
    assert.deepEqual(strands.map((s) => s.name), [
      "Qur’an",
      "Hadith",
      "Pillars of Iman",
      "Devotional Acts",
      "Akhlaq (Moral values)",
      "Muamalat (Social Relationship)",
      "Islamic Heritage and Civilisation",
    ]);
    assert.deepEqual(strands.map((s) => s.order), [1, 2, 3, 4, 5, 6, 7]);
  });

  test("has 16 sub-strands split 2-2-2-3-3-3-1", () => {
    // The strand header repeats once per sub-strand, so counting those rows
    // is an independent check on the lesson parentheticals: both give 16.
    assert.equal(subStrands.length, 16);
    assert.deepEqual(strands.map((s) => s.subStrands.length), [2, 2, 2, 3, 3, 3, 1]);
  });

  test("publishes 121 lessons, one more than the allocation allows", () => {
    // The lesson-allocation table in this same document gives Religious
    // Education 4 lessons a week: 4 x 30 = 120. The design publishes 121, and
    // its Christian counterpart publishes 100 against the same allocation.
    // Transcribed as published in both cases, not rounded to the table.
    const total = subStrands.reduce((n, s) => n + (s.suggestedLessons ?? 0), 0);
    assert.equal(total, 121);
    assert.notEqual(total, 4 * 30);
    assert.equal(strands[6].subStrands[0].suggestedLessons, 16);
  });

  test("keeps both sub-strand names the orphan pass cut in half", () => {
    // "1.1 Ulumul Qur’an" stops at the curly apostrophe and "7.1 Reforms
    // introduced By Prophet Muhammad (S.A.W.)" stops at the full stop when the
    // name class excludes them, and the fallback rebuilds a shortened name.
    const one = strands[0].subStrands[0];
    assert.equal(one.name, "Ulumul Qur’an");
    assert.ok(one.name.includes("’"), "the curly apostrophe was dropped");
    assert.equal(one.suggestedLessons, 8);

    const seven = strands[6].subStrands[0];
    assert.equal(seven.name, "Reforms introduced By Prophet Muhammad (S.A.W.)");
    assert.ok(seven.name.includes("."), "the name lost its full stops");
  });

  test("keeps content bullets out of the name they sit beside", () => {
    // "2.2 Selected Hadith" is followed in the same cell by the bullet items
    // "Hadith on intention" and "Hadith on choice of friends", and the lesson
    // count only arrives after them. A name class without the bullet
    // character fails to reach the count, so the fallback runs and swallows
    // the bullets.
    const two = strands[1].subStrands[1];
    assert.equal(two.name, "Selected Hadith");
    assert.ok(!two.name.includes("Hadith on intention"), "bullet content leaked into the name");
    assert.equal(two.suggestedLessons, 8);
    assert.ok(two.slos.length > 0);
  });

  test("gives 7.1 its own four outcomes, not the service-learning section's", () => {
    // The last unit's block runs to the appendix, and the Community Service
    // Learning activity opens with a cue of its own and carries seven
    // outcomes to 7.1's four. Picking the longest ascending list replaced the
    // real outcomes with ones belonging to another section.
    const seven = strands[6].subStrands[0];
    assert.equal(seven.slos.length, 4);
    assert.match(seven.slos[0].description, /^describe the socio-religious/);
    assert.match(seven.slos[3].description, /morally upright society$/);

    // No sub-strand may carry the service-learning list instead of its own.
    for (const s of subStrands) {
      assert.ok(
        !s.slos.some((o) => /identified problem|community through research/.test(o.description)),
        `${s.name} carries a service-learning outcome`
      );
    }
  });

  test("cites by strand and number because the pages cannot be recovered", () => {
    // The design prints one numeric page marker, before the first sub-strand,
    // and none after it. A citation would read "p.1" for all sixteen.
    for (const s of subStrands) {
      assert.ok(s.suggestedLessons, `${s.name} has no suggestedLessons`);
      assert.match(
        s.sourceRef!,
        /^KICD G7 Islamic Religious Education, Strand \d+\.0, Sub-strand \d+\.\d$/,
        `${s.name}: ${s.sourceRef}`
      );
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

describe("Grade 7 assembly with both religious designs", () => {
  test("seeds each of them once and neither is still pending", () => {
    const names = grade7Data.learningAreas.map((a) => a.name);
    assert.equal(names.filter((n) => n === "Islamic Religious Education").length, 1);
    assert.equal(names.filter((n) => n === "Christian Religious Education").length, 1);
    assert.equal(names.filter((n) => n === "Religious Education").length, 0);
    assert.equal(new Set(names).size, names.length, "duplicate learning area");
  });
});
