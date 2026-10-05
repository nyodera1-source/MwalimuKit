/**
 * Regression guard for the transcribed Grade 7 Kiswahili curriculum.
 *
 * Kiswahili uses the same three-level design as English but labels everything in
 * Swahili: mada, mada ndogo, unit, with the lesson count published as
 * "Vipindi" rather than "lessons".
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { grade7KiswahiliData } from "../prisma/seed/data/grade-7-kiswahili";
import { grade7Data } from "../prisma/seed/data/grade-7";

const mada = grade7KiswahiliData.learningAreas[0].strands;
const units = mada.flatMap((m) => m.subStrands);

describe("transcribed Grade 7 Kiswahili", () => {
  test("has 15 mada, 59 units and 118 published periods", () => {
    assert.equal(mada.length, 15);
    assert.equal(units.length, 59);
    assert.equal(units.reduce((n, u) => n + (u.suggestedLessons ?? 0), 0), 118);
  });

  test("mada order is contiguous from 1", () => {
    mada.forEach((m, i) => assert.equal(m.order, i + 1, `${m.name} order`));
  });

  test("includes mada 2, published as LISHE B0RA with a zero", () => {
    // The design types a zero rather than a letter O. An earlier character
    // class excluded digits and dropped this mada entirely, silently.
    const two = mada.find((m) => m.order === 2);
    assert.ok(two, "mada 2 missing");
    assert.equal(two!.name, "LISHE B0RA");
    assert.equal(mada.length, 15);
  });

  test("every unit carries a period count, mada ndogo and a citation", () => {
    for (const u of units) {
      assert.ok(u.suggestedLessons, `${u.name} has no suggestedLessons`);
      assert.ok(u.skillStrand, `${u.name} has no skillStrand`);
      assert.ok(u.sourceRef, `${u.name} has no sourceRef`);
      assert.match(u.sourceRef!, /Mada \d+\.0, Unit \d+\.\d+\.\d/, `${u.name} citation`);
    }
  });

  test("skill strands are the four KICD mada ndogo", () => {
    const distinct = new Set(units.map((u) => u.skillStrand));
    assert.deepEqual([...distinct].sort(), [
      "Kuandika",
      "Kusikiliza na Kuzungumza",
      "Kusoma",
      "Sarufi",
    ]);
  });

  test("outcomes are Swahili and free of learning-experience text", () => {
    const SUS = /mwanafunzi aelekezwe|shughuli za ujifunzaji|maswali dadisi|zozi za ziada/i;
    // Column headers that recur on every page and get swept up as outcomes.
    const HEADERS = new Set(["kujibu maswali", "maigizo", "mijadala", "mazungumzo", "ufafanuzi"]);
    for (const u of units) {
      assert.ok(u.slos.length > 0, `${u.name} has no outcomes`);
      for (const o of u.slos) {
        assert.ok(!SUS.test(o.description), `${u.name}: contaminated "${o.description}"`);
        assert.ok(
          !HEADERS.has(o.description.trim().toLowerCase()),
          `${u.name}: table header stored as an outcome`
        );
        assert.ok(o.description.trim().length >= 12, `${u.name}: outcome too short`);
      }
    }
  });

  test("nothing is marked verified before teacher review", () => {
    for (const u of units) assert.equal(u.verification, "unverified", u.name);
  });
});

describe("Grade 7 assembly", () => {
  test("four subjects are transcribed and each appears once", () => {
    const names = grade7Data.learningAreas.map((a) => a.name);
    for (const n of ["Mathematics", "English", "Kiswahili", "Pre-Technical Studies"]) {
      assert.equal(names.filter((x) => x === n).length, 1, `${n} count`);
    }
    assert.equal(new Set(names).size, names.length, "duplicate learning area");
    assert.equal(grade7Data.learningAreas.length, 10);
  });
});