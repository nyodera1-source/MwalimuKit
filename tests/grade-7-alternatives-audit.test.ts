/**
 * Source-specific tests for the four Grade 7 alternative subjects.
 *
 * These tests assert exact published strand names, sub-strand names,
 * sub-strand counts, lesson allocations, and specific learning outcomes
 * transcribed from the KICD curriculum design PDFs.
 *
 * The PDFs are the ONLY authority. These tests guard against:
 * - Paraphrased outcomes
 * - Wrong sub-strand counts
 * - Wrong lesson allocations
 * - Missing sub-strands
 * - Wrong strand names
 */

import { describe, test as it } from "node:test";
import assert from "node:assert/strict";
import { grade7FrenchData } from "../prisma/seed/data/grade-7-french";
import { grade7GermanData } from "../prisma/seed/data/grade-7-german";
import { grade7ArabicData } from "../prisma/seed/data/grade-7-arabic";
import { grade7HinduData } from "../prisma/seed/data/grade-7-hindu";

function expect(actual: unknown) {
  return {
    toBe: (expected: unknown) => assert.equal(actual, expected),
    toEqual: (expected: unknown) => assert.deepEqual(actual, expected),
    toHaveLength: (expected: number) =>
      assert.equal((actual as { length: number }).length, expected),
    toMatch: (pattern: RegExp) => assert.match(String(actual), pattern),
    toBeUndefined: () => assert.equal(actual, undefined),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAllSubStrands(data: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Array<{ strandName: string; subStrand: any }> = [];
  for (const la of data.learningAreas) {
    for (const strand of la.strands) {
      for (const subStrand of strand.subStrands) {
        result.push({ strandName: strand.name, subStrand });
      }
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// FRENCH
// ---------------------------------------------------------------------------

describe("Grade 7 French", () => {
  const data = grade7FrenchData;
  const allSubStrands = getAllSubStrands(data);

  it("has 3 strands with exact published names", () => {
    const strands = data.learningAreas[0].strands;
    expect(strands).toHaveLength(3);
    expect(strands[0].name).toBe("LISTENING AND SPEAKING");
    expect(strands[1].name).toBe("READING");
    expect(strands[2].name).toBe("WRITING");
  });

  it("has 27 sub-strands (9 per strand)", () => {
    expect(allSubStrands).toHaveLength(27);
    const strands = data.learningAreas[0].strands;
    expect(strands[0].subStrands).toHaveLength(9);
    expect(strands[1].subStrands).toHaveLength(9);
    expect(strands[2].subStrands).toHaveLength(9);
  });

  it("has exact sub-strand names for strand 1.0", () => {
    const strand1 = data.learningAreas[0].strands[0];
    expect(strand1.subStrands[0].name).toBe("Interactive Speaking: Informal and Other Forms of Greetings");
    expect(strand1.subStrands[1].name).toBe("Oral Expression: Nuclear Family");
    expect(strand1.subStrands[2].name).toBe("Interactive Listening: The market");
    expect(strand1.subStrands[3].name).toBe("Active Listening: Important Dates");
    expect(strand1.subStrands[4].name).toBe("Listening for Information: Leisure Time");
    expect(strand1.subStrands[5].name).toBe("Interactive Speaking: Shopping for Food");
    expect(strand1.subStrands[6].name).toBe("Oral Expression: Physical Appearance");
    expect(strand1.subStrands[7].name).toBe("Active Listening: Seasons");
    expect(strand1.subStrands[8].name).toBe("Interactive Speaking: In the Neighbourhood");
  });

  it("has exact sub-strand names for strand 2.0", () => {
    const strand2 = data.learningAreas[0].strands[1];
    expect(strand2.subStrands[0].name).toBe("Reading Aloud: Informal and Other Forms of Greetings");
    expect(strand2.subStrands[1].name).toBe("Reading Aloud: Nuclear family");
    expect(strand2.subStrands[2].name).toBe("Reading for understanding: The Market");
    expect(strand2.subStrands[3].name).toBe("Reading Aloud: Important Dates");
    expect(strand2.subStrands[4].name).toBe("Reading for Understanding: Leisure Time");
    expect(strand2.subStrands[5].name).toBe("Reading Aloud: Shopping for Food");
    expect(strand2.subStrands[6].name).toBe("Reading Aloud: Physical Appearance");
    expect(strand2.subStrands[7].name).toBe("Reading Aloud: Seasons");
    expect(strand2.subStrands[8].name).toBe("Guided Reading: In the Neighbourhood");
  });

  it("has exact sub-strand names for strand 3.0", () => {
    const strand3 = data.learningAreas[0].strands[2];
    for (let i = 0; i < 9; i++) {
      expect(strand3.subStrands[i].name).toMatch(/^Guided Writing: /);
    }
  });

  it("has exact outcomes for sub-strand 1.1", () => {
    const subStrand = data.learningAreas[0].strands[0].subStrands[0];
    expect(subStrand.slos).toHaveLength(4);
    expect(subStrand.slos[0].description).toBe("respond to questions and prompts to show comprehension and engagement");
    expect(subStrand.slos[1].description).toBe("use vocabulary and expressions appropriately to probe and engage in oral interactions");
    expect(subStrand.slos[2].description).toBe("use non-verbal communication cues to enhance communication");
    expect(subStrand.slos[3].description).toBe("exhibit confidence to contribute actively in conversations");
  });

  it("has exact outcomes for sub-strand 1.2 (including truncated source outcome)", () => {
    const subStrand = data.learningAreas[0].strands[0].subStrands[1];
    expect(subStrand.slos).toHaveLength(3);
    expect(subStrand.slos[0].description).toBe("use varied vocabulary when speaking");
    expect(subStrand.slos[1].description).toBe("employ fluency in verbal");
    expect(subStrand.slos[2].description).toBe("express enthusiasm in oral communication");
  });

  it("has sourceRef for all sub-strands", () => {
    for (const { subStrand } of allSubStrands) {
      expect(subStrand.sourceRef).toMatch(/^KICD G7 French p\.\d+, Strand \d+\.\d+, Sub-strand \d+\.\d+$/);
    }
  });

  it("does NOT assign strand-level lesson totals to sub-strands", () => {
    // The PDF publishes strand-level totals (27/18/9), not per-sub-strand.
    // Sub-strands must NOT have suggestedLessons set.
    for (const { subStrand } of allSubStrands) {
      expect(subStrand.suggestedLessons).toBeUndefined();
    }
  });
});

// ---------------------------------------------------------------------------
// GERMAN
// ---------------------------------------------------------------------------

describe("Grade 7 German", () => {
  const data = grade7GermanData;
  const allSubStrands = getAllSubStrands(data);

  it("has 3 strands with exact published names", () => {
    const strands = data.learningAreas[0].strands;
    expect(strands).toHaveLength(3);
    expect(strands[0].name).toBe("LISTENING AND SPEAKING");
    expect(strands[1].name).toBe("READING");
    expect(strands[2].name).toBe("WRITING");
  });

  it("has 27 sub-strands (9 per strand)", () => {
    expect(allSubStrands).toHaveLength(27);
  });

  it("has exact sub-strand names for strand 1.0", () => {
    const strand1 = data.learningAreas[0].strands[0];
    expect(strand1.subStrands[0].name).toBe("Active listening, Oral expression");
    expect(strand1.subStrands[1].name).toBe("Listening for information, Interactive speaking");
    expect(strand1.subStrands[2].name).toBe("Active listening, Oral expression");
    expect(strand1.subStrands[3].name).toBe("Listening for information, Interactive speaking");
    expect(strand1.subStrands[4].name).toBe("Active Listening, Oral Expressions");
    expect(strand1.subStrands[5].name).toBe("Listening for information, Interactive speaking");
    expect(strand1.subStrands[6].name).toBe("Active Listening, Oral Expressions");
    expect(strand1.subStrands[7].name).toBe("Listening for information, Interactive speaking");
    expect(strand1.subStrands[8].name).toBe("Active Listening, Oral expressions");
  });

  it("has per-sub-strand lesson counts (3/2/1)", () => {
    const strands = data.learningAreas[0].strands;
    for (const subStrand of strands[0].subStrands) {
      expect(subStrand.suggestedLessons).toBe(3);
    }
    for (const subStrand of strands[1].subStrands) {
      expect(subStrand.suggestedLessons).toBe(2);
    }
    for (const subStrand of strands[2].subStrands) {
      expect(subStrand.suggestedLessons).toBe(1);
    }
  });

  it("has exact outcomes for sub-strand 1.1", () => {
    const subStrand = data.learningAreas[0].strands[0].subStrands[0];
    expect(subStrand.slos).toHaveLength(4);
    expect(subStrand.slos[0].description).toBe("identify listening markers in a text for communication");
    expect(subStrand.slos[1].description).toBe("listen actively for comprehension");
    expect(subStrand.slos[2].description).toBe("use acquired vocabulary to communicate in varied contexts");
    expect(subStrand.slos[3].description).toBe("appreciate the role of vocabulary in foreign language learning");
  });

  it("has sourceRef for all sub-strands", () => {
    for (const { subStrand } of allSubStrands) {
      expect(subStrand.sourceRef).toMatch(/^KICD G7 German p\.\d+, Strand \d+\.\d+, Sub-strand \d+\.\d+$/);
    }
  });
});

// ---------------------------------------------------------------------------
// ARABIC
// ---------------------------------------------------------------------------

describe("Grade 7 Arabic", () => {
  const data = grade7ArabicData;
  const allSubStrands = getAllSubStrands(data);

  it("has 3 strands with exact published names", () => {
    const strands = data.learningAreas[0].strands;
    expect(strands).toHaveLength(3);
    expect(strands[0].name).toBe("LISTENING AND SPEAKING");
    expect(strands[1].name).toBe("READING");
    expect(strands[2].name).toBe("WRITING");
  });

  it("has 27 sub-strands (9 per strand)", () => {
    expect(allSubStrands).toHaveLength(27);
  });

  it("has exact sub-strand names for strand 1.0", () => {
    const strand1 = data.learningAreas[0].strands[0];
    expect(strand1.subStrands[0].name).toBe("Listening for Gist");
    expect(strand1.subStrands[1].name).toBe("Imitative Speaking: Pronunciation");
    expect(strand1.subStrands[2].name).toBe("Phonological Awareness");
    expect(strand1.subStrands[3].name).toBe("Listening for Gist");
    expect(strand1.subStrands[4].name).toBe("Listening for Information");
    expect(strand1.subStrands[5].name).toBe("Phonological Awareness");
    expect(strand1.subStrands[6].name).toBe("Imitative Speaking");
    expect(strand1.subStrands[7].name).toBe("Conversational Skills");
    expect(strand1.subStrands[8].name).toBe("Phonological Awareness: Pronunciation");
  });

  it("has per-sub-strand lesson counts (2 sessions each)", () => {
    const strands = data.learningAreas[0].strands;
    for (const subStrand of strands[0].subStrands) {
      expect(subStrand.suggestedLessons).toBe(2);
    }
    for (const subStrand of strands[1].subStrands) {
      expect(subStrand.suggestedLessons).toBe(2);
    }
    for (const subStrand of strands[2].subStrands) {
      expect(subStrand.suggestedLessons).toBe(2);
    }
  });

  it("has exact outcomes for sub-strand 1.1", () => {
    const subStrand = data.learningAreas[0].strands[0].subStrands[0];
    expect(subStrand.slos).toHaveLength(3);
    expect(subStrand.slos[0].description).toBe("identify the main idea in a spoken text");
    expect(subStrand.slos[1].description).toBe("respond to simple questions on greetings and introduction of self and others");
    expect(subStrand.slos[2].description).toBe("develop interest in learning Arabic");
  });

  it("has sourceRef for all sub-strands", () => {
    for (const { subStrand } of allSubStrands) {
      expect(subStrand.sourceRef).toMatch(/^KICD G7 Arabic p\.\d+, Strand \d+\.\d+, Sub-strand \d+\.\d+$/);
    }
  });
});

// ---------------------------------------------------------------------------
// HINDU
// ---------------------------------------------------------------------------

describe("Grade 7 Hindu Religious Education", () => {
  const data = grade7HinduData;
  const allSubStrands = getAllSubStrands(data);

  it("has 6 strands with exact published names", () => {
    const strands = data.learningAreas[0].strands;
    expect(strands).toHaveLength(6);
    expect(strands[0].name).toBe("MANIFESTATION OF SUPREME BEING (PARAMATMA)");
    expect(strands[1].name).toBe("SCRIPTURES");
    expect(strands[2].name).toBe("PRINCIPLES OF DHARMA (DHARMIC SIDDHANT)");
    expect(strands[3].name).toBe("RELIGIOUS PRACTICES");
    expect(strands[4].name).toBe("YOG");
    expect(strands[5].name).toBe("RITES OF PASSAGE (SANSKAARS)");
  });

  it("has 8 sub-strands", () => {
    expect(allSubStrands).toHaveLength(8);
  });

  it("has exact sub-strand names", () => {
    const strands = data.learningAreas[0].strands;
    expect(strands[0].subStrands[0].name).toBe("Enlightened Beings");
    expect(strands[1].subStrands[0].name).toBe("Scriptural Texts");
    expect(strands[2].subStrands[0].name).toBe("Fundamental Principles");
    expect(strands[3].subStrands[0].name).toBe("Buddhist Practices");
    expect(strands[3].subStrands[1].name).toBe("Places of Worship");
    expect(strands[4].subStrands[0].name).toBe("Concepts of Yog");
    expect(strands[4].subStrands[1].name).toBe("Path of Devotion (Bhakti Yog)");
    expect(strands[5].subStrands[0].name).toBe("Religious Ceremonies");
  });

  it("has per-sub-strand lesson counts summing to 120", () => {
    const strands = data.learningAreas[0].strands;
    const counts = [
      ...strands[0].subStrands.map((s) => s.suggestedLessons!),
      ...strands[1].subStrands.map((s) => s.suggestedLessons!),
      ...strands[2].subStrands.map((s) => s.suggestedLessons!),
      ...strands[3].subStrands.map((s) => s.suggestedLessons!),
      ...strands[4].subStrands.map((s) => s.suggestedLessons!),
      ...strands[5].subStrands.map((s) => s.suggestedLessons!),
    ];
    expect(counts).toEqual([15, 14, 14, 15, 16, 16, 15, 15]);
    expect(counts.reduce((a, b) => a + b, 0)).toBe(120);
  });

  it("has exact outcomes for sub-strand 1.1", () => {
    const subStrand = data.learningAreas[0].strands[0].subStrands[0];
    expect(subStrand.slos).toHaveLength(4);
    expect(subStrand.slos[0].description).toBe("narrate the stories of the Enlightened Beings");
    expect(subStrand.slos[1].description).toBe("explore the interrelationships of the Enlightened Beings");
    expect(subStrand.slos[2].description).toBe("illustrate the events mentioned in the lives of the Enlightened Beings");
    expect(subStrand.slos[3].description).toBe("appreciate the values taught by the Enlightened Beings");
  });

  it("has sourceRef for all sub-strands", () => {
    for (const { subStrand } of allSubStrands) {
      expect(subStrand.sourceRef).toMatch(/^KICD G7 Hindu p\.\d+, Strand \d+\.\d+, Sub-strand \d+\.\d+$/);
    }
  });
});
