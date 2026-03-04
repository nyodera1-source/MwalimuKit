import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateStudentCopyPdf, generateTeacherCopyPdf } from "@/lib/export/activity-form-pdf";
import { generateActivityDiscussion } from "@/lib/ai/generate-activity-discussion";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "student"; // "student" or "teacher"

  const form = await prisma.activityForm.findUnique({
    where: { id },
    include: {
      experiment: true,
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
    },
  });

  if (!form || form.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const exp = form.experiment;

  // ─── Generate AI content for Teacher Copy if not exists ───
  let teacherCopy = form.teacherCopy as
    | { discussionAnswers?: string; assessmentNotes?: string }
    | null;

  if (type === "teacher" && !teacherCopy) {
    try {
      console.log("Generating AI discussion for teacher copy...");
      const aiContent = await generateActivityDiscussion({
        experimentName: exp.name,
        subject: exp.subject,
        grade: form.grade.name,
        aim: exp.aim,
        procedure: exp.procedure as string[],
        expectedResults: exp.expectedResults,
        relatedConcepts: exp.relatedConcepts as string[],
        studentObservations: form.observations || undefined,
        studentResults: form.results || undefined,
      });

      teacherCopy = {
        discussionAnswers: aiContent.discussionAnswers,
        assessmentNotes: aiContent.assessmentNotes,
      };

      // Save to database for future use
      await prisma.activityForm.update({
        where: { id },
        data: { teacherCopy },
      });

      console.log("AI discussion generated and saved");
    } catch (error) {
      console.error("Failed to generate AI discussion:", error);
      // Continue without AI content
      teacherCopy = null;
    }
  }

  // ─── Generate PDF ───
  const pdfData = {
    experimentName: exp.name,
    subject: exp.subject,
    grade: form.grade.name,
    learningArea: form.learningArea.name,
    activityDate: form.activityDate,
    classGroup: form.classGroup,
    aim: exp.aim,
    materials: exp.materials as string[],
    procedure: exp.procedure as string[],
    safetyNotes: exp.safetyNotes as string[],
    relatedConcepts: exp.relatedConcepts as string[],
    observations: form.observations,
    results: form.results,
    teacherNotes: form.teacherNotes,
    expectedResults: exp.expectedResults,
    teacherCopy: teacherCopy || undefined,
  };

  const pdf =
    type === "teacher"
      ? generateTeacherCopyPdf(pdfData)
      : generateStudentCopyPdf(pdfData);

  const filename = `${exp.name
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase()}-${type}-copy.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
