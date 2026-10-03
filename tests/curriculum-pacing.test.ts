import { describe, test } from "node:test";
import assert from "node:assert/strict";

import {
  buildPacedLessonBatches,
  summarizePacing,
} from "../lib/curriculum/pacing";

describe("curriculum pacing", () => {
  test("reports a complete pacing comparison", () => {
    assert.deepEqual(summarizePacing([4, 6], 12), {
      availability: "complete",
      suggestedLessons: 10,
      capacity: 12,
      difference: 2,
    });
  });

  test("does not calculate a misleading difference for partial guidance", () => {
    assert.deepEqual(summarizePacing([4, null], 12), {
      availability: "partial",
      suggestedLessons: 4,
      capacity: 12,
      difference: null,
    });
  });

  test("uses each sub-strand's suggested lesson count", () => {
    const batches = buildPacedLessonBatches(
      [
        { suggestedLessons: 2, items: ["a"] },
        { suggestedLessons: 3, items: ["b", "c"] },
      ],
      10
    );

    assert.deepEqual(batches, [["a"], ["a"], ["b"], ["b"], ["c"]]);
  });

  test("combines outcomes when there are fewer lessons than outcomes", () => {
    assert.deepEqual(
      buildPacedLessonBatches(
        [{ suggestedLessons: 2, items: ["a", "b", "c", "d"] }],
        10
      ),
      [["a", "b"], ["c", "d"]]
    );
  });

  test("respects timetable capacity and falls back for incomplete guidance", () => {
    assert.equal(
      buildPacedLessonBatches([{ suggestedLessons: 5, items: ["a"] }], 3)?.length,
      3
    );
    assert.equal(
      buildPacedLessonBatches([{ suggestedLessons: null, items: ["a"] }], 3),
      null
    );
  });
});
