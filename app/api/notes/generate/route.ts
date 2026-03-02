import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateTeachingNotes } from "@/lib/ai/generate-teaching-notes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { gradeId, learningAreaId, strandId, subStrandId, noteType } = body;

  if (!gradeId || !learningAreaId || !strandId || !subStrandId || !noteType) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Fetch curriculum names and SLO descriptions
  const [grade, learningArea, strand, subStrand, slos] = await Promise.all([
    prisma.grade.findUnique({ where: { id: gradeId }, select: { name: true } }),
    prisma.learningArea.findUnique({
      where: { id: learningAreaId },
      select: { name: true },
    }),
    prisma.strand.findUnique({
      where: { id: strandId },
      select: { name: true },
    }),
    prisma.subStrand.findUnique({
      where: { id: subStrandId },
      select: { name: true },
    }),
    prisma.sLO.findMany({
      where: { subStrandId },
      select: { description: true },
    }),
  ]);

  if (!grade || !learningArea || !strand || !subStrand) {
    return NextResponse.json(
      { error: "Invalid curriculum selection" },
      { status: 400 }
    );
  }

  if (slos.length === 0) {
    return NextResponse.json(
      { error: "No SLOs found for this sub-strand" },
      { status: 400 }
    );
  }

  try {
    const notes = await generateTeachingNotes({
      grade: grade.name,
      subject: learningArea.name,
      strand: strand.name,
      subStrand: subStrand.name,
      sloDescriptions: slos.map((s) => s.description),
      noteType,
    });

    return NextResponse.json({ notes });
  } catch (err) {
    console.error("Teaching notes generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate teaching notes. Please try again." },
      { status: 500 }
    );
  }
}
