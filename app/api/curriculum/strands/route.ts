import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PILOT_RESPONSE_HEADERS, pilotStrandWhere } from "@/lib/curriculum/pilot";

export async function GET(req: NextRequest) {
  const learningAreaId = req.nextUrl.searchParams.get("learningAreaId");
  if (!learningAreaId) {
    return NextResponse.json({ error: "learningAreaId required" }, { status: 400 });
  }

  const deep = req.nextUrl.searchParams.get("deep") === "true";

  if (deep) {
    // Return strands with sub-strands and SLOs (for scheme of work form)
    const strands = await prisma.strand.findMany({
      where: pilotStrandWhere(learningAreaId),
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        subStrands: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            name: true,
            suggestedTerm: true,
            suggestedLessons: true,
            verification: true,
            sourceRef: true,
            slos: {
              orderBy: { order: "asc" },
              select: { id: true, description: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ strands }, {
      headers: PILOT_RESPONSE_HEADERS,
    });
  }

  const strands = await prisma.strand.findMany({
    where: pilotStrandWhere(learningAreaId),
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return NextResponse.json(strands, {
    headers: PILOT_RESPONSE_HEADERS,
  });
}
