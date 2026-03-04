import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Beaker, FlaskConical } from "lucide-react";

export default async function NewActivityFormPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Get all experiments with grade/learning area info
  const experiments = await prisma.labExperiment.findMany({
    include: {
      grade: { select: { name: true, id: true } },
      learningArea: { select: { name: true, id: true } },
    },
    orderBy: [{ subject: "asc" }, { gradeId: "asc" }],
  });

  // Group experiments by subject
  const grouped = experiments.reduce((acc, exp) => {
    if (!acc[exp.subject]) acc[exp.subject] = [];
    acc[exp.subject].push(exp);
    return acc;
  }, {} as Record<string, typeof experiments>);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/activity-forms">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Choose an Experiment</h1>
        <p className="text-muted-foreground mt-1">
          Select a lab experiment to create an activity form
        </p>
      </div>

      {/* Empty State */}
      {experiments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FlaskConical className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No experiments available</h3>
            <p className="text-muted-foreground">
              The experiment library is empty. Contact support for assistance.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Experiments by Subject */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([subject, subjectExperiments]) => (
          <div key={subject}>
            <div className="flex items-center gap-2 mb-4">
              <Beaker className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">{subject}</h2>
              <Badge variant="outline">{subjectExperiments.length}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjectExperiments.map((exp) => {
                const materials = (exp.materials || []) as string[];
                const concepts = (exp.relatedConcepts || []) as string[];

                return (
                  <Link
                    key={exp.id}
                    href={`/activity-forms/new/${exp.id}`}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="text-lg">{exp.name}</CardTitle>
                          <Badge variant="secondary">{exp.grade.name}</Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {exp.aim}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Materials ({materials.length})
                          </p>
                          <p className="text-sm line-clamp-2">
                            {materials.slice(0, 3).join(", ")}
                            {materials.length > 3 && "..."}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Related Concepts
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {concepts.slice(0, 3).map((concept: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {concept}
                              </Badge>
                            ))}
                            {concepts.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{concepts.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
