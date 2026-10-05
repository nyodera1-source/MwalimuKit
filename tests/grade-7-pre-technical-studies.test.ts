import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { grade7PreTechnicalStudiesData } from "../prisma/seed/data/grade-7-pre-technical-studies";
import { grade7Data } from "../prisma/seed/data/grade-7";

const area = grade7PreTechnicalStudiesData.learningAreas[0];
const strands = area.strands;
const subStrands = strands.flatMap((strand) => strand.subStrands);

describe("transcribed Grade 7 Pre-Technical Studies", () => {
  test("uses the five published strands", () => {
    assert.deepEqual(
      strands.map((strand) => strand.name),
      [
        "Foundations of Pre-Technical Studies",
        "Communication",
        "Materials for Production",
        "Tools and Production",
        "Entrepreneurship",
      ]
    );
  });

  test("has 14 sub-strands totalling 120 suggested lessons", () => {
    assert.equal(subStrands.length, 14);
    assert.equal(
      subStrands.reduce((total, subStrand) => total + (subStrand.suggestedLessons ?? 0), 0),
      120
    );
  });

  test("every sub-strand has outcomes, a citation and review status", () => {
    for (const subStrand of subStrands) {
      assert.ok(subStrand.slos.length > 0, `${subStrand.name} has no outcomes`);
      assert.ok(subStrand.sourceRef, `${subStrand.name} has no citation`);
      assert.match(subStrand.sourceRef!, /KICD G7 Pre-Technical Studies/);
      assert.equal(subStrand.verification, "unverified");
    }
  });

  test("replaces the old hand-written placeholder in Grade 7", () => {
    const assembled = grade7Data.learningAreas.filter(
      (learningArea) => learningArea.name === "Pre-Technical Studies"
    );
    assert.equal(assembled.length, 1);
    assert.equal(assembled[0].strands.length, 5);
  });
});
