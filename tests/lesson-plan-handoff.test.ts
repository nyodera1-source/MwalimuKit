import { describe, test } from "node:test";
import assert from "node:assert/strict";

import type { SchemeConfig } from "../lib/export/scheme-of-work-types";
import { getLessonPlanHandoff } from "../lib/schemes/lesson-plan-handoff";

const config = {
  entries: [
    {
      week: 2,
      lesson: "3",
      topic: "Numbers",
      subTopic: "Whole Numbers",
      objectives: "Use place value in real life.",
      tlActivities: "Group place-value exercise.",
      tlAids: "Textbook, place-value chart",
      reference: "Mathematics Grade 7",
      remarks: "",
      strandId: "strand-1",
      subStrandId: "sub-1",
      sloIds: ["slo-1", "slo-1", "slo-2"],
    },
  ],
} as SchemeConfig;

describe("scheme to lesson-plan handoff", () => {
  test("prefills curriculum and lesson content from a scheme row", () => {
    assert.deepEqual(getLessonPlanHandoff(config, 0), {
      title: "Whole Numbers - Week 2, Lesson 3",
      strandId: "strand-1",
      subStrandId: "sub-1",
      sloIds: ["slo-1", "slo-2"],
      content: {
        objectives: "Use place value in real life.",
        resources: "Textbook, place-value chart",
        activities: { development: "Group place-value exercise." },
      },
    });
  });

  test("rejects invalid indexes and legacy rows without curriculum ids", () => {
    assert.equal(getLessonPlanHandoff(null, 0), null);
    assert.equal(getLessonPlanHandoff(config, -1), null);
    assert.equal(getLessonPlanHandoff(config, 1), null);
    assert.equal(
      getLessonPlanHandoff(
        { ...config, entries: [{ ...config.entries[0], sloIds: undefined }] },
        0
      ),
      null
    );
  });
});
