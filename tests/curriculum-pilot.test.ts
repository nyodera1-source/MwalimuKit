import { describe, test } from "node:test";
import assert from "node:assert/strict";

import {
  AVAILABLE_AREAS_BY_GRADE,
  AVAILABLE_GRADE_LEVELS,
  isPilotCurriculum,
  pilotGradeWhere,
  pilotLearningAreaScope,
  pilotLearningAreaWhere,
  pilotSloWhere,
  pilotStrandWhere,
  pilotSubStrandWhere,
} from "../lib/curriculum/pilot";

describe("published curriculum availability", () => {
  test("publishes source-backed learning areas for Grades 7 to 10", () => {
    assert.equal(isPilotCurriculum(7, "Mathematics"), true);
    assert.equal(isPilotCurriculum(8, "English"), true);
    assert.equal(isPilotCurriculum(9, "Integrated Science"), true);
    assert.equal(isPilotCurriculum(10, "Physics"), true);

    assert.equal(isPilotCurriculum(6, "Mathematics"), false);
    assert.equal(isPilotCurriculum(8, "Physics"), false);
    assert.equal(isPilotCurriculum(8, "Agriculture and Nutrition"), false);
    assert.equal(isPilotCurriculum(8, "Creative Arts and Sports"), false);
    assert.equal(isPilotCurriculum(8, "Hindu Religious Education"), false);
    assert.equal(isPilotCurriculum(9, "German"), false);
    assert.equal(isPilotCurriculum(10, "Pre-Technical Studies"), false);
  });

  test("every published grade has an explicit learning-area allowlist", () => {
    assert.deepEqual([...AVAILABLE_GRADE_LEVELS], [7, 8, 9, 10]);
    for (const level of AVAILABLE_GRADE_LEVELS) {
      assert.ok(AVAILABLE_AREAS_BY_GRADE[level].length > 0, `Grade ${level}`);
    }
  });

  test("selector queries carry the source-backed curriculum boundary", () => {
    assert.deepEqual(pilotGradeWhere(), {
      level: { in: [7, 8, 9, 10] },
    });

    const scope = pilotLearningAreaScope();
    assert.equal(scope.OR.length, 4);
    assert.deepEqual(pilotLearningAreaWhere("grade-id"), {
      gradeId: "grade-id",
      ...scope,
    });

    assert.deepEqual(pilotStrandWhere("area-id").learningArea, scope);
    assert.deepEqual(
      pilotSubStrandWhere("strand-id").strand.learningArea,
      scope
    );
    assert.deepEqual(
      pilotSloWhere("sub-strand-id").subStrand.strand.learningArea,
      scope
    );

    assert.deepEqual(pilotStrandWhere("area-id").subStrands.some.sourceRef, {
      not: null,
    });
    assert.deepEqual(pilotSubStrandWhere("strand-id").verification, {
      not: "superseded",
    });
    assert.deepEqual(pilotSloWhere("sub-strand-id").verification, {
      not: "superseded",
    });
  });
});
