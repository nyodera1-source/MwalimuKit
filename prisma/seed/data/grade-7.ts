import { grade7MathematicsData } from "./grade-7-mathematics";
import { grade7PreTechnicalStudiesData } from "./grade-7-pre-technical-studies";
import { grade7EnglishData } from "./grade-7-english";
import { grade7KiswahiliData } from "./grade-7-kiswahili";
import { grade7IntegratedScienceData } from "./grade-7-integrated-science";
import { grade7SocialStudiesData } from "./grade-7-social-studies";

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
const PENDING_LEARNING_AREAS = [
    {
      name: "Agriculture",
      strands: [
        {
          name: "Soil Science",
          order: 1,
          subStrands: [
            {
              name: "Soil Formation and Types",
              order: 1,
              slos: [
                { description: "Describe the process of soil formation", cognitiveLevel: "understand" },
                { description: "Identify and classify soil types (sandy, clay, loam)", cognitiveLevel: "understand" },
              ],
            },
            {
              name: "Soil Fertility",
              order: 2,
              slos: [
                { description: "Describe methods of maintaining soil fertility", cognitiveLevel: "understand" },
                { description: "Explain the role of organic and inorganic fertilisers", cognitiveLevel: "understand" },
              ],
            },
          ],
        },
        {
          name: "Crop Production",
          order: 2,
          subStrands: [
            {
              name: "Crop Husbandry",
              order: 1,
              slos: [
                { description: "Describe land preparation methods for crop planting", cognitiveLevel: "understand" },
                { description: "Explain factors to consider when selecting planting materials", cognitiveLevel: "analyze" },
              ],
            },
          ],
        },
        {
          name: "Animal Production",
          order: 3,
          subStrands: [
            {
              name: "Livestock Husbandry",
              order: 1,
              slos: [
                { description: "Describe housing and feeding requirements for cattle", cognitiveLevel: "understand" },
                { description: "Identify common livestock diseases and control measures", cognitiveLevel: "remember" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Creative Arts and Sports",
      strands: [
        {
          name: "Visual Arts",
          order: 1,
          subStrands: [
            {
              name: "Drawing and Design",
              order: 1,
              slos: [
                { description: "Create observational drawings using different media", cognitiveLevel: "apply" },
                { description: "Apply elements of design (line, shape, colour, texture) in compositions", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
        {
          name: "Performing Arts",
          order: 2,
          subStrands: [
            {
              name: "Music",
              order: 1,
              slos: [
                { description: "Read and perform simple music notation", cognitiveLevel: "apply" },
                { description: "Compose short musical pieces using simple rhythms", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Drama and Theatre",
              order: 2,
              slos: [
                { description: "Perform short dramatic pieces with expression", cognitiveLevel: "apply" },
                { description: "Analyse characters and themes in dramatic texts", cognitiveLevel: "analyze" },
              ],
            },
          ],
        },
        {
          name: "Sports",
          order: 3,
          subStrands: [
            {
              name: "Athletics",
              order: 1,
              slos: [
                { description: "Perform sprinting techniques with proper form", cognitiveLevel: "apply" },
                { description: "Demonstrate field events skills (shot put, high jump)", cognitiveLevel: "apply" },
              ],
            },
            {
              name: "Ball Games",
              order: 2,
              slos: [
                { description: "Apply tactical play in team sports", cognitiveLevel: "apply" },
                { description: "Officiate basic games applying standard rules", cognitiveLevel: "apply" },
              ],
            },
          ],
        },
      ],
    },
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
    // Transcribed subjects come from their own modules; drop the stale
    // hand-written copies still sitting in PENDING_LEARNING_AREAS.
    ...PENDING_LEARNING_AREAS.filter(
      (area) =>
        area.name !== "Pre-Technical Studies" &&
        area.name !== "English" &&
        area.name !== "Kiswahili" &&
        area.name !== "Integrated Science" &&
        area.name !== "Social Studies"
    ),
  ],
};