import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateQuestions } from "@/lib/ai/generate-questions";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      gradeId,
      learningAreaId,
      strandId,
      subStrandId,
      sloIds,
      competencyIds,
      assignmentType,
      questionCount,
      totalMarks,
    } = body as {
      gradeId: string;
      learningAreaId: string;
      strandId?: string;
      subStrandId?: string;
      sloIds?: string[];
      competencyIds?: string[];
      assignmentType?: string;
      questionCount?: number;
      totalMarks?: number;
    };

    if (!gradeId || !learningAreaId) {
      return NextResponse.json({ error: "Grade and learning area are required." }, { status: 400 });
    }

    const [grade, learningArea] = await Promise.all([
      prisma.grade.findUnique({ where: { id: gradeId }, select: { name: true } }),
      prisma.learningArea.findUnique({ where: { id: learningAreaId }, select: { name: true } }),
    ]);

    let strandName = "";
    let subStrandName = "";
    let strandContext = "";
    let sloDescriptions: string[] = [];

    if (strandId) {
      const strand = await prisma.strand.findUnique({
        where: { id: strandId },
        select: { name: true },
      });
      strandName = strand?.name || "";
    }

    if (subStrandId) {
      const subStrand = await prisma.subStrand.findUnique({
        where: { id: subStrandId },
        select: { name: true },
      });
      subStrandName = subStrand?.name || "";
    }

    if (sloIds && sloIds.length > 0) {
      const slos = await prisma.sLO.findMany({
        where: { id: { in: sloIds } },
        select: { description: true },
        orderBy: { order: "asc" },
      });
      sloDescriptions = slos.map((s) => s.description);
    } else if (subStrandId) {
      const slos = await prisma.sLO.findMany({
        where: { subStrandId },
        select: { description: true },
        orderBy: { order: "asc" },
      });
      sloDescriptions = slos.map((s) => s.description);
    } else if (strandId) {
      const slos = await prisma.sLO.findMany({
        where: { subStrand: { strandId } },
        select: { description: true, subStrand: { select: { name: true } } },
        orderBy: { order: "asc" },
      });
      sloDescriptions = slos.map((s) => s.description);
      const subStrands = [...new Set(slos.map((s) => s.subStrand.name))];
      strandContext = `Weekly coverage across sub-strands: ${subStrands.join(", ")}`;
    } else {
      const slos = await prisma.sLO.findMany({
        where: { subStrand: { strand: { learningAreaId } } },
        select: {
          description: true,
          subStrand: {
            select: {
              name: true,
              strand: { select: { name: true } },
            },
          },
        },
        orderBy: { order: "asc" },
      });

      sloDescriptions = slos.map((s) => s.description);
      const strandMap = new Map<string, Set<string>>();
      for (const slo of slos) {
        const key = slo.subStrand.strand.name;
        if (!strandMap.has(key)) strandMap.set(key, new Set());
        strandMap.get(key)!.add(slo.subStrand.name);
      }
      strandContext = [...strandMap]
        .map(([strand, subStrands]) => `${strand} (${[...subStrands].join(", ")})`)
        .join("; ");
    }

    if (sloDescriptions.length === 0) {
      return NextResponse.json(
        { error: "No CBC learning outcomes found for this selection." },
        { status: 400 }
      );
    }

    if (sloDescriptions.length > 30) {
      const step = Math.max(1, Math.floor(sloDescriptions.length / 30));
      sloDescriptions = sloDescriptions.filter((_, index) => index % step === 0).slice(0, 30);
    }

    let competencyNames: string[] = [];
    if (competencyIds && competencyIds.length > 0) {
      const competencies = await prisma.coreCompetency.findMany({
        where: { id: { in: competencyIds } },
        select: { name: true },
      });
      competencyNames = competencies.map((c) => c.name);
    }

    const assessmentType =
      assignmentType === "weekly"
        ? "formative"
        : assignmentType === "mid_term"
          ? "mid_term"
          : "end_term";

    const questions = await generateQuestions({
      grade: grade?.name || "Grade",
      subject: learningArea?.name || "Learning Area",
      strand: strandName,
      subStrand: subStrandName,
      strandContext,
      sloDescriptions,
      competencies: competencyNames,
      assessmentType,
      questionCount: Math.min(questionCount || 8, 20),
      totalMarks: totalMarks || 30,
      excludeDiagrams: true,
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Assignment generation error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate assignment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
