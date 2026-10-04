import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PILOT_RESPONSE_HEADERS, pilotGradeWhere } from "@/lib/curriculum/pilot";

export async function GET() {
  const grades = await prisma.grade.findMany({
    where: pilotGradeWhere(),
    orderBy: { level: "asc" },
    select: { id: true, level: true, name: true },
  });

  return NextResponse.json(grades, {
    headers: PILOT_RESPONSE_HEADERS,
  });
}
