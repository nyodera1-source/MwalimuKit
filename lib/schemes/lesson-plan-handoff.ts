import type { SchemeConfig } from "@/lib/export/scheme-of-work-types";

export interface LessonPlanHandoff {
  title: string;
  strandId: string;
  subStrandId: string;
  sloIds: string[];
  content: {
    objectives: string;
    keyInquiryQuestion?: string;
    resources: string;
    activities: { development: string };
  };
}

export function getLessonPlanHandoff(
  config: SchemeConfig | null | undefined,
  entryIndex: number
): LessonPlanHandoff | null {
  if (!config || !Number.isInteger(entryIndex) || entryIndex < 0) return null;

  const entry = config.entries?.[entryIndex];
  if (!entry || !entry.strandId || !entry.subStrandId || !entry.sloIds?.length) {
    return null;
  }

  const subTopic = (entry.subTopic || "").split("\n").filter(Boolean).join(" / ");

  return {
    title: `${subTopic || entry.topic} - Week ${entry.week}, Lesson ${entry.lesson}`,
    strandId: entry.strandId,
    subStrandId: entry.subStrandId,
    sloIds: [...new Set(entry.sloIds)],
    content: {
      objectives: entry.objectives,
      ...(entry.keyInquiryQuestion ? { keyInquiryQuestion: entry.keyInquiryQuestion } : {}),
      resources: entry.tlAids,
      activities: { development: entry.tlActivities },
    },
  };
}
