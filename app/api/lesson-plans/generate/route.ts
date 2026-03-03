import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateLessonPlan } from "@/lib/ai/generate-lesson-plan";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const {
    gradeId,
    learningAreaId,
    strandId,
    subStrandId,
    sloIds,
    competencyIds,
    duration,
  } = body;

  if (!gradeId || !learningAreaId || !strandId || !subStrandId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Fetch curriculum names, SLOs, and competencies
  const [grade, learningArea, strand, subStrand, slos, competencies] =
    await Promise.all([
      prisma.grade.findUnique({
        where: { id: gradeId },
        select: { name: true },
      }),
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
      // If specific SLO IDs provided, use those; otherwise fetch all for sub-strand
      sloIds && sloIds.length > 0
        ? prisma.sLO.findMany({
            where: { id: { in: sloIds } },
            select: { description: true },
          })
        : prisma.sLO.findMany({
            where: { subStrandId },
            select: { description: true },
          }),
      competencyIds && competencyIds.length > 0
        ? prisma.coreCompetency.findMany({
            where: { id: { in: competencyIds } },
            select: { name: true },
          })
        : Promise.resolve([]),
    ]);

  if (!grade || !learningArea || !strand || !subStrand) {
    return NextResponse.json(
      { error: "Invalid curriculum selection" },
      { status: 400 }
    );
  }

  if (slos.length === 0) {
    return NextResponse.json(
      { error: "No SLOs found for this selection" },
      { status: 400 }
    );
  }

  try {
    const plan = await generateLessonPlan({
      grade: grade.name,
      subject: learningArea.name,
      strand: strand.name,
      subStrand: subStrand.name,
      sloDescriptions: slos.map((s) => s.description),
      competencies: competencies.map((c) => c.name),
      duration: Number(duration) || 40,
    });

    return NextResponse.json({ plan });
  } catch (err) {
    console.error("Lesson plan generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate lesson plan. Please try again." },
      { status: 500 }
    );
  }
}
