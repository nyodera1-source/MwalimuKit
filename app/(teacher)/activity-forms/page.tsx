import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar, Users } from "lucide-react";

export default async function ActivityFormsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const forms = await prisma.activityForm.findMany({
    where: { userId: session.user.id },
    include: {
      experiment: { select: { name: true, subject: true } },
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Activity Forms</h1>
          <p className="text-muted-foreground mt-1">
            Lab reports and practical activity worksheets
          </p>
        </div>
        <Button asChild>
          <Link href="/activity-forms/new">
            <Plus className="h-4 w-4 mr-2" />
            New Activity
          </Link>
        </Button>
      </div>

      {/* Empty State */}
      {forms.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No activity forms yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Create your first lab report or practical activity worksheet from our library of experiments.
            </p>
            <Button asChild>
              <Link href="/activity-forms/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Activity Form
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Forms Grid */}
      {forms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => (
            <Link key={form.id} href={`/activity-forms/${form.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {form.title || form.experiment.name}
                    </CardTitle>
                    <Badge
                      variant={form.status === "completed" ? "default" : "secondary"}
                      className="shrink-0"
                    >
                      {form.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{form.experiment.subject}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>
                      {new Date(form.activityDate).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {form.classGroup && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4 shrink-0" />
                      <span className="line-clamp-1">{form.classGroup}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      {form.grade.name} • {form.learningArea.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
