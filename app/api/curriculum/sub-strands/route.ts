import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PILOT_RESPONSE_HEADERS, pilotSubStrandWhere } from "@/lib/curriculum/pilot";

export async function GET(req: NextRequest) {
  const strandId = req.nextUrl.searchParams.get("strandId");
  if (!strandId) {
    return NextResponse.json({ error: "strandId required" }, { status: 400 });
  }

  const subStrands = await prisma.subStrand.findMany({
    where: pilotSubStrandWhere(strandId),
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return NextResponse.json(subStrands, {
    headers: PILOT_RESPONSE_HEADERS,
  });
}
