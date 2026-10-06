import { describe, test } from "node:test";
import assert from "node:assert/strict";

import {
  PILOT_GRADE_LEVEL,
  PILOT_LEARNING_AREAS,
  isPilotCurriculum,
  pilotGradeWhere,
  pilotLearningAreaWhere,
  pilotSloWhere,
  pilotStrandWhere,
  pilotSubStrandWhere,
} from "../lib/curriculum/pilot";

describe("curriculum pilot", () => {
  test("publishes only source-backed Grade 7 subjects", () => {
    for (const name of [
      "Mathematics", "Pre-Technical Studies", "English", "Kiswahili",
      "Integrated Science", "Social Studies", "Agriculture and Nutrition",
      "Creative Arts and Sports", "Christian Religious Education",
    ]) {
      assert.equal(isPilotCurriculum(7, name), true, name);
    }
    assert.equal(isPilotCurriculum(8, "Mathematics"), false);
    assert.equal(isPilotCurriculum(7, "Agriculture"), false);
    assert.equal(isPilotCurriculum(7, "Religious Education"), false);
  });

  test("every selector query carries the pilot boundary", () => {
    assert.deepEqual(pilotGradeWhere(), { level: PILOT_GRADE_LEVEL });
    assert.deepEqual(pilotLearningAreaWhere("grade-id"), {
      gradeId: "grade-id",
      name: { in: [...PILOT_LEARNING_AREAS] },
      grade: { level: PILOT_GRADE_LEVEL },
    });
    assert.deepEqual(
      pilotStrandWhere("area-id").learningArea.name,
      { in: [...PILOT_LEARNING_AREAS] }
    );
    assert.deepEqual(
      pilotSubStrandWhere("strand-id").strand.learningArea.grade.level,
      PILOT_GRADE_LEVEL
    );
    assert.deepEqual(
      pilotSloWhere("sub-strand-id").subStrand.strand.learningArea.name,
      { in: [...PILOT_LEARNING_AREAS] }
    );
    assert.deepEqual(pilotStrandWhere("area-id").subStrands.some.sourceRef, {
      startsWith: "KICD G7 ",
    });
    assert.deepEqual(pilotSubStrandWhere("strand-id").verification, {
      not: "superseded",
    });
    assert.deepEqual(pilotSloWhere("sub-strand-id").verification, {
      not: "superseded",
    });
  });
});
