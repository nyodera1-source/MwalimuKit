import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PILOT_RESPONSE_HEADERS, pilotLearningAreaWhere } from "@/lib/curriculum/pilot";

export async function GET(req: NextRequest) {
  const gradeId = req.nextUrl.searchParams.get("gradeId");
  if (!gradeId) {
    return NextResponse.json({ error: "gradeId required" }, { status: 400 });
  }

  const learningAreas = await prisma.learningArea.findMany({
    where: pilotLearningAreaWhere(gradeId),
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return NextResponse.json(learningAreas, {
    headers: PILOT_RESPONSE_HEADERS,
  });
}
