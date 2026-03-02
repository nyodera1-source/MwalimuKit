import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateQuestions } from "@/lib/ai/generate-questions";

interface MultiGradeSelection {
  gradeId: string;
  learningAreaId: string;
  strandIds: string[];
}

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
      multiGradeSelections,
      competencyIds,
      assessmentType,
      questionCount,
      totalMarks,
      cognitiveLevel,
      excludeDiagrams,
    } = body as {
      gradeId: string;
      learningAreaId: string;
      strandId?: string;
      subStrandId?: string;
      sloIds?: string[];
      multiGradeSelections?: MultiGradeSelection[];
      competencyIds?: string[];
      assessmentType?: string;
      questionCount?: number;
      totalMarks?: number;
      cognitiveLevel?: string;
      excludeDiagrams?: boolean;
    };

    if (!gradeId || !learningAreaId) {
      return NextResponse.json({ error: "Grade and learning area are required." }, { status: 400 });
    }

    // Fetch primary curriculum context
    const grade = await prisma.grade.findUnique({ where: { id: gradeId }, select: { name: true } });
    const learningArea = await prisma.learningArea.findUnique({ where: { id: learningAreaId }, select: { name: true } });

    let strandName = "";
    let subStrandName = "";
    let sloDescriptions: string[] = [];
    let strandContext = "";

    // ─── Multi-grade mode ───
    if (multiGradeSelections && multiGradeSelections.length > 0) {
      const contextParts: string[] = [];

      for (const selection of multiGradeSelections) {
        const selGrade = await prisma.grade.findUnique({
          where: { id: selection.gradeId },
          select: { name: true },
        });
        const gradeName = selGrade?.name || "Unknown";
        const gradeStrandNames: string[] = [];

        for (const sid of selection.strandIds) {
          const slos = await prisma.sLO.findMany({
            where: { subStrand: { strandId: sid } },
            select: {
              description: true,
              subStrand: {
                select: { strand: { select: { name: true } } },
              },
            },
            orderBy: { order: "asc" },
          });

          sloDescriptions.push(...slos.map((s) => s.description));

          // Track strand names for this grade
          const strandNames = [...new Set(slos.map((s) => s.subStrand.strand.name))];
          gradeStrandNames.push(...strandNames);
        }

        if (gradeStrandNames.length > 0) {
          contextParts.push(`${gradeName} (${[...new Set(gradeStrandNames)].join(", ")})`);
        }
      }

      strandContext = `Multi-grade exam covering: ${contextParts.join("; ")}`;

    // ─── Single-grade mode (existing logic) ───
    } else {
      if (strandId) {
        const strand = await prisma.strand.findUnique({ where: { id: strandId }, select: { name: true } });
        strandName = strand?.name || "";
      }
      if (subStrandId) {
        const subStrand = await prisma.subStrand.findUnique({ where: { id: subStrandId }, select: { name: true } });
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
        const subStrandNames = [...new Set(slos.map((s) => s.subStrand.name))];
        strandContext = `Covering sub-strands: ${subStrandNames.join(", ")}`;
      } else {
        // All strands in learning area (end-term scenario)
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
        for (const s of slos) {
          const sName = s.subStrand.strand.name;
          if (!strandMap.has(sName)) strandMap.set(sName, new Set());
          strandMap.get(sName)!.add(s.subStrand.name);
        }
        const parts: string[] = [];
        for (const [strand, subStrands] of strandMap) {
          parts.push(`${strand} (${[...subStrands].join(", ")})`);
        }
        strandContext = `Covering all strands: ${parts.join("; ")}`;
      }
    }

    if (sloDescriptions.length === 0) {
      return NextResponse.json(
        { error: "No learning outcomes found for this subject. Please check that curriculum data has been seeded." },
        { status: 400 }
      );
    }

    // Sample SLOs if too many (keep prompt manageable)
    let sampledSlos = sloDescriptions;
    if (sloDescriptions.length > 30) {
      const step = Math.floor(sloDescriptions.length / 30);
      sampledSlos = sloDescriptions.filter((_, i) => i % step === 0).slice(0, 30);
    }

    // Fetch competency names
    let competencyNames: string[] = [];
    if (competencyIds && competencyIds.length > 0) {
      const competencies = await prisma.coreCompetency.findMany({
        where: { id: { in: competencyIds } },
        select: { name: true },
      });
      competencyNames = competencies.map((c) => c.name);
    }

    // Generate questions via Claude
    const questions = await generateQuestions({
      grade: grade?.name || "Grade 7",
      subject: learningArea?.name || "General",
      strand: strandName,
      subStrand: subStrandName,
      strandContext,
      sloDescriptions: sampledSlos,
      competencies: competencyNames,
      assessmentType: assessmentType || "end_term",
      questionCount: Math.min(questionCount || 10, 20),
      totalMarks: totalMarks || 40,
      cognitiveLevel,
      excludeDiagrams,
    });

    return NextResponse.json({ questions });
  } catch (err) {
    console.error("Question generation error:", err);
    const message = err instanceof Error ? err.message : "Failed to generate questions.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
