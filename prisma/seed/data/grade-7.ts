import { grade7MathematicsData } from "./grade-7-mathematics";
import { grade7PreTechnicalStudiesData } from "./grade-7-pre-technical-studies";
import { grade7EnglishData } from "./grade-7-english";
import { grade7KiswahiliData } from "./grade-7-kiswahili";
import { grade7IntegratedScienceData } from "./grade-7-integrated-science";
import { grade7SocialStudiesData } from "./grade-7-social-studies";
import { grade7AgricultureData } from "./grade-7-agriculture";
import { grade7CreativeArtsData } from "./grade-7-creative-arts";
import type { LearningAreaData } from "./index";

/**
 * Grade 7 learning areas still awaiting transcription from the KICD designs.
 *
 * Mathematics is now transcribed - see grade-7-mathematics.ts. The entries
 * below are the previous hand-written seed, whose strand structures do not
 * match the published designs. They remain seeded so no learning area
 * disappears from the running site, and all stay unverified until
 * re-transcribed.
 *
 * Do not treat these as curriculum-accurate. Transcribe each subject from
 * its design PDF before relying on it.
 */
/**
 * Annotated so every entry shares the optional Phase 2B fields. Without this,
 * grade7Data.learningAreas widens to a union of the transcribed modules and the
 * pending blocks, and a .filter() over it cannot narrow — so callers reading
 * subStrands.suggestedLessons or .sourceRef fail to typecheck.
 */
const PENDING_LEARNING_AREAS: LearningAreaData[] = [
    {
      name: "Religious Education",
      strands: [
        {
          name: "Foundations of Faith",
          order: 1,
          subStrands: [
            {
              name: "Sacred Texts",
              order: 1,
              slos: [
                { description: "Identify and explain key teachings from sacred texts", cognitiveLevel: "understand" },
                { description: "Apply teachings from sacred texts to daily life", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "Ethics and Morality",
          order: 2,
          subStrands: [
            {
              name: "Moral Decision Making",
              order: 1,
              slos: [
                { description: "Identify moral dilemmas and discuss possible responses", cognitiveLevel: "analyze" },
                { description: "Apply moral principles in resolving conflicts", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Responsibility and Stewardship",
              order: 2,
              slos: [
                { description: "Explain the concept of environmental stewardship", cognitiveLevel: "understand" },
                { description: "Demonstrate responsible behaviour towards the environment", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
      ],
    },
];

export const grade7Data = {
  level: 7,
  name: "Grade 7",
  learningAreas: [
    ...grade7MathematicsData.learningAreas,
    ...grade7PreTechnicalStudiesData.learningAreas,
    ...grade7EnglishData.learningAreas,
    ...grade7KiswahiliData.learningAreas,
    ...grade7IntegratedScienceData.learningAreas,
    ...grade7SocialStudiesData.learningAreas,
    ...grade7AgricultureData.learningAreas,
    ...grade7CreativeArtsData.learningAreas,
    // Transcribed subjects come from their own modules; drop the stale
    // hand-written copies still sitting in PENDING_LEARNING_AREAS.
    ...PENDING_LEARNING_AREAS.filter(
      (area) =>
        area.name !== "Pre-Technical Studies" &&
        area.name !== "English" &&
        area.name !== "Kiswahili" &&
        area.name !== "Integrated Science" &&
        area.name !== "Social Studies" &&
        // The design merges Nutrition into the subject, so the stale standalone
        // "Agriculture" area must go or both names appear in the picker.
        area.name !== "Agriculture" &&
        area.name !== "Creative Arts and Sports"
    ),
  ],
};