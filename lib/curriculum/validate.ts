import { prisma } from "@/lib/prisma";
import { PILOT_GRADE_LEVEL, PILOT_LEARNING_AREAS } from "@/lib/curriculum/pilot";

/**
 * Phase 2A — server-side curriculum relationship validation.
 *
 * The zod schemas in lib/validations.ts check shape: that gradeId is a string,
 * that strandId is present. They cannot check that the submitted ids actually
 * belong to each other, because that needs the database. Without this, a
 * crafted request can pair a Grade 1 gradeId with a Grade 8 learning area and
 * a strand from a different subject, and the document assembles from unrelated
 * curriculum rows.
 *
 * These return a discriminated result rather than throwing, so callers can show
 * the teacher a plain sentence. The audience is not technical and an
 * unhandled Prisma error is not an acceptable message.
 */

export type ValidationResult =
  | { ok: true }
  | { ok: false; message: string };

const OK: ValidationResult = { ok: true };

function fail(message: string): ValidationResult {
  return { ok: false, message };
}

const GENERIC =
  "That curriculum selection is not valid. Please choose your grade, subject and topic again.";

/**
 * Verifies learningAreaId belongs to gradeId.
 *
 * Used by schemes, which stop at learning area.
 */
export async function validateGradeAndLearningArea(
  gradeId: string,
  learningAreaId: string
): Promise<ValidationResult> {
  const area = await prisma.learningArea.findFirst({
    where: {
      id: learningAreaId,
      gradeId,
      name: { in: [...PILOT_LEARNING_AREAS] },
      grade: { level: PILOT_GRADE_LEVEL },
    },
    select: { id: true },
  });

  if (!area) return fail(GENERIC);
  return OK;
}

/**
 * Verifies the full chain down to specific learning outcomes.
 *
 *   grade → learning area → strand → sub-strand → SLOs
 *
 * Checks every link, not just the endpoints: a strand from another subject
 * under a valid area, or an SLO from another sub-strand, would otherwise pass.
 */
export async function validateCurriculumChain(input: {
  gradeId: string;
  learningAreaId: string;
  strandId: string;
  subStrandId: string;
  sloIds: string[];
}): Promise<ValidationResult> {
  const { gradeId, learningAreaId, strandId, subStrandId, sloIds } = input;

  if (!sloIds.length) return fail("Select at least one learning outcome.");

  // One query confirms every link in the chain, including that each SLO really
  // hangs off the submitted sub-strand.
  const subStrand = await prisma.subStrand.findFirst({
    where: {
      id: subStrandId,
      verification: { not: "superseded" },
      sourceRef: { startsWith: "KICD G7 " },
      strand: {
        id: strandId,
        subStrands: {
          some: {
            verification: { not: "superseded" },
            sourceRef: { startsWith: "KICD G7 " },
          },
        },
        learningArea: {
          id: learningAreaId,
          gradeId,
          name: { in: [...PILOT_LEARNING_AREAS] },
          grade: { level: PILOT_GRADE_LEVEL },
        },
      },
    },
    select: {
      id: true,
      slos: {
        where: { verification: { not: "superseded" } },
        select: { id: true },
      },
    },
  });

  if (!subStrand) return fail(GENERIC);

  const validSloIds = new Set(subStrand.slos.map((s) => s.id));
  const strays = sloIds.filter((id) => !validSloIds.has(id));

  if (strays.length > 0) {
    return fail(
      "One of the selected learning outcomes does not belong to the chosen topic. Please select your topic again."
    );
  }

  return OK;
}

/**
 * Verifies that every id in a set exists. Used for competency ids, which have
 * no hierarchy to check but must still be real rows.
 */
export async function validateCompetencies(
  competencyIds: string[]
): Promise<ValidationResult> {
  if (!competencyIds.length) return OK;

  const count = await prisma.coreCompetency.count({
    where: { id: { in: competencyIds } },
  });

  if (count !== new Set(competencyIds).size) {
    return fail("One of the selected competencies is not valid.");
  }
  return OK;
}
