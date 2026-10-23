import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// This endpoint saves AI-generated content to the curriculum notes cache.
// The AI generation itself happens via /api/notes/generate (client-side call).

export async function POST(req: NextRequest) {
  // Shared curriculum notes must not be writable by individual teachers. The
  // route remains available for a future reviewed/admin workflow, but is
  // explicitly disabled until that provenance boundary exists.
  if (process.env.CURRICULUM_NOTES_WRITES_ENABLED !== "true") {
    return NextResponse.json(
      { error: "Curriculum notes are not currently available." },
      { status: 410 },
    );
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { subStrandId, content } = await req.json();
  if (!subStrandId || !content) {
    return NextResponse.json(
      { error: "subStrandId and content required" },
      { status: 400 }
    );
  }

  // Fetch curriculum context for the title and relations
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

  // Save to cache via upsert
  const saved = await prisma.curriculumNote.upsert({
    where: { subStrandId },
    create: {
      gradeId: grade.id,
      learningAreaId: learningArea.id,
      strandId: strand.id,
      subStrandId,
      title,
      content,
      status: "ready",
    },
    update: {
      content,
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
