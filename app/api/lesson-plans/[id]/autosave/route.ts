import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.lessonPlan.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const formData = await request.formData();

  const title = formData.get("title") as string;
  const gradeId = formData.get("gradeId") as string;
  const learningAreaId = formData.get("learningAreaId") as string;
  const strandId = formData.get("strandId") as string;
  const subStrandId = formData.get("subStrandId") as string;
  const sloIds = formData.getAll("sloIds") as string[];
  const competencyIds = formData.getAll("competencyIds") as string[];

  const content = {
    date: formData.get("date") as string,
    duration: Number(formData.get("duration")) || 40,
    objectives: formData.get("objectives") as string,
    keyInquiryQuestion: formData.get("keyInquiryQuestion") as string,
    resources: formData.get("resources") as string,
    digitalResources: formData.get("digitalResources") as string,
    activities: {
      introduction: formData.get("activitiesIntroduction") as string,
      development: formData.get("activitiesDevelopment") as string,
      conclusion: formData.get("activitiesConclusion") as string,
    },
    assessmentStrategy: formData.get("assessmentStrategy") as string,
    assessmentDescription: formData.get("assessmentDescription") as string,
    reflection: formData.get("reflection") as string,
  };

  await prisma.lessonPlan.update({
    where: { id },
    data: {
      title: title || undefined,
      gradeId: gradeId || undefined,
      learningAreaId: learningAreaId || undefined,
      strandId: strandId || undefined,
      subStrandId: subStrandId || undefined,
      sloIds: sloIds.length > 0 ? sloIds : undefined,
      competencyIds: competencyIds.length > 0 ? competencyIds : undefined,
      content,
    },
  });

  return NextResponse.json({ ok: true });
}
