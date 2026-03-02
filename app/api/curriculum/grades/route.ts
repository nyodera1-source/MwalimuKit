import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const grades = await prisma.grade.findMany({
    orderBy: { level: "asc" },
    select: { id: true, level: true, name: true },
  });

  return NextResponse.json(grades, {
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
