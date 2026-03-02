import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { generateLessonPlanPdf } from "@/lib/export/lesson-plan-pdf";

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
