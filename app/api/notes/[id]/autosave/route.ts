import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.teachingNotes.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const formData = await request.formData();

  const title = formData.get("title") as string;
  const gradeId = formData.get("gradeId") as string;
  const learningAreaId = formData.get("learningAreaId") as string;
  const strandId = formData.get("strandId") as string;
  const subStrandId = formData.get("subStrandId") as string;
  const noteType = formData.get("noteType") as string;
  const contentStr = formData.get("content") as string;

  let content: object = {};
  try {
    content = JSON.parse(contentStr || "{}");
  } catch {
    // Keep empty object
  }

  await prisma.teachingNotes.update({
    where: { id },
    data: {
      title: title || undefined,
      gradeId: gradeId || undefined,
      learningAreaId: learningAreaId || undefined,
      strandId: strandId || undefined,
      subStrandId: subStrandId || undefined,
      noteType: noteType || undefined,
      content,
    },
  });

  return NextResponse.json({ ok: true });
}
