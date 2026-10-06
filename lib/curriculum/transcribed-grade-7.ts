import { grade7Data } from "../../prisma/seed/data/grade-7";

export const transcribedGrade7Areas = grade7Data.learningAreas.filter((area) =>
  area.strands.length > 0 && area.strands.every((strand) =>
    strand.subStrands.length > 0 && strand.subStrands.every((sub) =>
      typeof sub.sourceRef === "string" && sub.sourceRef.startsWith("KICD G7 ")
    )
  )
);

export const TRANSCRIBED_GRADE_7_AREAS = transcribedGrade7Areas.map((area) => area.name);
const transcribedNames = new Set(TRANSCRIBED_GRADE_7_AREAS);

export function isTranscribedGrade7Area(gradeLevel: number, name: string): boolean {
  return gradeLevel === 7 && transcribedNames.has(name);
}

export interface StoredTranscribedArea {
  name: string;
  strands: {
    name: string;
    order: number;
    subStrands: {
      name: string;
      order: number;
      verification: string;
      suggestedLessons: number | null;
      sourceRef: string | null;
      skillStrand: string | null;
      slos: { description: string; order: number; verification: string }[];
    }[];
  }[];
}

export function matchesTranscribedGrade7(stored: StoredTranscribedArea[]): boolean {
  if (stored.length !== transcribedGrade7Areas.length) return false;
  return transcribedGrade7Areas.every((expectedArea) => {
    const area = stored.find((row) => row.name === expectedArea.name);
    if (!area) return false;
    const activeStrands = area.strands.filter((row) =>
      row.subStrands.some((sub) => sub.verification !== "superseded")
    );
    if (activeStrands.length !== expectedArea.strands.length) return false;
    return expectedArea.strands.every((expectedStrand) => {
      const strand = activeStrands.find((row) => row.name === expectedStrand.name);
      const activeSubStrands = strand?.subStrands.filter((row) => row.verification !== "superseded");
      if (!strand || strand.order !== expectedStrand.order ||
          activeSubStrands?.length !== expectedStrand.subStrands.length) return false;
      return expectedStrand.subStrands.every((expectedSub) => {
        const sub = activeSubStrands.find((row) => row.name === expectedSub.name);
        if (!sub || sub.order !== expectedSub.order ||
            sub.suggestedLessons !== (expectedSub.suggestedLessons ?? null) ||
            sub.sourceRef !== (expectedSub.sourceRef ?? null) ||
            sub.skillStrand !== (expectedSub.skillStrand ?? null)) return false;
        const activeOutcomes = sub.slos.filter((slo) => slo.verification !== "superseded");
        return activeOutcomes.length === expectedSub.slos.length &&
          expectedSub.slos.every((expectedSlo, index) =>
            activeOutcomes.some((slo) =>
              slo.order === index + 1 && slo.description === expectedSlo.description
            )
          );
      });
    });
  });
}
