import { grade7MathematicsData } from "./grade-7-mathematics";
import { grade7PreTechnicalStudiesData } from "./grade-7-pre-technical-studies";
import { grade7EnglishData } from "./grade-7-english";
import { grade7KiswahiliData } from "./grade-7-kiswahili";
import { grade7IntegratedScienceData } from "./grade-7-integrated-science";
import { grade7SocialStudiesData } from "./grade-7-social-studies";
import { grade7AgricultureData } from "./grade-7-agriculture";
import { grade7CreativeArtsData } from "./grade-7-creative-arts";
import { grade7CreData } from "./grade-7-cre";
import { grade7IreData } from "./grade-7-ire";
import type { LearningAreaData } from "./index";

/**
 * Grade 7 learning areas still awaiting transcription from the KICD designs.
 *
 * Every core area in Grade 7 is now transcribed from its own module, so this
 * list is empty. Religious Education is the one exception that needed a
 * structural decision: the KICD designs publish Christian and Islamic
 * Religious Education as separate subjects, each with its own strand
 * structure and its own lesson count, so the single hand-written
 * "Religious Education" area was replaced by Christian Religious Education
 * (grade-7-cre.ts) and Islamic Religious Education (grade-7-ire.ts). A school
 * offering one offers the other's alternative, not both, and each design
 * carries a different published lesson count — 100 against 121.
 *
 * New pending entries belong here, and the filter below removes any name once
 * its design has been transcribed — otherwise both copies appear in the
 * subject picker.
 */
/**
 * Annotated so every entry shares the optional Phase 2B fields. Without this,
 * grade7Data.learningAreas widens to a union of the transcribed modules and the
 * pending blocks, and a .filter() over it cannot narrow — so callers reading
 * subStrands.suggestedLessons or .sourceRef fail to typecheck.
 */
const PENDING_LEARNING_AREAS: LearningAreaData[] = [];

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
    ...grade7CreData.learningAreas,
    ...grade7IreData.learningAreas,
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
        area.name !== "Creative Arts and Sports" &&
        // Religious Education is published as two subjects, so the single
        // seeded area would sit beside both of them.
        area.name !== "Religious Education"
    ),
  ],
};