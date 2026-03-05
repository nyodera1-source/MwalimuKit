import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaskConical, Beaker, Atom, Zap, Leaf } from "lucide-react";

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

export default async function ActivityFormsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Get all experiments grouped by grade
  const experiments = await prisma.labExperiment.findMany({
    include: {
      grade: { select: { name: true, level: true } },
      learningArea: { select: { name: true } },
    },
    orderBy: [{ gradeId: "asc" }, { subject: "asc" }],
  });

  // Group by grade level
  const gradeGroups = experiments.reduce((acc, exp) => {
    const level = exp.grade.level;
    if (!acc[level]) acc[level] = { name: exp.grade.name, experiments: [] };
    acc[level].experiments.push(exp);
    return acc;
  }, {} as Record<number, { name: string; experiments: typeof experiments }>);

  const gradeLevels = Object.keys(gradeGroups).map(Number).sort();
  const defaultTab = gradeLevels[0]?.toString() || "7";

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-pink-500/10">
            <FlaskConical className="h-6 w-6 text-pink-500" />
          </div>
          <h1 className="text-3xl font-bold">Activity Forms</h1>
        </div>
        <h2 className="text-lg font-medium text-foreground/80 mt-1">
          Lab Reports & Practical Activity Worksheets
        </h2>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Ready-made science practicals aligned to the CBC curriculum. Preview experiment details and download as PDF worksheets for your students.
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

      {/* Grade Tabs */}
      {gradeLevels.length > 0 && (
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="mb-6">
            {gradeLevels.map((level) => (
              <TabsTrigger key={level} value={level.toString()} className="gap-2">
                <Atom className="h-4 w-4" />
                {gradeGroups[level].name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {gradeGroups[level].experiments.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {gradeLevels.map((level) => (
            <TabsContent key={level} value={level.toString()}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gradeGroups[level].experiments.map((exp) => {
                  const SubjectIcon = subjectIcons[exp.subject] || Beaker;
                  const colorClass = subjectColors[exp.subject] || "bg-gray-100 text-gray-700";
                  const materials = (exp.materials || []) as string[];

                  return (
                    <Link
                      key={exp.id}
                      href={`/activity-forms/experiment/${exp.id}`}
                    >
                      <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer h-full">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base leading-tight">
                              {exp.name}
                            </CardTitle>
                            <Badge className={`shrink-0 ${colorClass} border-0`}>
                              <SubjectIcon className="h-3 w-3 mr-1" />
                              {exp.subject}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-0">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {exp.aim}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                            <span>{materials.length} materials needed</span>
                            <span>{exp.learningArea.name}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
