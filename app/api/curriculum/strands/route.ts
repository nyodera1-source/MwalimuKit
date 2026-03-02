import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const learningAreaId = req.nextUrl.searchParams.get("learningAreaId");
  if (!learningAreaId) {
    return NextResponse.json({ error: "learningAreaId required" }, { status: 400 });
  }

  const deep = req.nextUrl.searchParams.get("deep") === "true";

  if (deep) {
    // Return strands with sub-strands and SLOs (for scheme of work form)
    const strands = await prisma.strand.findMany({
      where: { learningAreaId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        subStrands: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            name: true,
            slos: {
              orderBy: { order: "asc" },
              select: { id: true, description: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ strands }, {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  }

  const strands = await prisma.strand.findMany({
    where: { learningAreaId },
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return NextResponse.json(strands, {
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
