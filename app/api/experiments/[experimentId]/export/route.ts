import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateStudentCopyPdf, generateTeacherCopyPdf } from "@/lib/export/activity-form-pdf";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ experimentId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { experimentId } = await params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "student";
  const schoolName = searchParams.get("schoolName") || undefined;
  const classGroup = searchParams.get("classGroup") || null;
  const activityDateStr = searchParams.get("activityDate");
  const activityDate = activityDateStr ? new Date(activityDateStr) : new Date();

  const experiment = await prisma.labExperiment.findUnique({
    where: { id: experimentId },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
    },
  });

  if (!experiment) {
    return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
  }

  const pdfData = {
    experimentName: experiment.name,
    subject: experiment.subject,
    grade: experiment.grade.name,
    learningArea: experiment.learningArea.name,
    activityDate,
    classGroup,
    schoolName,
    aim: experiment.aim,
    materials: experiment.materials as string[],
    procedure: experiment.procedure as string[],
    safetyNotes: experiment.safetyNotes as string[],
    relatedConcepts: experiment.relatedConcepts as string[],
    observations: null,
    results: null,
    teacherNotes: null,
    expectedResults: experiment.expectedResults,
  };

  const pdf =
    type === "teacher"
      ? generateTeacherCopyPdf(pdfData)
      : generateStudentCopyPdf(pdfData);

  const filename = `${experiment.name
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase()}-${type}-copy.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
