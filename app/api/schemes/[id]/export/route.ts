import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { generateSchemeOfWorkPdf } from "@/lib/export/scheme-of-work-pdf";
import type { SchemeConfig } from "@/lib/export/scheme-of-work-types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  const scheme = await prisma.schemeOfWork.findUnique({
    where: { id },
    include: {
      user: { select: { fullName: true } },
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
    },
  });

  if (!scheme || scheme.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data = (scheme.weeks as unknown as SchemeConfig) || {};

  const pdfBuffer = generateSchemeOfWorkPdf({
    title: scheme.title || "Untitled Scheme of Work",
    teacherName: scheme.user.fullName,
    schoolName: data.schoolName || "",
    grade: scheme.grade.name,
    learningArea: scheme.learningArea.name,
    referenceBook: data.referenceBook || "",
    term: scheme.term,
    year: scheme.year,
    lessonsPerWeek: data.lessonsPerWeek || 5,
    entries: data.entries || [],
    breaks: data.breaks || [],
  });

  const filename = `${(scheme.title || "Scheme of Work").replace(/[^a-zA-Z0-9 ]/g, "")}.pdf`;
  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
