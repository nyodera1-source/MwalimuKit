import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const gradeId = req.nextUrl.searchParams.get("gradeId");
  if (!gradeId) {
    return NextResponse.json({ error: "gradeId required" }, { status: 400 });
  }

  const learningAreas = await prisma.learningArea.findMany({
    where: { gradeId },
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return NextResponse.json(learningAreas, {
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
