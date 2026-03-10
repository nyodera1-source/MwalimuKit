import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileCheck, Calendar, Music2, FolderOpen } from "lucide-react";
import { CreativeArtsFormDownloadCard } from "./download-card";
import {
  AdjudicationVisiblePreview,
  AdjudicationBlurredPreview,
  RehearsalVisiblePreview,
  RehearsalBlurredPreview,
  ProgramVisiblePreview,
  ProgramBlurredPreview,
  PortfolioVisiblePreview,
  PortfolioBlurredPreview,
} from "./form-previews";
import type {
  AdjudicationFormData,
  RehearsalPlanFormData,
  PerformanceProgramFormData,
  PortfolioAssessmentFormData,
} from "@/lib/types/creative-arts-forms";

const formTypeLabels: Record<string, string> = {
  adjudication: "Adjudication Form",
  rehearsal_plan: "Rehearsal Plan",
  performance_program: "Performance Program",
  portfolio_assessment: "Portfolio Assessment",
};

const formTypeIcons: Record<string, typeof FileCheck> = {
  adjudication: FileCheck,
  rehearsal_plan: Calendar,
  performance_program: Music2,
  portfolio_assessment: FolderOpen,
};

const formTypeColors: Record<string, string> = {
  adjudication:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  rehearsal_plan:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  performance_program:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  portfolio_assessment:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const disciplineLabels: Record<string, string> = {
  choir: "Choir",
  dance: "Dance",
  drama: "Drama",
  visual_art: "Visual Art",
  instrumental: "Instrumental",
  ensemble: "Ensemble",
  mixed: "Mixed Arts",
};

export default async function CreativeArtsFormDetailPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { formId } = await params;

  const form = await prisma.creativeArtsForm.findUnique({
    where: { id: formId },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
      strand: { select: { name: true } },
    },
  });

  if (!form) notFound();

  const TypeIcon = formTypeIcons[form.formType] || FileCheck;
  const typeLabel = formTypeLabels[form.formType] || form.formType;
  const typeColor =
    formTypeColors[form.formType] || "bg-gray-100 text-gray-700";

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/activity-forms">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Activity Forms
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{form.name}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{form.grade.name}</Badge>
                    <Badge className={`${typeColor} border-0`}>
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {typeLabel}
                    </Badge>
                    <Badge variant="secondary">
                      {disciplineLabels[form.artDiscipline] ||
                        form.artDiscipline}
                    </Badge>
                    <Badge variant="secondary">
                      {form.learningArea.name}
                    </Badge>
                    {form.strand && (
                      <Badge
                        variant="outline"
                        className="border-purple-300 text-purple-600 dark:border-purple-700 dark:text-purple-400"
                      >
                        {form.strand.name}
                      </Badge>
                    )}
                  </div>
                </div>
                <TypeIcon className="h-8 w-8 text-muted-foreground shrink-0" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Description
                </h4>
                <p className="text-sm leading-relaxed">{form.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Visible Preview */}
          {form.formType === "adjudication" && (
            <AdjudicationVisiblePreview
              data={form.formData as unknown as AdjudicationFormData}
            />
          )}
          {form.formType === "rehearsal_plan" && (
            <RehearsalVisiblePreview
              data={form.formData as unknown as RehearsalPlanFormData}
            />
          )}
          {form.formType === "performance_program" && (
            <ProgramVisiblePreview
              data={form.formData as unknown as PerformanceProgramFormData}
            />
          )}
          {form.formType === "portfolio_assessment" && (
            <PortfolioVisiblePreview
              data={form.formData as unknown as PortfolioAssessmentFormData}
            />
          )}

          {/* Blurred Section */}
          <div className="relative">
            <div className="space-y-4 select-none pointer-events-none">
              <div className="blur-[6px]">
                {form.formType === "adjudication" && (
                  <div className="space-y-4">
                    <AdjudicationBlurredPreview
                      data={
                        form.formData as unknown as AdjudicationFormData
                      }
                    />
                  </div>
                )}
                {form.formType === "rehearsal_plan" && (
                  <div className="space-y-4">
                    <RehearsalBlurredPreview
                      data={
                        form.formData as unknown as RehearsalPlanFormData
                      }
                    />
                  </div>
                )}
                {form.formType === "performance_program" && (
                  <div className="space-y-4">
                    <ProgramBlurredPreview
                      data={
                        form.formData as unknown as PerformanceProgramFormData
                      }
                    />
                  </div>
                )}
                {form.formType === "portfolio_assessment" && (
                  <div className="space-y-4">
                    <PortfolioBlurredPreview
                      data={
                        form.formData as unknown as PortfolioAssessmentFormData
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/95 pointer-events-none rounded-lg" />

            {/* Unlock message */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-background/80 backdrop-blur-sm border rounded-xl px-6 py-4 text-center shadow-lg">
                <Download className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium">
                  Download to view full form details
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Complete criteria, rubrics, and printable layout
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Card */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-4">
            <CreativeArtsFormDownloadCard
              formId={form.id}
              formName={form.name}
              formType={form.formType}
              gradeName={form.grade.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
