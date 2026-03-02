import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const subStrandId = req.nextUrl.searchParams.get("subStrandId");
  if (!subStrandId) {
    return NextResponse.json({ error: "subStrandId required" }, { status: 400 });
  }

  const slos = await prisma.sLO.findMany({
    where: { subStrandId },
    orderBy: { order: "asc" },
    select: { id: true, description: true, cognitiveLevel: true },
  });

  return NextResponse.json(slos, {
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
