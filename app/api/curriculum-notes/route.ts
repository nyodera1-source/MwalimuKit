import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const subStrandId = req.nextUrl.searchParams.get("subStrandId");
  if (!subStrandId) {
    return NextResponse.json(
      { error: "subStrandId required" },
      { status: 400 }
    );
  }

  const note = await prisma.curriculumNote.findUnique({
    where: { subStrandId },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
      strand: { select: { name: true } },
      subStrand: { select: { name: true } },
    },
  });

  if (!note) {
    return NextResponse.json({ exists: false }, { status: 404 });
  }

  // If stuck in "generating" for more than 2 minutes, treat as not found
  if (note.status === "generating") {
    const ageMs = Date.now() - new Date(note.updatedAt).getTime();
    if (ageMs >= 120_000) {
      // Delete the stale record so it can be re-generated
      await prisma.curriculumNote.delete({ where: { id: note.id } });
      return NextResponse.json({ exists: false }, { status: 404 });
    }
  }

  // If failed, delete and return 404 so client triggers re-generation
  if (note.status === "failed") {
    await prisma.curriculumNote.delete({ where: { id: note.id } });
    return NextResponse.json({ exists: false }, { status: 404 });
  }

  return NextResponse.json(note);
}
