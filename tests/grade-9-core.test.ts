import assert from "node:assert/strict";
import test from "node:test";
import { isTranscribedCurriculumArea } from "../lib/curriculum/transcribed-curriculum";
import {
  GRADE_9_AGRICULTURE_DETAILED_LESSON_TOTAL,
  GRADE_9_AGRICULTURE_NAMING_DISCREPANCIES,
  grade9AgricultureAndNutritionData,
} from "../prisma/seed/data/grade-9-agriculture-and-nutrition";
import {
  GRADE_9_CRE_LESSON_TOTAL,
  GRADE_9_CRE_STRAND_NAME_DISCREPANCIES,
  grade9ChristianReligiousEducationData,
} from "../prisma/seed/data/grade-9-christian-religious-education";
import {
  GRADE_9_CREATIVE_ARTS_DETAILED_CORE_TOTAL,
  GRADE_9_CREATIVE_ARTS_LESSON_DISCREPANCIES,
  GRADE_9_CREATIVE_ARTS_ONE_OPTIONAL_TOTAL,
  GRADE_9_CREATIVE_ARTS_STORED_LESSON_TOTAL,
  GRADE_9_CREATIVE_ARTS_SUMMARY_CORE_TOTAL,
  grade9CreativeArtsAndSportsData,
} from "../prisma/seed/data/grade-9-creative-arts-and-sports";
import { grade9EnglishData } from "../prisma/seed/data/grade-9-english";
import {
  GRADE_9_FRENCH_DETAILED_LESSON_TOTAL,
  GRADE_9_FRENCH_SUMMARY_DISCREPANCIES,
  grade9FrenchData,
} from "../prisma/seed/data/grade-9-french";
import {
  GRADE_9_INTEGRATED_SCIENCE_LESSON_TOTAL,
  GRADE_9_INTEGRATED_SCIENCE_NORMALIZED_EXTRACTION_ARTIFACTS,
  grade9IntegratedScienceData,
} from "../prisma/seed/data/grade-9-integrated-science";
import {
  GRADE_9_IRE_EXTRACTION_NORMALIZATIONS,
  GRADE_9_IRE_LESSON_TOTAL,
  GRADE_9_IRE_NUMBERING_DISCREPANCIES,
  grade9IslamicReligiousEducationData,
} from "../prisma/seed/data/grade-9-islamic-religious-education";
import { grade9KiswahiliData } from "../prisma/seed/data/grade-9-kiswahili";
import { grade9MathematicsData } from "../prisma/seed/data/grade-9-mathematics";
import {
  GRADE_9_PRE_TECHNICAL_DETAILED_LESSON_TOTAL,
  GRADE_9_PRE_TECHNICAL_NUMBERING_DISCREPANCIES,
  grade9PreTechnicalStudiesData,
} from "../prisma/seed/data/grade-9-pre-technical-studies";
import {
  GRADE_9_SOCIAL_STUDIES_DETAILED_LESSON_TOTAL,
  GRADE_9_SOCIAL_STUDIES_LESSON_DISCREPANCIES,
  grade9SocialStudiesData,
} from "../prisma/seed/data/grade-9-social-studies";
import { grade9Data } from "../prisma/seed/data/grade-9";
import type { GradeData } from "../prisma/seed/data";

function summarize(data: GradeData) {
  const area = data.learningAreas[0];
  const subStrands = area.strands.flatMap((strand) => strand.subStrands);
  return {
    strands: area.strands.length,
    subStrands: subStrands.length,
    outcomes: subStrands.reduce((sum, sub) => sum + sub.slos.length, 0),
    lessons: subStrands.reduce(
      (sum, sub) => sum + (sub.suggestedLessons ?? 0),
      0
    ),
    unspecifiedLessons: subStrands.filter(
      (sub) => sub.suggestedLessons === undefined
    ).length,
  };
}

const cases: Array<{
  name: string;
  data: GradeData;
  expected: ReturnType<typeof summarize>;
}> = [
  {
    name: "Mathematics",
    data: grade9MathematicsData,
    expected: {
      strands: 5,
      subStrands: 19,
      outcomes: 119,
      lessons: 155,
      unspecifiedLessons: 0,
    },
  },
  {
    name: "English",
    data: grade9EnglishData,
    expected: {
      strands: 15,
      subStrands: 75,
      outcomes: 251,
      lessons: 144,
      unspecifiedLessons: 3,
    },
  },
  {
    name: "Kiswahili",
    data: grade9KiswahiliData,
    expected: {
      strands: 15,
      subStrands: 60,
      outcomes: 250,
      lessons: 120,
      unspecifiedLessons: 0,
    },
  },
  {
    name: "Social Studies",
    data: grade9SocialStudiesData,
    expected: {
      strands: 5,
      subStrands: 18,
      outcomes: 86,
      lessons: 120,
      unspecifiedLessons: 0,
    },
  },
  {
    name: "Creative Arts and Sports",
    data: grade9CreativeArtsAndSportsData,
    expected: {
      strands: 3,
      subStrands: 15,
      outcomes: 67,
      lessons: 142,
      unspecifiedLessons: 0,
    },
  },
  {
    name: "Pre-Technical Studies",
    data: grade9PreTechnicalStudiesData,
    expected: {
      strands: 5,
      subStrands: 14,
      outcomes: 58,
      lessons: 120,
      unspecifiedLessons: 0,
    },
  },
  {
    name: "Agriculture and Nutrition",
    data: grade9AgricultureAndNutritionData,
    expected: {
      strands: 4,
      subStrands: 10,
      outcomes: 33,
      lessons: 120,
      unspecifiedLessons: 0,
    },
  },
  {
    name: "Integrated Science",
    data: grade9IntegratedScienceData,
    expected: {
      strands: 3,
      subStrands: 9,
      outcomes: 46,
      lessons: 150,
      unspecifiedLessons: 0,
    },
  },
  {
    name: "Christian Religious Education",
    data: grade9ChristianReligiousEducationData,
    expected: {
      strands: 5,
      subStrands: 16,
      outcomes: 68,
      lessons: 100,
      unspecifiedLessons: 0,
    },
  },
  {
    name: "Islamic Religious Education",
    data: grade9IslamicReligiousEducationData,
    expected: {
      strands: 7,
      subStrands: 20,
      outcomes: 86,
      lessons: 119,
      unspecifiedLessons: 0,
    },
  },
  {
    name: "French",
    data: grade9FrenchData,
    expected: {
      strands: 3,
      subStrands: 27,
      outcomes: 85,
      lessons: 54,
      unspecifiedLessons: 0,
    },
  },
];

for (const curriculumCase of cases) {
  test(`Grade 9 ${curriculumCase.name} retains the reviewed curriculum totals`, () => {
    assert.deepEqual(summarize(curriculumCase.data), curriculumCase.expected);

    const subStrands = curriculumCase.data.learningAreas[0].strands.flatMap(
      (strand) => strand.subStrands
    );
    assert.equal(
      subStrands.every(
        (sub) =>
          sub.sourceRef?.startsWith(`KICD G9 ${curriculumCase.name} `) &&
          sub.verification === "unverified" &&
          sub.slos.every((slo) => slo.cognitiveLevel === "apply")
      ),
      true
    );
  });
}

test("Grade 9 catalogue replaces the reviewed legacy placeholders", () => {
  for (const curriculumCase of cases) {
    const matches = grade9Data.learningAreas.filter(
      (area) => area.name === curriculumCase.name
    );
    assert.equal(matches.length, 1);
    assert.deepEqual(
      summarize({
        level: 9,
        name: "Grade 9",
        learningAreas: matches,
      }),
      curriculumCase.expected
    );
    assert.equal(
      isTranscribedCurriculumArea(9, curriculumCase.name),
      true
    );
  }

  assert.equal(
    grade9Data.learningAreas.some((area) => area.name === "Agriculture"),
    false
  );
});
test("Grade 9 Social Studies retains the documented lesson-count discrepancies", () => {
  assert.equal(GRADE_9_SOCIAL_STUDIES_DETAILED_LESSON_TOTAL, 120);
  assert.deepEqual(GRADE_9_SOCIAL_STUDIES_LESSON_DISCREPANCIES, [
    { subStrand: "3.4 Population Structure", summaryLessons: 8, detailedLessons: 9 },
    { subStrand: "3.6 Healthy relationships", summaryLessons: 4, detailedLessons: 3 },
    {
      subStrand: "4.4 Management and Conservation of the Environment",
      summaryLessons: 6,
      detailedLessons: 8,
    },
    { subStrand: "5.1 The Constitution of Kenya", summaryLessons: 8, detailedLessons: 6 },
    { subStrand: "5.3 Kenya’s Bill of Rights", summaryLessons: 8, detailedLessons: 6 },
    { subStrand: "5.4 Cultural Globalization", summaryLessons: 6, detailedLessons: 8 },
  ]);
});

test("Grade 9 Creative Arts distinguishes core, optional, and stored lesson totals", () => {
  assert.equal(GRADE_9_CREATIVE_ARTS_SUMMARY_CORE_TOTAL, 150);
  assert.equal(GRADE_9_CREATIVE_ARTS_DETAILED_CORE_TOTAL, 122);
  assert.equal(GRADE_9_CREATIVE_ARTS_ONE_OPTIONAL_TOTAL, 132);
  assert.equal(GRADE_9_CREATIVE_ARTS_STORED_LESSON_TOTAL, 142);
  assert.equal(GRADE_9_CREATIVE_ARTS_LESSON_DISCREPANCIES.length, 15);

  const indigenousGames = GRADE_9_CREATIVE_ARTS_LESSON_DISCREPANCIES.find(
    (entry) => entry.subStrand.includes("Kenyan Indigenous Games")
  );
  assert.equal(
    indigenousGames && "summarySourceRef" in indigenousGames
      ? indigenousGames.summarySourceRef
      : undefined,
    "2.12.2"
  );

  const descriptions = grade9CreativeArtsAndSportsData.learningAreas[0].strands
    .flatMap((strand) => strand.subStrands)
    .flatMap((subStrand) => subStrand.slos)
    .map((slo) => slo.description)
    .join("\n");
  assert.match(descriptions, /4\/4 time/);
  assert.doesNotMatch(descriptions, /\b44 time\b|\b4 4 time\b/);
});

test("Grade 9 Pre-Technical Studies keeps summary numbering over detailed-table errors", () => {
  assert.equal(GRADE_9_PRE_TECHNICAL_DETAILED_LESSON_TOTAL, 120);
  assert.deepEqual(GRADE_9_PRE_TECHNICAL_NUMBERING_DISCREPANCIES, [
    {
      subStrand: "4.3 Distribution of Goods and Services",
      summaryNumber: "4.3",
      detailedTableNumber: "4.5",
      detailedPage: 22,
    },
    {
      subStrand: "4.4 Project",
      summaryNumber: "4.4",
      detailedTableNumber: "4.6",
      detailedPage: 24,
    },
  ]);

  const descriptions = grade9PreTechnicalStudiesData.learningAreas[0].strands
    .flatMap((strand) => strand.subStrands)
    .flatMap((subStrand) => subStrand.slos)
    .map((slo) => slo.description);
  assert.equal(descriptions.some((description) => /\s{2,}/.test(description)), false);
});

test("Grade 9 Agriculture and Nutrition keeps detailed-table names", () => {
  assert.equal(GRADE_9_AGRICULTURE_DETAILED_LESSON_TOTAL, 120);
  assert.deepEqual(GRADE_9_AGRICULTURE_NAMING_DISCREPANCIES, [
    {
      subStrand: "1.2",
      summaryName: "1.2 Conserving leftover feed",
      detailedTableName: "1.2 Conserving Leftover Foods",
      detailedPage: 3,
    },
    {
      subStrand: "1.3",
      summaryName: "1.3 Integrated farming",
      detailedTableName: "1.3 Integrated Farming",
      detailedPage: 5,
    },
  ]);
});

test("Grade 9 Integrated Science excludes extraction artifacts but preserves source grammar", () => {
  assert.equal(GRADE_9_INTEGRATED_SCIENCE_LESSON_TOTAL, 150);
  assert.deepEqual(
    GRADE_9_INTEGRATED_SCIENCE_NORMALIZED_EXTRACTION_ARTIFACTS.map(
      ({ extractedText, teacherFacingText }) => [
        extractedText,
        teacherFacingText,
      ]
    ),
    [
      ["p rotons", "protons"],
      ["eff ects", "effects"],
      ["p revention", "prevention"],
    ]
  );

  const descriptions = grade9IntegratedScienceData.learningAreas[0].strands
    .flatMap((strand) => strand.subStrands)
    .flatMap((subStrand) => subStrand.slos)
    .map((slo) => slo.description);
  assert.equal(
    descriptions.includes("describe basic characteristic of waves in nature,"),
    true
  );
});

test("Grade 9 CRE keeps canonical strands and published wording quirks", () => {
  assert.equal(GRADE_9_CRE_LESSON_TOTAL, 100);
  assert.equal(GRADE_9_CRE_STRAND_NAME_DISCREPANCIES.length, 3);
  assert.deepEqual(
    grade9ChristianReligiousEducationData.learningAreas[0].strands.map(
      (strand) => strand.name
    ),
    [
      "1.0 Creation",
      "2.0 The Bible",
      "3.0 The Life and Ministry of Jesus Christ",
      "4.0 The Church",
      "5.0 Christian Living Today",
    ]
  );

  const subStrands =
    grade9ChristianReligiousEducationData.learningAreas[0].strands.flatMap(
      (strand) => strand.subStrands
    );
  assert.equal(
    subStrands.some(
      (subStrand) =>
        subStrand.name === "3.3 Parable on prayer A Friend at Midnight"
    ),
    true
  );
  assert.equal(
    subStrands.some(
      (subStrand) => subStrand.name === "5.2 Responsible parenthood"
    ),
    true
  );
  assert.equal(
    subStrands
      .flatMap((subStrand) => subStrand.slos)
      .some(
        (slo) =>
          slo.description ===
          "Appreciate the parable by praying to God always."
      ),
    true
  );
});

test("Grade 9 IRE normalizes extraction artifacts and preserves genuine source typos", () => {
  assert.equal(GRADE_9_IRE_LESSON_TOTAL, 119);
  assert.equal(
    GRADE_9_IRE_NUMBERING_DISCREPANCIES[0].detailedTableNumber,
    "6.5"
  );
  assert.equal(
    GRADE_9_IRE_EXTRACTION_NORMALIZATIONS[0].teacherFacingText,
    "1.2 Selected Chapter Surah Al-Hujurat (Q 49)"
  );

  const subStrands =
    grade9IslamicReligiousEducationData.learningAreas[0].strands.flatMap(
      (strand) => strand.subStrands
    );
  assert.equal(
    subStrands.some(
      (subStrand) =>
        subStrand.name ===
        "1.2 Selected Chapter Surah Al-Hujurat (Q 49)"
    ),
    true
  );
  assert.equal(
    subStrands.some(
      (subStrand) => subStrand.name === "6.4 Polygamy in Islam"
    ),
    true
  );

  const descriptions = subStrands
    .flatMap((subStrand) => subStrand.slos)
    .map((slo) => slo.description);
  assert.equal(
    descriptions.some((description) => description.includes("commandmen,t")),
    true
  );
  assert.equal(
    descriptions.some((description) => description.includes("act if ibadah")),
    true
  );
  assert.equal(
    descriptions.some((description) =>
      description.startsWith("describes the measures to curb terrorism")
    ),
    true
  );
  assert.equal(
    descriptions.some((description) => description.includes("Huj urat")),
    false
  );
});

test("Grade 9 French uses detailed tables over the inconsistent summary", () => {
  assert.equal(GRADE_9_FRENCH_DETAILED_LESSON_TOTAL, 54);
  assert.deepEqual(
    GRADE_9_FRENCH_SUMMARY_DISCREPANCIES.map(
      ({ strand, summaryLessons, detailedLessons }) => ({
        strand,
        summaryLessons,
        detailedLessons,
      })
    ),
    [
      {
        strand: "1.0 Listening and speaking",
        summaryLessons: 27,
        detailedLessons: 18,
      },
      {
        strand: "2.0 Reading",
        summaryLessons: 18,
        detailedLessons: 18,
      },
      {
        strand: "3.0 Writing",
        summaryLessons: 9,
        detailedLessons: 18,
      },
    ]
  );

  const subStrands = grade9FrenchData.learningAreas[0].strands.flatMap(
    (strand) => strand.subStrands
  );
  assert.equal(subStrands.length, 27);
  assert.equal(
    subStrands.some(
      (subStrand) => subStrand.name === "2.8 Reading for understanding"
    ),
    true
  );
  assert.equal(
    subStrands.some(
      (subStrand) => subStrand.name === "2.9 Reading for Understanding"
    ),
    true
  );
  assert.equal(
    subStrands.some((subStrand) => subStrand.name === "3.1 Guided Writing"),
    true
  );
  assert.equal(
    subStrands.some((subStrand) => subStrand.name === "3.2 Guided writing"),
    true
  );
});
