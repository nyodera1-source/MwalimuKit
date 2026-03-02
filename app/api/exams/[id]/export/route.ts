import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateExamPdf, generateMarkingSchemePdf } from "@/lib/export/exam-pdf";

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

  const exam = await prisma.exam.findUnique({
    where: { id },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
      questions: { orderBy: { orderNum: "asc" } },
    },
  });

  if (!exam || exam.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const title = exam.title || "Untitled Assessment";

  const exportData = {
    title,
    grade: exam.grade.name,
    learningArea: exam.learningArea.name,
    examType: exam.examType,
    assessmentType: exam.assessmentType || "end_term",
    term: exam.term,
    year: exam.year,
    totalMarks: exam.totalMarks,
    timeMinutes: exam.timeMinutes,
    instructions: exam.instructions,
    teacherName: "",
    questions: exam.questions.map((q) => ({
      orderNum: q.orderNum,
      section: q.section,
      text: q.text,
      marks: q.marks,
      imageUrl: q.imageUrl,
      hasImage: q.hasImage,
      answer: q.answer,
      subQuestions: q.subQuestions as { label: string; text: string; marks: number }[] | null,
    })),
  };

  let pdfBuffer: Uint8Array;
  let filename: string;

  if (format === "marking-scheme") {
    pdfBuffer = generateMarkingSchemePdf(exportData);
    filename = `${title.replace(/\s+/g, "_")}_Marking_Scheme.pdf`;
  } else {
    pdfBuffer = generateExamPdf(exportData);
    filename = `${title.replace(/\s+/g, "_")}.pdf`;
  }

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
