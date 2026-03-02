import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const strandId = req.nextUrl.searchParams.get("strandId");
  if (!strandId) {
    return NextResponse.json({ error: "strandId required" }, { status: 400 });
  }

  const subStrands = await prisma.subStrand.findMany({
    where: { strandId },
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return NextResponse.json(subStrands, {
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
