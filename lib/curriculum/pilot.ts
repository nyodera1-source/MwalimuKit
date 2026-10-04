export const PILOT_GRADE_LEVEL = 7;
export const PILOT_LEARNING_AREA = "Mathematics";

export const PILOT_RESPONSE_HEADERS = {
  "Cache-Control": "no-store",
};

export function pilotGradeWhere() {
  return { level: PILOT_GRADE_LEVEL };
}

export function pilotLearningAreaWhere(gradeId: string) {
  return {
    gradeId,
    name: PILOT_LEARNING_AREA,
    grade: { level: PILOT_GRADE_LEVEL },
  };
}

export function pilotStrandWhere(learningAreaId: string) {
  return {
    learningAreaId,
    learningArea: {
      name: PILOT_LEARNING_AREA,
      grade: { level: PILOT_GRADE_LEVEL },
    },
  };
}

export function pilotSubStrandWhere(strandId: string) {
  return {
    strandId,
    strand: {
      learningArea: {
        name: PILOT_LEARNING_AREA,
        grade: { level: PILOT_GRADE_LEVEL },
      },
    },
  };
}

export function pilotSloWhere(subStrandId: string) {
  return {
    subStrandId,
    subStrand: {
      strand: {
        learningArea: {
          name: PILOT_LEARNING_AREA,
          grade: { level: PILOT_GRADE_LEVEL },
        },
      },
    },
  };
}

export function isPilotCurriculum(gradeLevel: number, learningAreaName: string) {
  return gradeLevel === PILOT_GRADE_LEVEL && learningAreaName === PILOT_LEARNING_AREA;
}
