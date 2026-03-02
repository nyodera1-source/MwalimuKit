import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateTeachingNotesPdf } from "@/lib/export/teaching-notes-pdf";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  const notes = await prisma.teachingNotes.findUnique({
    where: { id },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
      strand: { select: { name: true } },
      subStrand: { select: { name: true } },
    },
  });

  if (!notes || notes.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const content = (notes.content as Record<string, string>) || {};

  const pdf = generateTeachingNotesPdf({
    title: notes.title || "Teaching Notes",
    grade: notes.grade.name,
    learningArea: notes.learningArea.name,
    strand: notes.strand.name,
    subStrand: notes.subStrand.name,
    noteType: notes.noteType,
    introduction: content.introduction || "",
    keyConcepts: content.keyConcepts || "",
    detailedExplanations: content.detailedExplanations || "",
    examples: content.examples || "",
    studentActivities: content.studentActivities || "",
    assessmentQuestions: content.assessmentQuestions || "",
    teacherTips: content.teacherTips || "",
  });

  const filename = `${(notes.title || "teaching-notes")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase()}.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
