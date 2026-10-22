import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { generateLessonPlanPdf } from "@/lib/export/lesson-plan-pdf";
import { isMpesaEnabled, PRODUCT_PRICES } from "@/lib/mpesa";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  const plan = await prisma.lessonPlan.findUnique({
    where: { id },
    include: {
      user: { select: { fullName: true } },
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
      strand: { select: { name: true } },
      subStrand: { select: { name: true } },
    },
  });

  if (!plan || plan.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (isMpesaEnabled()) {
    const paid = await prisma.payment.findFirst({
      where: {
        userId: session.user.id,
        product: "lesson_plan",
        documentId: id,
        status: "completed",
      },
      select: { id: true },
    });

    if (!paid) {
      return NextResponse.json(
        { error: "Payment required before downloading this lesson plan.", amount: PRODUCT_PRICES.lesson_plan },
        { status: 402 }
      );
    }
  }

  // Fetch SLO descriptions
  const slos = plan.sloIds.length > 0
    ? await prisma.sLO.findMany({
        where: { id: { in: plan.sloIds } },
        select: { description: true },
      })
    : [];

  // Fetch competency names
  const competencies = plan.competencyIds.length > 0
    ? await prisma.coreCompetency.findMany({
        where: { id: { in: plan.competencyIds } },
        select: { name: true },
      })
    : [];

  const content = (plan.content as Record<string, unknown>) || {};

  const planData = {
    title: plan.title || "Untitled Lesson Plan",
    teacherName: plan.user.fullName,
    grade: plan.grade.name,
    learningArea: plan.learningArea.name,
    strand: plan.strand.name,
    subStrand: plan.subStrand.name,
    slos: slos.map((s) => s.description),
    competencies: competencies.map((c) => c.name),
    date: (content.date as string) || "",
    duration: (content.duration as number) || 0,
    schoolName: ((content.schoolName as string) || "").trim().toUpperCase(),
    classGroup: (content.classGroup as string) || "",
    time: (content.time as string) || "",
    lessonFocus: (content.lessonFocus as string) || "",
    lessonNumber: (content.lessonNumber as number) || 1,
    lessonCount: (content.lessonCount as number) || 1,
    priorKnowledge: (content.priorKnowledge as string) || "",
    vocabulary: (content.vocabulary as string) || "",
    teacherPreparation: (content.teacherPreparation as string) || "",
    valuesAndPcis: (content.valuesAndPcis as string) || "",
    safetyNotes: (content.safetyNotes as string) || "",
    differentiation: (content.differentiation as string) || "",
    homework: (content.homework as string) || "",
    objectives: (content.objectives as string) || "",
    keyInquiryQuestion: (content.keyInquiryQuestion as string) || "",
    resources: (content.resources as string) || "",
    digitalResources: (content.digitalResources as string) || "",
    activities: (content.activities as { introduction?: string; development?: string; conclusion?: string }) || {},
    assessmentStrategy: (content.assessmentStrategy as string) || "",
    assessmentDescription: (content.assessmentDescription as string) || "",
    reflection: (content.reflection as string) || "",
  };

  const pdfBuffer = generateLessonPlanPdf(planData);
  const filename = `${planData.title.replace(/[^a-zA-Z0-9 ]/g, "")}.pdf`;
  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
