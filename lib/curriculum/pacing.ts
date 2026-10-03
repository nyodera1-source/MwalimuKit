export interface PacingGroup<T> {
  suggestedLessons?: number | null;
  items: T[];
}

export interface PacingSummary {
  availability: "complete" | "partial" | "unavailable";
  suggestedLessons: number;
  capacity: number;
  difference: number | null;
}

export function summarizePacing(
  suggestedLessons: Array<number | null | undefined>,
  capacity: number
): PacingSummary {
  const known = suggestedLessons.filter(
    (value): value is number => Number.isInteger(value) && Number(value) > 0
  );
  const suggestedTotal = known.reduce((sum, value) => sum + value, 0);
  const availability =
    known.length === 0
      ? "unavailable"
      : known.length === suggestedLessons.length
        ? "complete"
        : "partial";

  return {
    availability,
    suggestedLessons: suggestedTotal,
    capacity,
    difference: availability === "complete" ? capacity - suggestedTotal : null,
  };
}

/**
 * Builds one curriculum item batch per suggested lesson. It returns null when
 * any group lacks pacing guidance so callers can use their legacy fallback.
 */
export function buildPacedLessonBatches<T>(
  groups: PacingGroup<T>[],
  capacity: number
): T[][] | null {
  if (
    groups.length === 0 ||
    groups.some(
      (group) =>
        !Number.isInteger(group.suggestedLessons) ||
        Number(group.suggestedLessons) <= 0 ||
        group.items.length === 0
    )
  ) {
    return null;
  }

  const batches: T[][] = [];

  for (const group of groups) {
    const lessonCount = Number(group.suggestedLessons);

    for (let lessonIndex = 0; lessonIndex < lessonCount; lessonIndex++) {
      const start = Math.floor((lessonIndex * group.items.length) / lessonCount);
      const proportionalEnd = Math.floor(
        ((lessonIndex + 1) * group.items.length) / lessonCount
      );
      const end = Math.max(start + 1, proportionalEnd);
      batches.push(group.items.slice(start, Math.min(end, group.items.length)));

      if (batches.length >= capacity) return batches;
    }
  }

  return batches;
}
