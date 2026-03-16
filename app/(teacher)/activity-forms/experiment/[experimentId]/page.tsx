import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ArrowLeft, Beaker, Leaf, Zap, ShieldAlert, FlaskConical, ImageIcon } from "lucide-react";
import { ExperimentDownloadCard } from "./download-card";

const subjectIcons: Record<string, typeof Beaker> = {
  Biology: Leaf,
  Chemistry: Beaker,
  Physics: Zap,
};

const subjectColors: Record<string, string> = {
  Biology: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Chemistry: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Physics: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default async function ExperimentPreviewPage({
  params,
}: {
  params: Promise<{ experimentId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { experimentId } = await params;

  const experiment = await prisma.labExperiment.findUnique({
    where: { id: experimentId },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
      strand: { select: { name: true } },
    },
  });

  if (!experiment) notFound();

  const materials = (experiment.materials || []) as string[];
  const procedure = (experiment.procedure || []) as string[];
  const safetyNotes = (experiment.safetyNotes || []) as string[];
  const relatedConcepts = (experiment.relatedConcepts || []) as string[];

  const SubjectIcon = subjectIcons[experiment.subject] || Beaker;
  const colorClass = subjectColors[experiment.subject] || "bg-gray-100 text-gray-700";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/activity-forms">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Activities
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left side */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{experiment.name}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{experiment.grade.name}</Badge>
                    <Badge className={`${colorClass} border-0`}>
                      <SubjectIcon className="h-3 w-3 mr-1" />
                      {experiment.subject}
                    </Badge>
                    <Badge variant="secondary">{experiment.learningArea.name}</Badge>
                    {experiment.strand && (
                      <Badge variant="outline" className="border-pink-300 text-pink-600 dark:border-pink-700 dark:text-pink-400">
                        {experiment.strand.name}
                      </Badge>
                    )}
                  </div>
                </div>
                <FlaskConical className="h-8 w-8 text-muted-foreground shrink-0" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Aim</h4>
                <p className="text-sm leading-relaxed">{experiment.aim}</p>
              </div>
            </CardContent>
          </Card>

          {/* Materials - Fully visible */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Beaker className="h-4 w-4" />
                Materials Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {materials.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground mt-0.5">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experiment Setup Diagram */}
          {experiment.diagramUrl && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Experiment Setup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full rounded-lg overflow-hidden border bg-white">
                  <Image
                    src={experiment.diagramUrl}
                    alt={`Setup diagram for ${experiment.name}`}
                    width={800}
                    height={500}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Blurred Section - Procedure, Safety, Expected Results */}
          <div className="relative">
            {/* Actual content (blurred) */}
            <div className="space-y-4 select-none pointer-events-none">
              {/* Procedure */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Procedure</CardTitle>
                </CardHeader>
                <CardContent className="blur-[6px]">
                  <ol className="space-y-2">
                    {procedure.map((step: string, idx: number) => (
                      <li key={idx} className="text-sm flex gap-2">
                        <span className="font-medium text-muted-foreground shrink-0">{idx + 1}.</span>
                        <span>{step.replace(/^\d+\.\s*/, "")}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Safety Notes */}
              {safetyNotes.length > 0 && (
                <Card className="border-red-200 dark:border-red-900/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-red-600 dark:text-red-400">
                      <ShieldAlert className="h-4 w-4" />
                      Safety Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="blur-[6px]">
                    <ul className="space-y-1">
                      {safetyNotes.map((note: string, idx: number) => (
                        <li key={idx} className="text-sm flex gap-2">
                          <span className="text-red-500">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Related Concepts */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Related Concepts</CardTitle>
                </CardHeader>
                <CardContent className="blur-[6px]">
                  <div className="flex flex-wrap gap-2">
                    {relatedConcepts.map((concept: string, idx: number) => (
                      <Badge key={idx} variant="outline">{concept}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/95 pointer-events-none rounded-lg" />

            {/* Unlock message overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-background/80 backdrop-blur-sm border rounded-xl px-6 py-4 text-center shadow-lg">
                <FlaskConical className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Download to view full experiment details</p>
                <p className="text-xs text-muted-foreground mt-1">Procedure, safety notes, and more</p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Card - Right side (sticky) */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-4">
            <ExperimentDownloadCard
              experimentId={experiment.id}
              experimentName={experiment.name}
              gradeName={experiment.grade.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
