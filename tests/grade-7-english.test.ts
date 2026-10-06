/**
 * Regression guard for the transcribed Grade 7 English curriculum.
 *
 * English is published at three levels — theme (1.0), skill strand (1.1) and
 * unit (1.1.1). The middle level repeats across all fifteen themes, so per
 * option B it lives on subStrands.skillStrand rather than as a Strand.
 *
 * The figures below are the ones published by the KICD design. They matter to
 * the Phase 4 pacing engine: if a future refactor drops a theme or a unit, the
 * coverage checker would quietly produce short schemes.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { grade7EnglishData } from "../prisma/seed/data/grade-7-english";
import { grade7Data } from "../prisma/seed/data/grade-7";

const themes = grade7EnglishData.learningAreas[0].strands;
const units = themes.flatMap((t) => t.subStrands);

describe("transcribed Grade 7 English", () => {
  test("has 15 themes, 61 units and 116 published lessons", () => {
    assert.equal(themes.length, 15);
    assert.equal(units.length, 61);
    assert.equal(units.reduce((n, u) => n + (u.suggestedLessons ?? 0), 0), 116);
  });

  test("theme order is contiguous from 1", () => {
    themes.forEach((t, i) => assert.equal(t.order, i + 1, `${t.name} order`));
  });

  test("covers the KICD theme list including the dashed theme 7", () => {
    const names = themes.map((t) => t.name.toUpperCase());
    // Theme 7 contains an en dash; an earlier regex class dropped it and the
    // whole theme vanished with no error.
    assert.ok(
      names.some((n) => n.includes("NATURAL RESOURCES")),
      "theme 7 missing"
    );
    assert.equal(themes.length, 15);
  });

  test("every unit carries a lesson count, skill strand and page citation", () => {
    for (const u of units) {
      assert.ok(u.suggestedLessons, `${u.name} has no suggestedLessons`);
      assert.ok(u.skillStrand, `${u.name} has no skillStrand`);
      assert.ok(u.sourceRef, `${u.name} has no sourceRef`);
      assert.match(u.sourceRef!, /p\.\d+/, `${u.name} citation lacks a page`);
    }
  });

  test("skill strands are drawn from the KICD set", () => {
    const distinct = new Set(units.map((u) => u.skillStrand));
    for (const s of distinct) {
      assert.match(
        s!,
        /^(Listening and Speaking|Reading|Grammar in Use|Grammar In Use|Writing|Grammar|Listening)$/,
        `unexpected skill strand: ${s}`
      );
    }
    // KICD varies the capitalisation between themes; canonicalise so grouping
    // in the UI is not split across two buckets.
    const lowered = new Set([...distinct].map((s) => s!.toLowerCase()));
    assert.ok(lowered.has("grammar in use"), "grammar in use should be present");
  });

  test("units do not absorb learning-experience text", () => {
    const SUS = /guided to|suggested learning|key inquiry|core competencies|pertinent and contemporary/i;
    for (const u of units) {
      assert.ok(u.slos.length > 0, `${u.name} has no outcomes`);
      for (const o of u.slos) {
        assert.ok(!SUS.test(o.description), `${u.name}: contaminated "${o.description}"`);
        assert.ok(o.description.trim().length >= 15, `${u.name}: outcome too short`);
        assert.ok(!/[,;]$/.test(o.description), `${u.name}: list separator retained`);
      }
    }
  });

  test("nothing is marked verified before teacher review", () => {
    for (const u of units) assert.equal(u.verification, "unverified", u.name);
  });

  test("cognitiveLevel falls back to apply because the design publishes none", () => {
    const levels = new Set(units.flatMap((u) => u.slos.map((o) => o.cognitiveLevel)));
    assert.deepEqual([...levels], ["apply"]);
  });
});

describe("Grade 7 assembly", () => {
  test("transcribed subjects are present exactly once", () => {
    const names = grade7Data.learningAreas.map((a) => a.name);
    assert.equal(names.filter((n) => n === "English").length, 1);
    assert.equal(names.filter((n) => n === "Mathematics").length, 1);
    assert.equal(names.filter((n) => n === "Pre-Technical Studies").length, 1);
    assert.equal(new Set(names).size, names.length, "duplicate learning area");
    assert.equal(grade7Data.learningAreas.length, 14);
  });
});
