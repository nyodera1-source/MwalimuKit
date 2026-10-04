import { describe, test } from "node:test";
import assert from "node:assert/strict";

import {
  PILOT_GRADE_LEVEL,
  PILOT_LEARNING_AREA,
  isPilotCurriculum,
  pilotGradeWhere,
  pilotLearningAreaWhere,
  pilotSloWhere,
  pilotStrandWhere,
  pilotSubStrandWhere,
} from "../lib/curriculum/pilot";

describe("curriculum pilot", () => {
  test("publishes only Grade 7 Mathematics", () => {
    assert.equal(isPilotCurriculum(7, "Mathematics"), true);
    assert.equal(isPilotCurriculum(8, "Mathematics"), false);
    assert.equal(isPilotCurriculum(7, "Integrated Science"), false);
  });

  test("every selector query carries the pilot boundary", () => {
    assert.deepEqual(pilotGradeWhere(), { level: PILOT_GRADE_LEVEL });
    assert.deepEqual(pilotLearningAreaWhere("grade-id"), {
      gradeId: "grade-id",
      name: PILOT_LEARNING_AREA,
      grade: { level: PILOT_GRADE_LEVEL },
    });
    assert.equal(
      pilotStrandWhere("area-id").learningArea.name,
      PILOT_LEARNING_AREA
    );
    assert.equal(
      pilotSubStrandWhere("strand-id").strand.learningArea.grade.level,
      PILOT_GRADE_LEVEL
    );
    assert.equal(
      pilotSloWhere("sub-strand-id").subStrand.strand.learningArea.name,
      PILOT_LEARNING_AREA
    );
  });
});
