import { TRANSCRIBED_GRADE_7_AREAS } from "@/lib/curriculum/transcribed-grade-7";
import {
  TRANSCRIBED_GRADE_8_AREAS,
  TRANSCRIBED_GRADE_9_AREAS,
  TRANSCRIBED_GRADE_10_AREAS,
  TRANSCRIBED_GRADE_LEVELS,
  isTranscribedCurriculumArea,
} from "@/lib/curriculum/transcribed-curriculum";

export const AVAILABLE_GRADE_LEVELS = TRANSCRIBED_GRADE_LEVELS;

export const AVAILABLE_AREAS_BY_GRADE = {
  7: TRANSCRIBED_GRADE_7_AREAS,
  8: TRANSCRIBED_GRADE_8_AREAS,
  9: TRANSCRIBED_GRADE_9_AREAS,
  10: TRANSCRIBED_GRADE_10_AREAS,
} as const;

export const PILOT_RESPONSE_HEADERS = {
  "Cache-Control": "no-store",
};

const activeSourceBackedSubStrand = {
  verification: { not: "superseded" },
  sourceRef: { not: null },
} as const;

function availableAreaBranches() {
  return Object.entries(AVAILABLE_AREAS_BY_GRADE).map(([level, names]) => ({
    grade: { level: Number(level) },
    name: { in: [...names] },
  }));
}

export function pilotLearningAreaScope() {
  return { OR: availableAreaBranches() };
}

export function pilotActiveSubStrandWhere() {
  return activeSourceBackedSubStrand;
}

export function pilotGradeWhere() {
  return { level: { in: [...AVAILABLE_GRADE_LEVELS] } };
}

export function pilotLearningAreaWhere(gradeId: string) {
  return {
    gradeId,
    ...pilotLearningAreaScope(),
  };
}

export function pilotStrandWhere(learningAreaId: string) {
  return {
    learningAreaId,
    subStrands: {
      some: activeSourceBackedSubStrand,
    },
    learningArea: {
      ...pilotLearningAreaScope(),
    },
  };
}

export function pilotSubStrandWhere(strandId: string) {
  return {
    strandId,
    ...activeSourceBackedSubStrand,
    strand: {
      learningArea: {
        ...pilotLearningAreaScope(),
      },
    },
  };
}

export function pilotSloWhere(subStrandId: string) {
  return {
    subStrandId,
    verification: { not: "superseded" },
    subStrand: {
      ...activeSourceBackedSubStrand,
      strand: {
        learningArea: {
          ...pilotLearningAreaScope(),
        },
      },
    },
  };
}

export function isPilotCurriculum(gradeLevel: number, learningAreaName: string) {
  return isTranscribedCurriculumArea(gradeLevel, learningAreaName);
}
