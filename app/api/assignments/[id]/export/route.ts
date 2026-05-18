import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generateAssignmentAnswersPdf,
  generateAssignmentPdf,
  type AssignmentPdfQuestion,
} from "@/lib/export/assignment-pdf";

function normalizeQuestions(value: unknown): AssignmentPdfQuestion[] {
  if (!Array.isArray(value)) return [];

  return value.map((q, index) => ({
    orderNum: Number(q?.orderNum) || index + 1,
    text: typeof q?.text === "string" ? q.text : "",
    marks: Number(q?.marks) || 1,
    answer: typeof q?.answer === "string" ? q.answer : "",
    cognitiveLevel: typeof q?.cognitiveLevel === "string" ? q.cognitiveLevel : null,
  }));
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const format = req.nextUrl.searchParams.get("format") || "pdf";

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
    },
  });

  if (!assignment || assignment.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const title = assignment.title || "Untitled Assignment";
  const exportData = {
    title,
    grade: assignment.grade.name,
    learningArea: assignment.learningArea.name,
    assignmentType: assignment.assignmentType,
    term: assignment.term,
    year: assignment.year,
    weekNumber: assignment.weekNumber,
    totalMarks: assignment.totalMarks,
    timeMinutes: assignment.timeMinutes,
    instructions: assignment.instructions,
    questions: normalizeQuestions(assignment.questions),
  };

  const pdfBuffer =
    format === "answers"
      ? generateAssignmentAnswersPdf(exportData)
      : generateAssignmentPdf(exportData);
  const suffix = format === "answers" ? "_Answer_Guide" : "";
  const filename = `${title.replace(/\s+/g, "_")}${suffix}.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
