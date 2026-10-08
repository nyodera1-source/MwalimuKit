import assert from "node:assert/strict";
import test from "node:test";

import {
  GRADE_9_ARABIC_EXHIBITION_LESSONS,
  grade9ArabicData,
} from "../prisma/seed/data/grade-9-arabic";
import { grade9HinduReligiousEducationData } from "../prisma/seed/data/grade-9-hindu-religious-education";
import { grade9Data } from "../prisma/seed/data/grade-9";
import {
  isTranscribedCurriculumArea,
  TRANSCRIBED_GRADE_9_AREAS,
} from "../lib/curriculum/transcribed-curriculum";

function summarize(area: (typeof grade9Data.learningAreas)[number]) {
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);
  return {
    strands: area.strands.length,
    subStrands: subStrands.length,
    outcomes: subStrands.reduce((sum, sub) => sum + sub.slos.length, 0),
    lessons: subStrands.reduce(
      (sum, sub) => sum + (sub.suggestedLessons ?? 0),
      0
    ),
  };
}

test("Grade 9 Arabic retains the reviewed curriculum totals", () => {
  const area = grade9ArabicData.learningAreas[0];
  assert.deepEqual(summarize(area), {
    strands: 3,
    subStrands: 27,
    outcomes: 81,
    lessons: 54,
  });
  assert.equal(GRADE_9_ARABIC_EXHIBITION_LESSONS, 6);
  assert.equal(area.strands.flatMap((strand) => strand.subStrands)
    .every((sub) => sub.sourceRef?.startsWith("KICD G9 Arabic ")), true);
});

test("Grade 9 HRE retains the reviewed curriculum totals", () => {
  const area = grade9HinduReligiousEducationData.learningAreas[0];
  assert.deepEqual(summarize(area), {
    strands: 6,
    subStrands: 6,
    outcomes: 22,
    lessons: 120,
  });
  assert.equal(area.strands[3].subStrands[0].name, "Rituals and Protocols");
  assert.equal(area.strands[5].subStrands[0].name, "Sikh Sanskaars");
});

test("the Grade 9 catalogue uses the transcribed alternatives", () => {
  assert.deepEqual(
    TRANSCRIBED_GRADE_9_AREAS.map((name) =>
      grade9Data.learningAreas.filter((area) => area.name === name).length
    ),
    TRANSCRIBED_GRADE_9_AREAS.map(() => 1)
  );
  assert.equal(
    grade9Data.learningAreas.some((area) => area.name === "Religious Education"),
    false
  );
  assert.equal(isTranscribedCurriculumArea(9, "Arabic"), true);
  assert.equal(isTranscribedCurriculumArea(9, "Hindu Religious Education"), true);
});
