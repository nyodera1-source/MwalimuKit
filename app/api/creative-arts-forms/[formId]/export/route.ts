import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generateAdjudicationFormPdf,
  generateRehearsalPlanPdf,
  generatePerformanceProgramPdf,
  generatePortfolioAssessmentPdf,
} from "@/lib/export/creative-arts-forms-pdf";
import type {
  AdjudicationFormData,
  RehearsalPlanFormData,
  PerformanceProgramFormData,
  PortfolioAssessmentFormData,
  ArtDiscipline,
} from "@/lib/types/creative-arts-forms";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { formId } = await params;
  const { searchParams } = new URL(request.url);
  const schoolName = searchParams.get("schoolName") || undefined;
  const teacherName = searchParams.get("teacherName") || undefined;
  const studentName = searchParams.get("studentName") || undefined;
  const eventName = searchParams.get("eventName") || undefined;
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  const form = await prisma.creativeArtsForm.findUnique({
    where: { id: formId },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
    },
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  let pdf: ArrayBuffer;
  const baseData = {
    formName: form.name,
    grade: form.grade.name,
    artDiscipline: form.artDiscipline as ArtDiscipline,
    description: form.description,
    schoolName,
    date,
  };

  switch (form.formType) {
    case "adjudication":
      pdf = generateAdjudicationFormPdf({
        ...baseData,
        eventName,
        formData: form.formData as unknown as AdjudicationFormData,
      });
      break;
    case "rehearsal_plan":
      pdf = generateRehearsalPlanPdf({
        ...baseData,
        teacherName,
        formData: form.formData as unknown as RehearsalPlanFormData,
      });
      break;
    case "performance_program":
      pdf = generatePerformanceProgramPdf({
        ...baseData,
        formData: form.formData as unknown as PerformanceProgramFormData,
      });
      break;
    case "portfolio_assessment":
      pdf = generatePortfolioAssessmentPdf({
        ...baseData,
        teacherName,
        studentName,
        formData: form.formData as unknown as PortfolioAssessmentFormData,
      });
      break;
    default:
      return NextResponse.json(
        { error: "Invalid form type" },
        { status: 400 }
      );
  }

  const filename = `${form.name
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase()}.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
