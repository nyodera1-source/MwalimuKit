import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateTeachingNotes } from "@/lib/ai/generate-teaching-notes";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { subStrandId, content: providedContent } = await req.json();
  if (!subStrandId) {
    return NextResponse.json(
      { error: "subStrandId required" },
      { status: 400 }
    );
  }

  // Check for existing note
  const existing = await prisma.curriculumNote.findUnique({
    where: { subStrandId },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
      strand: { select: { name: true } },
      subStrand: { select: { name: true } },
    },
  });

  if (existing?.status === "ready") {
    return NextResponse.json(existing);
  }

  if (existing?.status === "generating") {
    const ageMs = Date.now() - new Date(existing.updatedAt).getTime();
    if (ageMs < 120_000) {
      return NextResponse.json({ status: "generating" }, { status: 202 });
    }
  }

  // Fetch curriculum context
  const subStrand = await prisma.subStrand.findUnique({
    where: { id: subStrandId },
    include: {
      strand: {
        include: {
          learningArea: {
            include: { grade: true },
          },
        },
      },
      slos: { orderBy: { order: "asc" } },
    },
  });

  if (!subStrand) {
    return NextResponse.json(
      { error: "Sub-strand not found" },
      { status: 404 }
    );
  }

  const grade = subStrand.strand.learningArea.grade;
  const learningArea = subStrand.strand.learningArea;
  const strand = subStrand.strand;
  const title = `${learningArea.name}: ${subStrand.name}`;

  // If client already has generated content, just save it (Phase 2 of client flow)
  if (providedContent) {
    const saved = await prisma.curriculumNote.upsert({
      where: { subStrandId },
      create: {
        gradeId: grade.id,
        learningAreaId: learningArea.id,
        strandId: strand.id,
        subStrandId,
        title,
        content: providedContent,
        status: "ready",
      },
      update: {
        content: providedContent,
        status: "ready",
        title,
      },
      include: {
        grade: { select: { name: true } },
        learningArea: { select: { name: true } },
        strand: { select: { name: true } },
        subStrand: { select: { name: true } },
      },
    });
    return NextResponse.json(saved);
  }

  // No provided content — generate via AI (works if maxDuration is supported)
  let noteRecord;
  try {
    noteRecord = await prisma.curriculumNote.upsert({
      where: { subStrandId },
      create: {
        gradeId: grade.id,
        learningAreaId: learningArea.id,
        strandId: strand.id,
        subStrandId,
        title,
        content: {},
        status: "generating",
      },
      update: { status: "generating" },
    });
  } catch {
    return NextResponse.json({ status: "generating" }, { status: 202 });
  }

  try {
    const content = await generateTeachingNotes({
      grade: grade.name,
      subject: learningArea.name,
      strand: strand.name,
      subStrand: subStrand.name,
      sloDescriptions: subStrand.slos.map((s) => s.description),
      noteType: "lecture",
    });

    const updated = await prisma.curriculumNote.update({
      where: { id: noteRecord.id },
      data: {
        content: JSON.parse(JSON.stringify(content)),
        status: "ready",
        title,
      },
      include: {
        grade: { select: { name: true } },
        learningArea: { select: { name: true } },
        strand: { select: { name: true } },
        subStrand: { select: { name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    await prisma.curriculumNote.update({
      where: { id: noteRecord.id },
      data: { status: "failed" },
    });
    console.error("Curriculum note generation failed:", error);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
