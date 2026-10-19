import { isTranscribedGrade7Area } from "./transcribed-grade-7";

export const TRANSCRIBED_GRADE_8_AREAS = [
  "Arabic",
  "Christian Religious Education",
  "English",
  "French",
  "German",
  "Integrated Science",
  "Islamic Religious Education",
  "Kiswahili",
  "Mandarin",
  "Mathematics",
  "Pre-Technical Studies",
  "Social Studies",
] as const;

const transcribedGrade8Names = new Set<string>(TRANSCRIBED_GRADE_8_AREAS);

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

export const TRANSCRIBED_GRADE_10_AREAS = [
  "Computer Science",
  "Information and Communication Technology (ICT)",
  "Sports and Recreation",
  "Mathematics",
  "History and Citizenship",
  "Home Science",
  "Islamic Religious Education",
  "Hindu Religious Education",
  "Geography",
  "General Science",
  "Biology",
  "Business Studies",
  "Chemistry",
  "Physics",
  "English",
  "Applied Agriculture",
  "Aviation Technology",
  "Building Construction",
  "Arabic",
  "Kiswahili",
  "German",
  "Mandarin Chinese",
  "Metal Technology",
  "Music and Dance",
  "Theatre and Film",
  "Fasihi ya Kiswahili",
  "Literature in English",
  "Wood Technology",
] as const;

const transcribedGrade10Names = new Set<string>(TRANSCRIBED_GRADE_10_AREAS);

export const TRANSCRIBED_GRADE_LEVELS = [7, 8, 9, 10] as const;

export const TRANSCRIBED_AREAS_BY_GRADE = {
  8: TRANSCRIBED_GRADE_8_AREAS,
  9: TRANSCRIBED_GRADE_9_AREAS,
  10: TRANSCRIBED_GRADE_10_AREAS,
} as const;

export function isTranscribedCurriculumArea(
  gradeLevel: number,
  learningAreaName: string
): boolean {
  return isTranscribedGrade7Area(gradeLevel, learningAreaName) ||
    (gradeLevel === 8 && transcribedGrade8Names.has(learningAreaName)) ||
    (gradeLevel === 9 && transcribedGrade9Names.has(learningAreaName)) ||
    (gradeLevel === 10 && transcribedGrade10Names.has(learningAreaName));
}
