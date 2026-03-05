import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  Map,
  Search,
  MessageSquare,
  Compass,
  FileText,
} from "lucide-react";
import { SocialStudiesDownloadCard } from "./download-card";

const activityTypeLabels: Record<string, string> = {
  map_work: "Map Work",
  research: "Research Project",
  debate: "Structured Debate",
  field_study: "Field Study",
  case_study: "Case Study",
};

const activityTypeIcons: Record<string, typeof BookOpen> = {
  map_work: Map,
  research: Search,
  debate: MessageSquare,
  field_study: Compass,
  case_study: FileText,
};

const activityTypeColors: Record<string, string> = {
  map_work: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  research:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  debate:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  field_study:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  case_study:
    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

export default async function SocialStudiesPreviewPage({
  params,
}: {
  params: Promise<{ activityId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { activityId } = await params;

  const activity = await prisma.socialStudiesActivity.findUnique({
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
  const discussionPoints = (activity.discussionPoints || []) as string[];
  const relatedConcepts = (activity.relatedConcepts || []) as string[];

  const TypeIcon = activityTypeIcons[activity.activityType] || BookOpen;
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
                        className="border-indigo-300 text-indigo-600 dark:border-indigo-700 dark:text-indigo-400"
                      >
                        {activity.strand.name}
                      </Badge>
                    )}
                  </div>
                </div>
                <BookOpen className="h-8 w-8 text-muted-foreground shrink-0" />
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
                <BookOpen className="h-4 w-4" />
                Background Information
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
                Materials & Resources
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

          {/* Blurred Section - Instructions, Discussion, Expected Outcomes */}
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

              {/* Discussion Points */}
              {discussionPoints.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Discussion Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="blur-[6px]">
                    <ul className="space-y-1">
                      {discussionPoints.map((point: string, idx: number) => (
                        <li key={idx} className="text-sm flex gap-2">
                          <span className="text-muted-foreground">-</span>
                          <span>{point}</span>
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
                <BookOpen className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
                <p className="text-sm font-medium">
                  Download to view full activity details
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Instructions, discussion questions, and more
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Card - Right side (sticky) */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-4">
            <SocialStudiesDownloadCard
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
