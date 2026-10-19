/**
 * Grade 8 — assembled from the transcribed KICD curriculum designs.
 *
 * Each learning area is transcribed mechanically from its own module.
 * The PDFs are the ONLY authority; this file just wires the modules together.
 */

import type { LearningAreaData } from "./index";

import { grade8AgricultureData } from "./grade-8-agriculture-and-nutrition";
import { grade8ArabicData } from "./grade-8-arabic";
import { grade8CREData } from "./grade-8-christian-religious-education";
import { grade8CreativeArtsData } from "./grade-8-creative-arts-and-sports";
import { grade8EnglishData } from "./grade-8-english";
import { grade8FrenchData } from "./grade-8-french";
import { grade8GermanData } from "./grade-8-german";
import { grade8HinduReligiousEducationData } from "./grade-8-hindu-religious-education";
import { grade8IntegratedScienceData } from "./grade-8-integrated-science";
import { grade8IREData } from "./grade-8-islamic-religious-education";
import { grade8KiswahiliData } from "./grade-8-kiswahili";
import { grade8MandarinData } from "./grade-8-mandarin";
import { grade8MathematicsData } from "./grade-8-mathematics";
import { grade8PreTechnicalStudiesData } from "./grade-8-pre-technical-studies";
import { grade8SocialStudiesData } from "./grade-8-social-studies";

function distinguishRepeatedUnits(area: LearningAreaData): LearningAreaData {
  return {
    ...area,
    strands: area.strands.map((strand) => {
      const occurrences = new Map<string, number>();
      for (const subStrand of strand.subStrands) {
        occurrences.set(
          subStrand.name,
          (occurrences.get(subStrand.name) ?? 0) + 1
        );
      }

      return {
        ...strand,
        subStrands: strand.subStrands.map((subStrand) => {
          if ((occurrences.get(subStrand.name) ?? 0) < 2) return subStrand;

          const publishedNumber = subStrand.sourceRef?.match(
            /Sub-strand\s+([0-9]+(?:\.[0-9]+)*)/i
          )?.[1];
          if (!publishedNumber) {
            throw new Error(
              `Repeated ${area.name} unit lacks a published identifier: ${subStrand.name}`
            );
          }

          return {
            ...subStrand,
            name: `${publishedNumber} ${subStrand.name}`,
          };
        }),
      };
    }),
  };
}

export const grade8Data = {
  level: 8,
  name: "Grade 8",
  learningAreas: [
    grade8AgricultureData.learningAreas[0],
    grade8ArabicData.learningAreas[0],
    grade8CREData.learningAreas[0],
    grade8CreativeArtsData.learningAreas[0],
    grade8EnglishData.learningAreas[0],
    grade8FrenchData.learningAreas[0],
    distinguishRepeatedUnits(grade8GermanData.learningAreas[0]),
    grade8HinduReligiousEducationData.learningAreas[0],
    grade8IntegratedScienceData.learningAreas[0],
    grade8IREData.learningAreas[0],
    grade8KiswahiliData.learningAreas[0],
    distinguishRepeatedUnits(grade8MandarinData.learningAreas[0]),
    grade8MathematicsData.learningAreas[0],
    grade8PreTechnicalStudiesData.learningAreas[0],
    grade8SocialStudiesData.learningAreas[0],
  ],
};
