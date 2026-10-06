import { TRANSCRIBED_GRADE_7_AREAS } from "@/lib/curriculum/transcribed-grade-7";

export const PILOT_GRADE_LEVEL = 7;
export const PILOT_LEARNING_AREAS = TRANSCRIBED_GRADE_7_AREAS;

export const PILOT_RESPONSE_HEADERS = {
  "Cache-Control": "no-store",
};

export function pilotGradeWhere() {
  return { level: PILOT_GRADE_LEVEL };
}

export function pilotLearningAreaWhere(gradeId: string) {
  return {
    gradeId,
    name: { in: [...PILOT_LEARNING_AREAS] },
    grade: { level: PILOT_GRADE_LEVEL },
  };
}

export function pilotStrandWhere(learningAreaId: string) {
  return {
    learningAreaId,
    subStrands: {
      some: {
        verification: { not: "superseded" },
        sourceRef: { startsWith: "KICD G7 " },
      },
    },
    learningArea: {
      name: { in: [...PILOT_LEARNING_AREAS] },
      grade: { level: PILOT_GRADE_LEVEL },
    },
  };
}

export function pilotSubStrandWhere(strandId: string) {
  return {
    strandId,
    verification: { not: "superseded" },
    sourceRef: { startsWith: "KICD G7 " },
    strand: {
      learningArea: {
        name: { in: [...PILOT_LEARNING_AREAS] },
        grade: { level: PILOT_GRADE_LEVEL },
      },
    },
  };
}

export function pilotSloWhere(subStrandId: string) {
  return {
    subStrandId,
    verification: { not: "superseded" },
    subStrand: {
      verification: { not: "superseded" },
      sourceRef: { startsWith: "KICD G7 " },
      strand: {
        learningArea: {
          name: { in: [...PILOT_LEARNING_AREAS] },
          grade: { level: PILOT_GRADE_LEVEL },
        },
      },
    },
  };
}

export function isPilotCurriculum(gradeLevel: number, learningAreaName: string) {
  return (
    gradeLevel === PILOT_GRADE_LEVEL &&
    PILOT_LEARNING_AREAS.includes(
      learningAreaName as (typeof PILOT_LEARNING_AREAS)[number]
    )
  );
}
