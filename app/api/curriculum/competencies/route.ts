import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const competencies = await prisma.coreCompetency.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, description: true },
  });

  return NextResponse.json(competencies, {
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
