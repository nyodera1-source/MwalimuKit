import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateTeachingNotes } from "@/lib/ai/generate-teaching-notes";
import { validateCurriculumChain } from "@/lib/curriculum/validate";
import { checkRateLimit } from "@/lib/rate-limit";
import { readJsonBody, RequestBodyTooLargeError, InvalidJsonBodyError } from "@/lib/request";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: {
    gradeId?: string;
    learningAreaId?: string;
    strandId?: string;
    subStrandId?: string;
    noteType?: string;
    fast?: boolean;
  };
  try {
    body = await readJsonBody<typeof body>(request, 32_768);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError || error instanceof InvalidJsonBodyError) {
      return NextResponse.json({ error: error.message }, { status: error instanceof RequestBodyTooLargeError ? 413 : 400 });
    }
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { gradeId, learningAreaId, strandId, subStrandId, noteType, fast } = body;

  if (!gradeId || !learningAreaId || !strandId || !subStrandId || !noteType) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  if (typeof noteType !== "string" || noteType.length > 120) {
    return NextResponse.json({ error: "Invalid note type" }, { status: 400 });
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
      select: { id: true, description: true },
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

  const curriculumCheck = await validateCurriculumChain({
    gradeId,
    learningAreaId,
    strandId,
    subStrandId,
    sloIds: slos.map((slo) => slo.id),
  });
  if (!curriculumCheck.ok) {
    return NextResponse.json({ error: curriculumCheck.message }, { status: 400 });
  }

  const rate = checkRateLimit(`ai-notes:${session.user.id}`, 10, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many AI requests. Please wait before trying again." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
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
      fast: !!fast,
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
