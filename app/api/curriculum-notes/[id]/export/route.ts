import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateTeachingNotesPdf } from "@/lib/export/teaching-notes-pdf";
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
  const schoolName = searchParams.get("schoolName") || undefined;
  const classGroup = searchParams.get("classGroup") || undefined;

  const note = await prisma.curriculumNote.findUnique({
    where: { id },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
      strand: { select: { name: true } },
      subStrand: { select: { name: true } },
    },
  });

  if (!note || note.status !== "ready") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const content = (note.content as Record<string, string>) || {};

  const pdf = generateTeachingNotesPdf({
    title: note.title || "Teaching Notes",
    grade: note.grade.name,
    learningArea: note.learningArea.name,
    strand: note.strand.name,
    subStrand: note.subStrand.name,
    noteType: "lecture",
    schoolName,
    classGroup,
    introduction: content.introduction || "",
    keyConcepts: content.keyConcepts || "",
    detailedExplanations: content.detailedExplanations || "",
    examples: content.examples || "",
    studentActivities: content.studentActivities || "",
    assessmentQuestions: content.assessmentQuestions || "",
    teacherTips: content.teacherTips || "",
  });

  const filename = `${(note.title || "teaching-notes")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase()}.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
