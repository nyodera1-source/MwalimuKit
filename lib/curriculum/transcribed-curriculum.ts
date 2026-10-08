import { isTranscribedGrade7Area } from "./transcribed-grade-7";

export const TRANSCRIBED_GRADE_9_AREAS = [
  "Mathematics",
  "English",
  "Kiswahili",
  "Integrated Science",
  "Social Studies",
  "Pre-Technical Studies",
  "Agriculture and Nutrition",
  "Creative Arts and Sports",
  "Arabic",
  "French",
  "Christian Religious Education",
  "Hindu Religious Education",
  "Islamic Religious Education",
] as const;

const transcribedGrade9Names = new Set<string>(TRANSCRIBED_GRADE_9_AREAS);

export function isTranscribedCurriculumArea(
  gradeLevel: number,
  learningAreaName: string
): boolean {
  return isTranscribedGrade7Area(gradeLevel, learningAreaName) ||
    (gradeLevel === 9 && transcribedGrade9Names.has(learningAreaName));
}
