import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Pencil, Trash2 } from "lucide-react";
import { deleteLessonPlan } from "../../actions";

export default async function PreviewLessonPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const plan = await prisma.lessonPlan.findUnique({
    where: { id },
    include: {
      user: { select: { fullName: true } },
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
      strand: { select: { name: true } },
      subStrand: { select: { name: true } },
    },
  });

  if (!plan || plan.userId !== session.user.id) notFound();

  // Fetch SLO descriptions
  const slos =
    plan.sloIds.length > 0
      ? await prisma.sLO.findMany({
          where: { id: { in: plan.sloIds } },
          select: { description: true },
        })
      : [];

  // Fetch competency names
  const competencies =
    plan.competencyIds.length > 0
      ? await prisma.coreCompetency.findMany({
          where: { id: { in: plan.competencyIds } },
          select: { name: true },
        })
      : [];

  const content = (plan.content as Record<string, unknown>) || {};
  const activities = (content.activities as Record<string, string>) || {};

  return (
    <>
      {/* Copy protection styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .preview-protected {
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
          `,
        }}
      />

      {/* Copy protection script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('contextmenu', function(e) {
              if (e.target.closest('.preview-protected')) {
                e.preventDefault();
              }
            });
            document.addEventListener('copy', function(e) {
              if (e.target.closest && e.target.closest('.preview-protected')) {
                e.preventDefault();
              }
            });
            document.addEventListener('keydown', function(e) {
              if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'a' || e.key === 'p')) {
                var el = document.querySelector('.preview-protected');
                if (el && el.contains(document.activeElement || e.target)) {
                  e.preventDefault();
                }
              }
            });
          `,
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/lesson-plans">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <h1 className="text-xl font-bold">{plan.title || "Untitled Plan"}</h1>
            <Badge variant={plan.status === "published" ? "default" : "secondary"}>
              {plan.status}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/lesson-plans/${id}`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button size="sm" asChild>
              <a href={`/api/lesson-plans/${id}/export?format=pdf`} download>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </a>
            </Button>
            <form action={async () => { "use server"; await deleteLessonPlan(id); }}>
              <Button type="submit" variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </form>
          </div>
        </div>

        {/* Preview Content — copy-protected */}
        <div className="preview-protected space-y-4">
          {/* Header Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Teacher</span>
                  <p className="font-medium">{plan.user.fullName || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date</span>
                  <p className="font-medium">{(content.date as string) || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration</span>
                  <p className="font-medium">{content.duration ? `${content.duration} min` : "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <p className="font-medium capitalize">{plan.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Curriculum Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Curriculum Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Grade</span>
                  <p className="font-medium">{plan.grade.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Learning Area</span>
                  <p className="font-medium">{plan.learningArea.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Strand</span>
                  <p className="font-medium">{plan.strand.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Sub-Strand</span>
                  <p className="font-medium">{plan.subStrand.name}</p>
                </div>
              </div>

              {slos.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Specific Learning Outcomes</span>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    {slos.map((slo, i) => (
                      <li key={i} className="font-medium">{slo.description}</li>
                    ))}
                  </ul>
                </div>
              )}

              {competencies.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Core Competencies</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {competencies.map((c, i) => (
                      <Badge key={i} variant="outline">{c.name}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lesson Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lesson Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <PreviewField label="Objectives" value={content.objectives as string} />
              <PreviewField label="Key Inquiry Question" value={content.keyInquiryQuestion as string} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PreviewField label="Learning Resources" value={content.resources as string} />
                <PreviewField label="Digital Resources" value={content.digitalResources as string} />
              </div>
            </CardContent>
          </Card>

          {/* Teaching Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Teaching & Learning Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <PreviewField label="Introduction (5-10 min)" value={activities.introduction} />
              <PreviewField label="Development (Main Activity)" value={activities.development} />
              <PreviewField label="Conclusion (5-10 min)" value={activities.conclusion} />
            </CardContent>
          </Card>

          {/* Assessment & Reflection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assessment & Reflection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <PreviewField label="Assessment Strategy" value={content.assessmentStrategy as string} />
              <PreviewField label="Assessment Details" value={content.assessmentDescription as string} />
              <PreviewField label="Reflection" value={content.reflection as string} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function PreviewField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}</span>
      <p className="font-medium whitespace-pre-wrap mt-0.5">{value || "—"}</p>
    </div>
  );
}
