/**
 * Single source of truth for the seeded curriculum shape.
 *
 * Both prisma/seed.ts and scripts/audit-curriculum.ts import from here so the
 * seeder and the validator can never disagree about the structure.
 *
 * Fields suffixed "suggested" are teacher-overridable defaults, not
 * constraints — schools legitimately run behind or ahead of the suggested
 * pacing, and the coverage checker warns rather than blocks.
 */

import { grade1Data } from "./grade-1";
import { grade2Data } from "./grade-2";
import { grade3Data } from "./grade-3";
import { grade4Data } from "./grade-4";
import { grade5Data } from "./grade-5";
import { grade6Data } from "./grade-6";
import { grade7Data } from "./grade-7";
import { grade8Data } from "./grade-8";
import { grade9Data } from "./grade-9";
import { grade10Data } from "./grade-10";

export interface SLOData {
  description: string;
  cognitiveLevel: string;
  /** Estimated lessons to cover this outcome. Populated in Phase 2B. */
  suggestedLessons?: number;
  /** "verified" requires a source citation on the parent sub-strand. */
  verification?: "unverified" | "verified" | "disputed";
}

export interface SubStrandData {
  name: string;
  order: number;
  slos: SLOData[];
  /** 1 | 2 | 3 — a default, overridable by the teacher. */
  suggestedTerm?: number;
  /** Estimated lessons across the term. Drives the coverage checker. */
  suggestedLessons?: number;
  /** Citation into the KICD curriculum design. Populated in Phase 2B. */
  sourceRef?: string;
  /**
   * "unverified" until a teacher has checked the row against the design.
   * "verified" requires a sourceRef — the audit script rejects the pairing.
   */
  verification?: "unverified" | "verified" | "disputed";
}

export interface StrandData {
  name: string;
  order: number;
  subStrands: SubStrandData[];
}

export interface LearningAreaData {
  name: string;
  strands: StrandData[];
}

export interface GradeData {
  level: number;
  name: string;
  learningAreas: LearningAreaData[];
}

export const allGrades: GradeData[] = [
  grade1Data, grade2Data, grade3Data, grade4Data, grade5Data,
  grade6Data, grade7Data, grade8Data, grade9Data, grade10Data,
];

export const CORE_COMPETENCIES = [
  { name: "Communication and Collaboration", description: "Ability to communicate effectively and work with others" },
  { name: "Critical Thinking and Problem Solving", description: "Ability to think critically and solve problems creatively" },
  { name: "Creativity and Imagination", description: "Ability to think creatively and develop new ideas" },
  { name: "Citizenship", description: "Understanding of civic responsibility and national values" },
  { name: "Digital Literacy", description: "Ability to use digital technology effectively and responsibly" },
  { name: "Learning to Learn", description: "Ability to learn independently and manage own learning" },
  { name: "Self-Efficacy", description: "Confidence in own ability to succeed and overcome challenges" },
];

/** Bloom levels permitted on a learning outcome. */
export const VALID_COGNITIVE_LEVELS = [
  "remember",
  "understand",
  "apply",
  "analyze",
  "evaluate",
  "create",
] as const;

export const VALID_TERMS = [1, 2, 3] as const;
