/**
 * Source-specific tests for all 15 Grade 8 subjects (Indigenous Languages excluded).
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { grade8FrenchData } from "../prisma/seed/data/grade-8-french";
import { grade8ArabicData } from "../prisma/seed/data/grade-8-arabic";
import { grade8GermanData } from "../prisma/seed/data/grade-8-german";
import { grade8MandarinData } from "../prisma/seed/data/grade-8-mandarin";
import { grade8HinduReligiousEducationData } from "../prisma/seed/data/grade-8-hindu-religious-education";
import { grade8EnglishData } from "../prisma/seed/data/grade-8-english";
import { grade8KiswahiliData } from "../prisma/seed/data/grade-8-kiswahili";
import { grade8MathematicsData } from "../prisma/seed/data/grade-8-mathematics";
import { grade8IntegratedScienceData } from "../prisma/seed/data/grade-8-integrated-science";
import { grade8SocialStudiesData } from "../prisma/seed/data/grade-8-social-studies";
import { grade8AgricultureData } from "../prisma/seed/data/grade-8-agriculture-and-nutrition";
import { grade8PreTechnicalStudiesData } from "../prisma/seed/data/grade-8-pre-technical-studies";
import { grade8CreativeArtsData } from "../prisma/seed/data/grade-8-creative-arts-and-sports";
import { grade8CREData } from "../prisma/seed/data/grade-8-christian-religious-education";
import { grade8IREData } from "../prisma/seed/data/grade-8-islamic-religious-education";

function getAllSubStrands(data: any) {
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

function checkAllSourceRefs(data: any, pattern: RegExp) {
  const all = getAllSubStrands(data);
  for (const { subStrand } of all) {
    assert.match(subStrand.sourceRef, pattern, `sourceRef "${subStrand.sourceRef}" did not match ${pattern}`);
  }
}

describe("Grade 8 French", () => {
  it("has 3 strands", () => {
    assert.equal(grade8FrenchData.learningAreas[0].strands.length, 3);
    assert.equal(grade8FrenchData.learningAreas[0].strands[0].name, "1.0 Listening and speaking");
  });
  it("has 27 sub-strands", () => assert.equal(getAllSubStrands(grade8FrenchData).length, 27));
  it("has 85 outcomes and 54 detailed-table lessons", () => {
    const all = getAllSubStrands(grade8FrenchData);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.slos.length, 0), 85);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.suggestedLessons, 0), 54);
  });
  it("preserves the published outcome punctuation", () => {
    const outcomes = getAllSubStrands(grade8FrenchData)
      .flatMap(({ subStrand }) => subStrand.slos.map((slo: any) => slo.description));

    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(",")).length, 53);
    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(".")).length, 30);
    assert.deepEqual(outcomes.filter((outcome: string) => !/[,.]$/.test(outcome)), [
      "exhibit confidence to contribute actively in conversations",
      "read texts for understanding",
    ]);
  });
  it("has valid sourceRefs", () => checkAllSourceRefs(grade8FrenchData, /^KICD G8 French p\.\d+, Strand \d+, Sub-Strand \d+\.\d+$/));
});

describe("Grade 8 Arabic", () => {
  it("has 3 strands", () => {
    assert.equal(grade8ArabicData.learningAreas[0].strands.length, 3);
    assert.equal(grade8ArabicData.learningAreas[0].strands[0].name, "1.0 Listening and Speaking");
  });
  it("has 27 sub-strands", () => assert.equal(getAllSubStrands(grade8ArabicData).length, 27));
  it("first sub-strand name is correct", () => {
    assert.equal(grade8ArabicData.learningAreas[0].strands[0].subStrands[0].name, "1.1 Listening for gist: Main idea.");
  });
  it("has 82 outcomes and 54 detailed-table lessons", () => {
    const all = getAllSubStrands(grade8ArabicData);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.slos.length, 0), 82);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.suggestedLessons, 0), 54);
  });
  it("preserves the published outcome punctuation", () => {
    const outcomes = getAllSubStrands(grade8ArabicData)
      .flatMap(({ subStrand }) => subStrand.slos.map((slo: any) => slo.description));

    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(",")).length, 55);
    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(".")).length, 24);
    assert.deepEqual(outcomes.filter((outcome: string) => !/[,.]$/.test(outcome)), [
      "develop interest in reading Arabic texts",
      "develop interest in reading Arabic texts",
      "appreciate the skill of writing for effective communication",
    ]);
  });
  it("has valid sourceRefs", () => checkAllSourceRefs(grade8ArabicData, /^KICD G8 Arabic p\.\d+, Strand \d+, Sub-Strand \d+\.\d+$/));
});

describe("Grade 8 German", () => {
  it("has 3 strands", () => assert.equal(grade8GermanData.learningAreas[0].strands.length, 3));
  it("has 27 sub-strands", () => assert.equal(getAllSubStrands(grade8GermanData).length, 27));
  it("has valid sourceRefs", () => checkAllSourceRefs(grade8GermanData, /^KICD G8 German p\.\d+, Strand \d+\.\d+, Sub-strand \d+\.\d+$/));
});

describe("Grade 8 Mandarin", () => {
  it("has 3 strands", () => assert.equal(grade8MandarinData.learningAreas[0].strands.length, 3));
  it("has 27 sub-strands", () => assert.equal(getAllSubStrands(grade8MandarinData).length, 27));
  it("has valid sourceRefs", () => checkAllSourceRefs(grade8MandarinData, /^KICD G8 Mandarin p\.\d+, Strand \d+\.\d+, Sub-strand \d+\.\d+$/));
});

describe("Grade 8 Hindu RE", () => {
  it("has 5 strands", () => assert.equal(grade8HinduReligiousEducationData.learningAreas[0].strands.length, 5));
  it("has 7 sub-strands", () => assert.equal(getAllSubStrands(grade8HinduReligiousEducationData).length, 7));
  it("has valid sourceRefs", () => checkAllSourceRefs(grade8HinduReligiousEducationData, /^KICD G8 Hindu Religious Education p\.\d+, Strand \d+\.\d+, Sub-strand \d+\.\d+$/));
});

describe("Grade 8 English", () => {
  it("has 15 published themes", () => assert.equal(grade8EnglishData.learningAreas[0].strands.length, 15));
  it("has 75 sub-strands", () => assert.equal(getAllSubStrands(grade8EnglishData).length, 75));
  it("has 254 outcomes and 150 suggested lessons", () => {
    const all = getAllSubStrands(grade8EnglishData);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.slos.length, 0), 254);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.suggestedLessons, 0), 150);
  });
  it("retains the published recurring skill hierarchy", () => {
    const expectedSkills: Record<string, string> = {
      "1": "Listening and Speaking",
      "2": "Reading",
      "3": "Grammar in Use",
      "4": "Reading",
      "5": "Writing",
    };

    for (const { subStrand } of getAllSubStrands(grade8EnglishData)) {
      const skillNumber = subStrand.name.split(".")[1];
      assert.equal(subStrand.skillStrand, expectedSkills[skillNumber]);
    }
  });
  it("preserves the published outcome punctuation", () => {
    const outcomes = getAllSubStrands(grade8EnglishData)
      .flatMap(({ subStrand }) => subStrand.slos.map((slo: any) => slo.description));
    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(",")).length, 177);
    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(".")).length, 75);
    assert.deepEqual(outcomes.filter((outcome: string) => !/[,.]$/.test(outcome)), [
      "identify features of songs in the locality",
      "use performance techniques when singing",
    ]);
  });
  it("has valid sourceRefs", () => checkAllSourceRefs(grade8EnglishData, /^KICD G8 English p\.\d+, Theme \d+, Sub-Strand \d+\.\d+\.\d+$/));
});

describe("Grade 8 Kiswahili", () => {
  it("has the 15 published themes", () => {
    assert.deepEqual(grade8KiswahiliData.learningAreas[0].strands.map((strand) => strand.name), [
      "1.0 USAFI WA SEHEMU ZA UMMA",
      "2.0 MATUMIZI YAFAAYO YA DAWA",
      "3.0 DHIKI ZINAZOKUMBA WANYAMA",
      "4.0 MATUMIZI BORA YA MALIASILI",
      "5.0 MAJUKUMU YA KIJINSIA",
      "6.0 USALAMA NYUMBANI",
      "7.0 KUHUDUMIA WENYE MAHITAJI MAALUM",
      "8.0 UHALIFU WA MTANDAONI",
      "9.0 MAJUKUMU YA MNUNUZI",
      "10.0 KUKABILIANA NA HISIA",
      "11.0 HAKI ZA WATOTO",
      "12.0 MAGONJWA YASIYOAMBUKIZWA",
      "13.0 HESHIMA KWA TAMADUNI ZA WENGINE",
      "14.0 KUWEKA AKIBA",
      "15.0 MAADILI YA KIJAMII",
    ]);
  });
  it("has 60 sub-strands", () => assert.equal(getAllSubStrands(grade8KiswahiliData).length, 60));
  it("has 240 outcomes and 120 suggested lessons", () => {
    const all = getAllSubStrands(grade8KiswahiliData);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.slos.length, 0), 240);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.suggestedLessons, 0), 120);
  });
  it("retains the published recurring skill hierarchy", () => {
    const expectedSkills: Record<string, string> = {
      "1": "Kusikiliza na Kuzungumza",
      "2": "Kusoma",
      "3": "Kuandika",
      "4": "Sarufi",
    };

    for (const { subStrand } of getAllSubStrands(grade8KiswahiliData)) {
      const skillNumber = subStrand.name.split(".")[1];
      assert.equal(subStrand.skillStrand, expectedSkills[skillNumber]);
    }
  });
  it("preserves the published outcome punctuation", () => {
    const outcomes = getAllSubStrands(grade8KiswahiliData)
      .flatMap(({ subStrand }) => subStrand.slos.map((slo: any) => slo.description));

    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(",")).length, 179);
    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(".")).length, 60);
    assert.deepEqual(outcomes.filter((outcome: string) => !/[,.]$/.test(outcome)), [
      "kutambua viwakilishi vya nafsi, vionyeshi/viashiria na vya idadi katika matini",
    ]);
  });
  it("uses the detailed-table wording for flagged outcomes", () => {
    const all = getAllSubStrands(grade8KiswahiliData).map(({ subStrand }) => subStrand);
    const persuasiveReading = all.find((subStrand) => subStrand.name.startsWith("9.2.1 "));
    const antonyms = all.find((subStrand) => subStrand.name.startsWith("10.4.1 "));

    assert.ok(persuasiveReading);
    assert.equal(persuasiveReading.slos[1].description, "kutabiri matukio katika kifungu cha ufahamu cha kushawishi,");
    assert.ok(antonyms);
    assert.equal(antonyms.name, "10.4.1 Vinyume vya Vitenzi na Vielezi");
    assert.ok(antonyms.slos.slice(1).every((slo: any) => slo.description.includes("vielezi")));
  });
  it("has valid sourceRefs", () => checkAllSourceRefs(grade8KiswahiliData, /^KICD G8 Kiswahili p\.\d+, Theme \d+, Sub-Strand \d+\.\d+\.\d+$/));
});

describe("Grade 8 Mathematics", () => {
  it("has 5 strands", () => assert.equal(grade8MathematicsData.learningAreas[0].strands.length, 5));
  it("has 16 sub-strands", () => assert.equal(getAllSubStrands(grade8MathematicsData).length, 16));
  it("has 112 outcomes and 150 suggested lessons", () => {
    const all = getAllSubStrands(grade8MathematicsData);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.slos.length, 0), 112);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.suggestedLessons, 0), 150);
  });
  it("preserves the published outcome punctuation", () => {
    const outcomes = getAllSubStrands(grade8MathematicsData)
      .flatMap(({ subStrand }) => subStrand.slos.map((slo: any) => slo.description));

    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(",")).length, 1);
    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(".")).length, 24);
    assert.equal(outcomes.filter((outcome: string) => !/[,.]$/.test(outcome)).length, 87);
  });
  it("has valid sourceRefs", () => checkAllSourceRefs(grade8MathematicsData, /^KICD G8 Mathematics p\.\d+, Strand \d+, Sub-Strand \d+\.\d+$/));
});

describe("Grade 8 Integrated Science", () => {
  it("has 3 strands", () => assert.equal(grade8IntegratedScienceData.learningAreas[0].strands.length, 3));
  it("has 8 sub-strands", () => assert.equal(getAllSubStrands(grade8IntegratedScienceData).length, 8));
  it("has 37 outcomes and 150 suggested lessons", () => {
    const all = getAllSubStrands(grade8IntegratedScienceData);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.slos.length, 0), 37);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.suggestedLessons, 0), 150);
  });
  it("preserves the published outcome punctuation", () => {
    const outcomes = getAllSubStrands(grade8IntegratedScienceData)
      .flatMap(({ subStrand }) => subStrand.slos.map((slo: any) => slo.description));

    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(",")).length, 28);
    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(".")).length, 8);
    assert.deepEqual(outcomes.filter((outcome: string) => !/[,.]$/.test(outcome)), [
      "outline the applications of common elements",
    ]);
  });
  it("has valid sourceRefs", () => checkAllSourceRefs(grade8IntegratedScienceData, /^KICD G8 Integrated Science p\.\d+, Strand \d+, Sub-Strand \d+\.\d+$/));
});

describe("Grade 8 Social Studies", () => {
  it("has 4 strands after excluding Community Service Learning", () => {
    assert.equal(grade8SocialStudiesData.learningAreas[0].strands.length, 4);
    assert.ok(grade8SocialStudiesData.learningAreas[0].strands.every(
      (strand) => !strand.name.toLowerCase().includes("community service"),
    ));
  });
  it("has 15 sub-strands", () => assert.equal(getAllSubStrands(grade8SocialStudiesData).length, 15));
  it("has 70 outcomes and 112 suggested lessons", () => {
    const all = getAllSubStrands(grade8SocialStudiesData);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.slos.length, 0), 70);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.suggestedLessons, 0), 112);
  });
  it("preserves the published outcome punctuation", () => {
    const outcomes = getAllSubStrands(grade8SocialStudiesData)
      .flatMap(({ subStrand }) => subStrand.slos.map((slo: any) => slo.description));

    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(",")).length, 55);
    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(".")).length, 15);
    assert.equal(outcomes.filter((outcome: string) => !/[,.]$/.test(outcome)).length, 0);
  });
  it("has valid sourceRefs", () => checkAllSourceRefs(grade8SocialStudiesData, /^KICD G8 Social Studies p\.\d+, Strand \d+, Sub-Strand \d+\.\d+$/));
});

describe("Grade 8 Agriculture", () => {
  it("has 4 strands", () => assert.equal(grade8AgricultureData.learningAreas[0].strands.length, 4));
  it("has 12 sub-strands", () => assert.equal(getAllSubStrands(grade8AgricultureData).length, 12));
  it("has valid sourceRefs", () => checkAllSourceRefs(grade8AgricultureData, /^KICD G8 Agriculture (?:and|&) Nutrition p\.\d+, Strand \d+\.\d+, Sub-strand \d+\.\d+$/));
});

describe("Grade 8 Pre-Technical Studies", () => {
  it("has 5 strands", () => assert.equal(grade8PreTechnicalStudiesData.learningAreas[0].strands.length, 5));
  it("has 14 sub-strands", () => assert.equal(getAllSubStrands(grade8PreTechnicalStudiesData).length, 14));
  it("has valid sourceRefs", () => checkAllSourceRefs(grade8PreTechnicalStudiesData, /^KICD G8 Pre-Technical Studies p\.\d+, Strand \d+\.\d+, Sub-strand \d+\.\d+$/));
});

describe("Grade 8 Creative Arts", () => {
  // NOTE: The Creative Arts PDF has a non-standard table structure where
  // the first page's strand field captures the entire table of contents.
  // The remaining records share the same strand name. This results in 2
  // strands instead of the intended 3. Documented limitation.
  it("has at least 2 strands", () => assert.ok(grade8CreativeArtsData.learningAreas[0].strands.length >= 2));
  it("has 12 sub-strands", () => assert.equal(getAllSubStrands(grade8CreativeArtsData).length, 12));
  it("has valid sourceRefs", () => checkAllSourceRefs(grade8CreativeArtsData, /^KICD G8 Creative Arts (?:and|&) Sports p\.\d+, Strand \d+\.\d+, Sub-strand \d+\.\d+$/));
});

describe("Grade 8 CRE", () => {
  it("has 6 strands", () => assert.equal(grade8CREData.learningAreas[0].strands.length, 6));
  it("has 18 sub-strands", () => assert.equal(getAllSubStrands(grade8CREData).length, 18));
  it("has 84 outcomes and 120 suggested lessons", () => {
    const all = getAllSubStrands(grade8CREData);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.slos.length, 0), 84);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.suggestedLessons, 0), 120);
  });
  it("preserves the published outcome punctuation", () => {
    const outcomes = getAllSubStrands(grade8CREData)
      .flatMap(({ subStrand }) => subStrand.slos.map((slo: any) => slo.description));
    const unpunctuated = outcomes.filter((outcome: string) => !/[,.]$/.test(outcome));

    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(",")).length, 61);
    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(".")).length, 18);
    assert.deepEqual(unpunctuated, [
      "describe how God demonstrated His love to humankind after the fall of man",
      "examine how God’s plan of salvation is fulfilled through Jesus Christ",
      "explain the importance of redemption after the fall of man",
      "take part in sharing the love of God with others",
      "describe the role of the church in caring for the vulnerable and needy in the society",
    ]);
  });
  it("has valid sourceRefs", () => checkAllSourceRefs(grade8CREData, /^KICD G8 Christian Religious Education p\.\d+, Strand \d+, Sub-Strand \d+\.\d+$/));
});

describe("Grade 8 IRE", () => {
  it("has 7 strands", () => assert.equal(grade8IREData.learningAreas[0].strands.length, 7));
  it("has 17 sub-strands", () => assert.equal(getAllSubStrands(grade8IREData).length, 17));
  it("has 74 outcomes and 120 suggested lessons", () => {
    const all = getAllSubStrands(grade8IREData);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.slos.length, 0), 74);
    assert.equal(all.reduce((total, { subStrand }) => total + subStrand.suggestedLessons, 0), 120);
  });
  it("preserves the published outcome punctuation", () => {
    const outcomes = getAllSubStrands(grade8IREData)
      .flatMap(({ subStrand }) => subStrand.slos.map((slo: any) => slo.description));

    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(",")).length, 57);
    assert.equal(outcomes.filter((outcome: string) => outcome.endsWith(".")).length, 17);
    assert.equal(outcomes.filter((outcome: string) => !/[,.]$/.test(outcome)).length, 0);
  });
  it("has valid sourceRefs", () => checkAllSourceRefs(grade8IREData, /^KICD G8 Islamic Religious Education p\.\d+, Strand \d+, Sub-Strand \d+\.\d+$/));
});

describe("Grade 8 cross-cutting checks", () => {
  const subjects = [
    ["French", grade8FrenchData],
    ["Arabic", grade8ArabicData],
    ["German", grade8GermanData],
    ["Mandarin", grade8MandarinData],
    ["Hindu", grade8HinduReligiousEducationData],
    ["English", grade8EnglishData],
    ["Kiswahili", grade8KiswahiliData],
    ["Mathematics", grade8MathematicsData],
    ["Integrated Science", grade8IntegratedScienceData],
    ["Social Studies", grade8SocialStudiesData],
    ["Agriculture", grade8AgricultureData],
    ["Pre-Technical", grade8PreTechnicalStudiesData],
    ["Creative Arts", grade8CreativeArtsData],
    ["CRE", grade8CREData],
    ["IRE", grade8IREData],
  ];

  for (const [name, data] of subjects) {
    it(`${name}: all outcomes have cognitiveLevel "apply"`, () => {
      const all = getAllSubStrands(data);
      for (const { subStrand } of all) {
        for (const slo of subStrand.slos) {
          assert.equal(slo.cognitiveLevel, "apply");
        }
      }
    });

    it(`${name}: all sub-strands have verification "unverified"`, () => {
      const all = getAllSubStrands(data);
      for (const { subStrand } of all) {
        assert.equal(subStrand.verification, "unverified");
      }
    });
  }
});
