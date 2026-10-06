import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LessonPlanForm } from "../lesson-plan-form";
import type { SchemeConfig } from "@/lib/export/scheme-of-work-types";
import { getLessonPlanHandoff } from "@/lib/schemes/lesson-plan-handoff";
import { PILOT_GRADE_LEVEL, PILOT_LEARNING_AREAS } from "@/lib/curriculum/pilot";

export default async function NewLessonPlanPage({
  searchParams,
}: {
  searchParams: Promise<{ schemeId?: string; lesson?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { fullName: true, primaryGradeId: true },
  });

  let defaults;
  if (params.schemeId && params.lesson !== undefined) {
    const scheme = await prisma.schemeOfWork.findFirst({
      where: { id: params.schemeId, userId: session.user.id },
      select: { gradeId: true, learningAreaId: true, weeks: true },
    });
    const handoff = scheme
      ? getLessonPlanHandoff(
          scheme.weeks as unknown as SchemeConfig,
          Number(params.lesson)
        )
      : null;

    if (scheme && handoff) {
      const subStrand = await prisma.subStrand.findFirst({
        where: {
          id: handoff.subStrandId,
          strand: {
            id: handoff.strandId,
            learningArea: {
              id: scheme.learningAreaId,
              gradeId: scheme.gradeId,
              name: { in: [...PILOT_LEARNING_AREAS] },
              grade: { level: PILOT_GRADE_LEVEL },
            },
          },
        },
        select: { slos: { select: { id: true } } },
      });
      const validSloIds = new Set(subStrand?.slos.map((slo) => slo.id) || []);
      const sloIds = handoff.sloIds.filter((id) => validSloIds.has(id));

      if (subStrand && sloIds.length > 0) {
        defaults = {
          title: handoff.title,
          gradeId: scheme.gradeId,
          learningAreaId: scheme.learningAreaId,
          strandId: handoff.strandId,
          subStrandId: handoff.subStrandId,
          sloIds,
          content: handoff.content,
        };
      }
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Lesson Plan</h1>
      <LessonPlanForm
        teacherName={user?.fullName || session.user.name || ""}
        defaultGradeId={user?.primaryGradeId}
        defaults={defaults}
      />
    </div>
  );
}
