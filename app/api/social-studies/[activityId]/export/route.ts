import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generateStudentWorksheetPdf,
  generateTeacherGuidePdf,
} from "@/lib/export/social-studies-pdf";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ activityId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { activityId } = await params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "student";
  const schoolName = searchParams.get("schoolName") || undefined;
  const classGroup = searchParams.get("classGroup") || null;
  const activityDateStr = searchParams.get("activityDate");
  const activityDate = activityDateStr ? new Date(activityDateStr) : new Date();

  const activity = await prisma.socialStudiesActivity.findUnique({
    where: { id: activityId },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
    },
  });

  if (!activity) {
    return NextResponse.json(
      { error: "Activity not found" },
      { status: 404 }
    );
  }

  const pdfData = {
    activityName: activity.name,
    activityType: activity.activityType,
    grade: activity.grade.name,
    learningArea: activity.learningArea.name,
    activityDate,
    classGroup,
    schoolName,
    aim: activity.aim,
    materials: activity.materials as string[],
    instructions: activity.instructions as string[],
    backgroundInfo: activity.backgroundInfo,
    expectedOutcome: activity.expectedOutcome,
    discussionPoints: activity.discussionPoints as string[],
    relatedConcepts: activity.relatedConcepts as string[],
  };

  const pdf =
    type === "teacher"
      ? generateTeacherGuidePdf(pdfData)
      : generateStudentWorksheetPdf(pdfData);

  const filename = `${activity.name
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase()}-${type}-copy.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
