import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Palette,
  Music,
  Theater,
  PersonStanding,
  Download,
} from "lucide-react";
import { CreativeArtsDownloadCard } from "./download-card";

const activityTypeLabels: Record<string, string> = {
  visual_art: "Visual Art",
  music: "Music",
  drama: "Drama & Theatre",
  dance: "Dance",
};

const activityTypeIcons: Record<string, typeof Palette> = {
  visual_art: Palette,
  music: Music,
  drama: Theater,
  dance: PersonStanding,
};

const activityTypeColors: Record<string, string> = {
  visual_art:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  music:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  drama:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  dance:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default async function CreativeArtsPreviewPage({
  params,
}: {
  params: Promise<{ activityId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { activityId } = await params;

  const activity = await prisma.creativeArtsActivity.findUnique({
    where: { id: activityId },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
      strand: { select: { name: true } },
    },
  });

  if (!activity) notFound();

  const materials = (activity.materials || []) as string[];
  const instructions = (activity.instructions || []) as string[];
  const performanceCriteria = (activity.performanceCriteria || []) as string[];
  const relatedConcepts = (activity.relatedConcepts || []) as string[];

  const TypeIcon = activityTypeIcons[activity.activityType] || Palette;
  const typeLabel =
    activityTypeLabels[activity.activityType] || activity.activityType;
  const typeColor =
    activityTypeColors[activity.activityType] || "bg-gray-100 text-gray-700";

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
                  <CardTitle className="text-xl">{activity.name}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{activity.grade.name}</Badge>
                    <Badge className={`${typeColor} border-0`}>
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {typeLabel}
                    </Badge>
                    <Badge variant="secondary">
                      {activity.learningArea.name}
                    </Badge>
                    {activity.strand && (
                      <Badge
                        variant="outline"
                        className="border-purple-300 text-purple-600 dark:border-purple-700 dark:text-purple-400"
                      >
                        {activity.strand.name}
                      </Badge>
                    )}
                    {activity.artMedium && (
                      <Badge
                        variant="outline"
                        className="border-rose-300 text-rose-600 dark:border-rose-700 dark:text-rose-400"
                      >
                        {activity.artMedium}
                      </Badge>
                    )}
                  </div>
                </div>
                <Palette className="h-8 w-8 text-muted-foreground shrink-0" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Aim
                </h4>
                <p className="text-sm leading-relaxed">{activity.aim}</p>
              </div>
            </CardContent>
          </Card>

          {/* Background Info - Fully visible */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Background & Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {activity.backgroundInfo}
              </p>
            </CardContent>
          </Card>

          {/* Materials - Fully visible */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                Materials & Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {materials.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground mt-0.5">-</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Blurred Sections */}
          <div className="relative">
            <div className="space-y-4 select-none pointer-events-none">
              {/* Instructions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Instructions</CardTitle>
                </CardHeader>
                <CardContent className="blur-[6px]">
                  <ol className="space-y-2">
                    {instructions.map((step: string, idx: number) => (
                      <li key={idx} className="text-sm flex gap-2">
                        <span className="font-medium text-muted-foreground shrink-0">
                          {idx + 1}.
                        </span>
                        <span>{step.replace(/^\d+\.\s*/, "")}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Performance Criteria */}
              {performanceCriteria.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Performance Criteria
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="blur-[6px]">
                    <ul className="space-y-1">
                      {performanceCriteria.map(
                        (criterion: string, idx: number) => (
                          <li key={idx} className="text-sm flex gap-2">
                            <span className="text-muted-foreground">
                              {idx + 1}.
                            </span>
                            <span>{criterion}</span>
                          </li>
                        )
                      )}
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
                      <Badge key={idx} variant="outline">
                        {concept}
                      </Badge>
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
                <Download className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium">
                  Download to view full activity details
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Instructions, performance criteria, and more
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Card - Right side (sticky) */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-4">
            <CreativeArtsDownloadCard
              activityId={activity.id}
              activityName={activity.name}
              gradeName={activity.grade.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
