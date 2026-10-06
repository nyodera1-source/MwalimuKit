import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  matchesTranscribedGrade7,
  transcribedGrade7Areas,
  TRANSCRIBED_GRADE_7_AREAS,
  type StoredTranscribedArea,
} from "../lib/curriculum/transcribed-grade-7";
import { grade7Data } from "../prisma/seed/data/grade-7";

function storedCurriculum(): StoredTranscribedArea[] {
  return transcribedGrade7Areas.map((area) => ({
    name: area.name,
    strands: area.strands.map((strand) => ({
      name: strand.name,
      order: strand.order,
      subStrands: strand.subStrands.map((sub) => ({
        name: sub.name,
        order: sub.order,
        verification: "unverified",
        suggestedLessons: sub.suggestedLessons ?? null,
        sourceRef: sub.sourceRef ?? null,
        skillStrand: sub.skillStrand ?? null,
        slos: sub.slos.map((slo, index) => ({
          description: slo.description,
          order: index + 1,
          verification: "unverified",
        })),
      })),
    })),
  }));
}

describe("transcribed Grade 7 curriculum", () => {
  test("includes source-backed subjects and excludes placeholders", () => {
    assert.equal(TRANSCRIBED_GRADE_7_AREAS.length, 14);
    assert.ok(TRANSCRIBED_GRADE_7_AREAS.includes("Social Studies"));
    assert.ok(TRANSCRIBED_GRADE_7_AREAS.includes("Agriculture and Nutrition"));
    assert.ok(TRANSCRIBED_GRADE_7_AREAS.includes("Christian Religious Education"));
    assert.ok(!TRANSCRIBED_GRADE_7_AREAS.includes("Religious Education"));
    for (const name of ["French", "Arabic", "Hindu Religious Education", "German"]) {
      assert.ok(TRANSCRIBED_GRADE_7_AREAS.includes(name), `${name} is available`);
    }
  });

  test("distinguishes repeated published titles without losing their wording", () => {
    for (const name of ["Arabic", "German"]) {
      const area = grade7Data.learningAreas.find((item) => item.name === name)!;
      for (const strand of area.strands) {
        const titles = strand.subStrands.map((sub) => sub.name);
        assert.equal(new Set(titles).size, titles.length, `${name}: ${strand.name}`);
      }
    }
    const arabic = grade7Data.learningAreas.find((area) => area.name === "Arabic")!;
    assert.ok(arabic.strands[0].subStrands.some((sub) => sub.name === "Listening for Gist (1.1)"));
    assert.ok(arabic.strands[0].subStrands.some((sub) => sub.name === "Listening for Gist (1.4)"));
  });

  test("detects changed names, pacing and outcomes", () => {
    const current = storedCurriculum();
    assert.equal(matchesTranscribedGrade7(current), true);
    current[0].strands[0].name = "Old strand";
    assert.equal(matchesTranscribedGrade7(current), false);

    const changedPacing = storedCurriculum();
    changedPacing[0].strands[0].subStrands[0].suggestedLessons = 999;
    assert.equal(matchesTranscribedGrade7(changedPacing), false);

    const changedOutcome = storedCurriculum();
    changedOutcome[0].strands[0].subStrands[0].slos[0].description = "Old outcome";
    assert.equal(matchesTranscribedGrade7(changedOutcome), false);
  });

  test("ignores superseded rows retained for existing documents", () => {
    const current = storedCurriculum();
    current[0].strands[0].subStrands.push({
      name: "Old topic",
      order: 100,
      verification: "superseded",
      suggestedLessons: null,
      sourceRef: null,
      skillStrand: null,
      slos: [],
    });
    current[0].strands[0].subStrands[0].slos.push({
      description: "Old outcome",
      order: 100,
      verification: "superseded",
    });
    assert.equal(matchesTranscribedGrade7(current), true);
  });
});
