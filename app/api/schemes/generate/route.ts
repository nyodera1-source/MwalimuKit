import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enhanceSchemeContent } from "@/lib/ai/generate-scheme-content";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { gradeId, learningAreaId, entries, referenceBook } = body;

  if (!gradeId || !learningAreaId || !entries || entries.length === 0) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Fetch grade and subject names for AI context
  const [grade, learningArea] = await Promise.all([
    prisma.grade.findUnique({
      where: { id: gradeId },
      select: { name: true },
    }),
    prisma.learningArea.findUnique({
      where: { id: learningAreaId },
      select: { name: true },
    }),
  ]);

  if (!grade || !learningArea) {
    return NextResponse.json(
      { error: "Invalid curriculum selection" },
      { status: 400 }
    );
  }

  try {
    const enhanced = await enhanceSchemeContent({
      grade: grade.name,
      subject: learningArea.name,
      entries,
      referenceBook: referenceBook || "",
    });

    return NextResponse.json({ enhanced });
  } catch (err) {
    console.error("Scheme enhancement error:", err);
    return NextResponse.json(
      { error: "Failed to enhance scheme content. Please try again." },
      { status: 500 }
    );
  }
}
