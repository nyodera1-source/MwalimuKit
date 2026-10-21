import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { buildLessonGuidance } from "../lib/schemes/lesson-guidance";

describe("scheme lesson guidance", () => {
  test("uses the outcome to suggest mathematics activity, resources and assessment", () => {
    const guidance = buildLessonGuidance(
      "Mathematics",
      "Whole Numbers",
      "use place value and total value of digits up to hundreds of millions in real life"
    );
    assert.match(guidance.activities, /place-value cards/);
    assert.match(guidance.resources, /place-value chart/i);
    assert.match(guidance.inquiry, /digit's position/);
    assert.match(guidance.assessment, /value of selected digits/);
  });

  test("repeated lessons progress beyond the introductory activity", () => {
    const inputs = [0, 1, 2].map((repeatIndex) =>
      buildLessonGuidance("Mathematics", "Whole Numbers", "read and write numbers in symbols", repeatIndex)
    );
    assert.equal(new Set(inputs.map((input) => input.activities)).size, 3);
    assert.match(inputs[1].assessment, /individual examples/);
    assert.match(inputs[2].assessment, /learner-created/);
  });

  test("uses topic-specific methods for factors and geometry", () => {
    const factors = buildLessonGuidance("Mathematics", "Factors", "test divisibility of numbers by 2 and 3");
    const construction = buildLessonGuidance("Mathematics", "Geometrical Constructions", "bisect angles using a ruler and a pair of compasses");
    assert.match(factors.activities, /factor trees/);
    assert.match(construction.resources, /compasses/);
    assert.match(construction.assessment, /construction marks/);
  });

  test("other subjects use their learning outcome without guessing textbook pages", () => {
    const guidance = buildLessonGuidance(
      "Pre-Technical Studies",
      "Computer Concepts",
      "classify computers in a user environment"
    );
    assert.match(guidance.activities, /Computer Concepts/);
    assert.match(guidance.assessment, /classify computers/);
    assert.doesNotMatch(JSON.stringify(guidance), /pages?\s+\d+/i);
  });

  test("suggests different activities and assessments across subject families", () => {
    const examples = [
      ["English", "Independent Reading", "read selected materials for information", /short text/, /detail from the text/],
      ["Integrated Science", "Laboratory Safety", "identify common hazards", /observe a safe example/, /observation records/],
      ["Social Studies", "Citizenship", "explain the role of citizens", /map, source or local case/, /source or case/],
      ["Creative Arts and Sports", "Drawing", "create a drawing", /practise the relevant skill/, /simple checklist/],
      ["Christian Religious Education", "Respect", "explain the importance of respect", /story, teaching or situation/, /reasoned response/],
    ] as const;
    for (const [subject, topic, outcome, activity, assessment] of examples) {
      const guidance = buildLessonGuidance(subject, topic, outcome);
      assert.match(guidance.activities, activity, subject);
      assert.match(guidance.assessment, assessment, subject);
      assert.ok(guidance.resources.length > 0, subject);
      assert.ok(guidance.inquiry.endsWith("?"), subject);
    }
  });

  test("repeated lessons progress for non-mathematics subjects too", () => {
    const activities = [0, 1, 2].map((repeatIndex) =>
      buildLessonGuidance("Integrated Science", "Laboratory Safety", "identify common hazards", repeatIndex).activities
    );
    assert.equal(new Set(activities).size, 3);
  });

  test("biology lessons use topic-specific practical guidance", () => {
    const nutrition = buildLessonGuidance(
      "Biology",
      "Nutrition",
      "describe types of nutrition in plants",
      0
    );
    assert.match(nutrition.activities, /leaf and chloroplast/i);
    assert.match(nutrition.resources, /fresh leaf|plant specimen/i);
    assert.match(nutrition.inquiry, /adapted for making food/i);
    assert.match(nutrition.assessment, /labelled diagrams/i);

    const transport = buildLessonGuidance(
      "Biology",
      "Transport",
      "relate the structure of xylem and phloem to transport",
      1
    );
    assert.match(transport.activities, /coloured water/i);
    assert.match(transport.resources, /vascular-tissue charts/i);
    assert.match(transport.assessment, /observation record/i);
  });

  test("biology repeated lessons move from explanation to investigation to application", () => {
    const lessons = [0, 1, 2].map((repeatIndex) =>
      buildLessonGuidance(
        "Biology",
        "Gaseous Exchange and Respiration",
        "investigate aerobic and anaerobic respiration in living organisms",
        repeatIndex
      )
    );
    assert.equal(new Set(lessons.map((lesson) => lesson.activities)).size, 3);
    assert.match(lessons[1].activities, /microscope|germinating seeds/i);
    assert.match(lessons[2].activities, /compare aerobic and anaerobic/i);
  });
});
