import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FlaskConical,
  Beaker,
  Atom,
  Zap,
  Leaf,
  BookOpen,
  Map,
  Search,
  MessageSquare,
  Compass,
  FileText,
} from "lucide-react";

// Science subject styling
const subjectIcons: Record<string, typeof Beaker> = {
  Biology: Leaf,
  Chemistry: Beaker,
  Physics: Zap,
};

const subjectColors: Record<string, string> = {
  Biology:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Chemistry:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Physics:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

// Social Studies activity type styling
const activityTypeIcons: Record<string, typeof BookOpen> = {
  map_work: Map,
  research: Search,
  debate: MessageSquare,
  field_study: Compass,
  case_study: FileText,
};

const activityTypeLabels: Record<string, string> = {
  map_work: "Map Work",
  research: "Research",
  debate: "Debate",
  field_study: "Field Study",
  case_study: "Case Study",
};

const activityTypeColors: Record<string, string> = {
  map_work:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  research:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  debate:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  field_study:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  case_study:
    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

export default async function ActivityFormsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch science experiments and social studies activities in parallel
  const [experiments, socialStudies] = await Promise.all([
    prisma.labExperiment.findMany({
      include: {
        grade: { select: { name: true, level: true } },
        learningArea: { select: { name: true } },
        strand: { select: { name: true } },
      },
      orderBy: [{ gradeId: "asc" }, { subject: "asc" }],
    }),
    prisma.socialStudiesActivity.findMany({
      include: {
        grade: { select: { name: true, level: true } },
        learningArea: { select: { name: true } },
        strand: { select: { name: true } },
      },
      orderBy: [{ gradeId: "asc" }, { activityType: "asc" }],
    }),
  ]);

  // Group experiments by grade level
  const scienceGrades = experiments.reduce(
    (acc, exp) => {
      const level = exp.grade.level;
      if (!acc[level]) acc[level] = { name: exp.grade.name, experiments: [] };
      acc[level].experiments.push(exp);
      return acc;
    },
    {} as Record<number, { name: string; experiments: typeof experiments }>
  );

  // Group social studies by grade level
  const ssGrades = socialStudies.reduce(
    (acc, act) => {
      const level = act.grade.level;
      if (!acc[level]) acc[level] = { name: act.grade.name, activities: [] };
      acc[level].activities.push(act);
      return acc;
    },
    {} as Record<number, { name: string; activities: typeof socialStudies }>
  );

  const scienceLevels = Object.keys(scienceGrades).map(Number).sort();
  const ssLevels = Object.keys(ssGrades).map(Number).sort();
  const defaultScienceTab = scienceLevels[0]?.toString() || "7";
  const defaultSSTab = ssLevels[0]?.toString() || "7";

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
          Practical Activities & Worksheets
        </h2>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Ready-made activities aligned to the CBC curriculum. Preview details
          and download as PDF worksheets for your students.
        </p>
      </div>

      {/* Top-level subject area tabs */}
      <Tabs defaultValue="science" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="science" className="gap-2">
            <FlaskConical className="h-4 w-4" />
            Science Practicals
            <Badge variant="secondary" className="ml-1 text-xs">
              {experiments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="social-studies" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Social Studies
            <Badge variant="secondary" className="ml-1 text-xs">
              {socialStudies.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* ═══ Science Practicals Tab ═══ */}
        <TabsContent value="science">
          {experiments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <FlaskConical className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No experiments available
                </h3>
                <p className="text-muted-foreground">
                  The experiment library is empty.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue={defaultScienceTab} className="w-full">
              <TabsList className="mb-4">
                {scienceLevels.map((level) => (
                  <TabsTrigger
                    key={level}
                    value={level.toString()}
                    className="gap-2"
                  >
                    <Atom className="h-4 w-4" />
                    {scienceGrades[level].name}
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {scienceGrades[level].experiments.length}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              {scienceLevels.map((level) => (
                <TabsContent key={level} value={level.toString()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {scienceGrades[level].experiments.map((exp) => {
                      const SubjectIcon =
                        subjectIcons[exp.subject] || Beaker;
                      const colorClass =
                        subjectColors[exp.subject] ||
                        "bg-gray-100 text-gray-700";

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
                                <Badge
                                  className={`shrink-0 ${colorClass} border-0`}
                                >
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
                                <span>{exp.learningArea.name}</span>
                                {exp.strand && (
                                  <span className="text-pink-600 dark:text-pink-400 font-medium">
                                    {exp.strand.name}
                                  </span>
                                )}
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
        </TabsContent>

        {/* ═══ Social Studies Tab ═══ */}
        <TabsContent value="social-studies">
          {socialStudies.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No activities available
                </h3>
                <p className="text-muted-foreground">
                  Social Studies activities are coming soon.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue={defaultSSTab} className="w-full">
              <TabsList className="mb-4">
                {ssLevels.map((level) => (
                  <TabsTrigger
                    key={level}
                    value={level.toString()}
                    className="gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    {ssGrades[level].name}
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {ssGrades[level].activities.length}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              {ssLevels.map((level) => (
                <TabsContent key={level} value={level.toString()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ssGrades[level].activities.map((act) => {
                      const TypeIcon =
                        activityTypeIcons[act.activityType] || BookOpen;
                      const typeLabel =
                        activityTypeLabels[act.activityType] ||
                        act.activityType;
                      const typeColor =
                        activityTypeColors[act.activityType] ||
                        "bg-gray-100 text-gray-700";

                      return (
                        <Link
                          key={act.id}
                          href={`/activity-forms/social-studies/${act.id}`}
                        >
                          <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer h-full">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-base leading-tight">
                                  {act.name}
                                </CardTitle>
                                <Badge
                                  className={`shrink-0 ${typeColor} border-0`}
                                >
                                  <TypeIcon className="h-3 w-3 mr-1" />
                                  {typeLabel}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-0">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {act.aim}
                              </p>
                              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                                <span>{act.learningArea.name}</span>
                                {act.strand && (
                                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                    {act.strand.name}
                                  </span>
                                )}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
