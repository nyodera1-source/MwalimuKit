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
  Zap,
  Leaf,
  BookOpen,
  Map,
  Search,
  MessageSquare,
  Compass,
  FileText,
  ArrowRight,
  Download,
  Eye,
  GraduationCap,
} from "lucide-react";

// Science subject styling
const subjectConfig: Record<
  string,
  { icon: typeof Beaker; color: string; gradient: string }
> = {
  Biology: {
    icon: Leaf,
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    gradient: "from-green-500 to-emerald-500",
  },
  Chemistry: {
    icon: Beaker,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    gradient: "from-blue-500 to-cyan-500",
  },
  Physics: {
    icon: Zap,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    gradient: "from-amber-500 to-orange-500",
  },
};

// Social Studies activity type styling
const activityTypeConfig: Record<
  string,
  { icon: typeof BookOpen; label: string; color: string; gradient: string }
> = {
  map_work: {
    icon: Map,
    label: "Map Work",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    gradient: "from-blue-500 to-indigo-500",
  },
  research: {
    icon: Search,
    label: "Research",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    gradient: "from-purple-500 to-violet-500",
  },
  debate: {
    icon: MessageSquare,
    label: "Debate",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    gradient: "from-orange-500 to-red-500",
  },
  field_study: {
    icon: Compass,
    label: "Field Study",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    gradient: "from-green-500 to-teal-500",
  },
  case_study: {
    icon: FileText,
    label: "Case Study",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    gradient: "from-teal-500 to-cyan-500",
  },
};

export default async function ActivityFormsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

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
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20">
            <FlaskConical className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Activity Forms</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Ready-made CBC-aligned practicals and worksheets for your students
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {[
          {
            step: "1",
            icon: GraduationCap,
            title: "Browse Activities",
            desc: "Select a grade and browse available experiments or activities",
            color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
          },
          {
            step: "2",
            icon: Eye,
            title: "Preview Details",
            desc: "View the aim, materials, and a brief preview of each activity",
            color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
          },
          {
            step: "3",
            icon: Download,
            title: "Download PDF",
            desc: "Get student worksheets and teacher guides as formatted PDFs",
            color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
          },
        ].map((item) => (
          <Card
            key={item.step}
            className="relative overflow-hidden group hover:shadow-md transition-shadow"
          >
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${item.color} shrink-0`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </CardContent>
            {item.step !== "3" && (
              <div className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/30">
                <ArrowRight className="h-5 w-5" />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Top-level subject area tabs */}
      <Tabs defaultValue="science" className="w-full">
        <TabsList className="mb-6 h-11">
          <TabsTrigger value="science" className="gap-2 px-5">
            <FlaskConical className="h-4 w-4" />
            Science Practicals
            <Badge
              variant="secondary"
              className="ml-1 text-xs bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
            >
              {experiments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="social-studies" className="gap-2 px-5">
            <BookOpen className="h-4 w-4" />
            Social Studies
            <Badge
              variant="secondary"
              className="ml-1 text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
            >
              {socialStudies.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* ═══ Science Practicals Tab ═══ */}
        <TabsContent value="science">
          {experiments.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 rounded-2xl bg-pink-100 dark:bg-pink-900/20 mb-4">
                  <FlaskConical className="h-12 w-12 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No experiments available yet
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Science practicals are being prepared and will appear here
                  soon.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue={defaultScienceTab} className="w-full">
              <TabsList className="mb-5 bg-transparent gap-2 p-0">
                {scienceLevels.map((level) => (
                  <TabsTrigger
                    key={level}
                    value={level.toString()}
                    className="gap-2 rounded-full border border-border px-4 py-2 data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:border-pink-600 data-[state=active]:shadow-md data-[state=active]:shadow-pink-500/20 transition-all"
                  >
                    {scienceGrades[level].name}
                    <Badge
                      variant="secondary"
                      className="ml-0.5 text-xs data-[state=active]:bg-white/20 data-[state=active]:text-white pointer-events-none"
                    >
                      {scienceGrades[level].experiments.length}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              {scienceLevels.map((level) => (
                <TabsContent key={level} value={level.toString()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {scienceGrades[level].experiments.map((exp) => {
                      const config = subjectConfig[exp.subject] || {
                        icon: Beaker,
                        color: "bg-gray-100 text-gray-700",
                        gradient: "from-gray-500 to-gray-600",
                      };
                      const SubjectIcon = config.icon;

                      return (
                        <Link
                          key={exp.id}
                          href={`/activity-forms/experiment/${exp.id}`}
                        >
                          <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer h-full overflow-hidden group">
                            {/* Colored top bar */}
                            <div
                              className={`h-1 bg-gradient-to-r ${config.gradient}`}
                            />
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-base leading-tight group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                                  {exp.name}
                                </CardTitle>
                                <Badge
                                  className={`shrink-0 ${config.color} border-0`}
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
                              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                                <span className="flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  {exp.learningArea.name}
                                </span>
                                {exp.strand && (
                                  <span className="text-pink-600 dark:text-pink-400 font-medium truncate max-w-[140px]">
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
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 rounded-2xl bg-indigo-100 dark:bg-indigo-900/20 mb-4">
                  <BookOpen className="h-12 w-12 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No activities available yet
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Social Studies activities are being prepared and will appear
                  here soon.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue={defaultSSTab} className="w-full">
              <TabsList className="mb-5 bg-transparent gap-2 p-0">
                {ssLevels.map((level) => (
                  <TabsTrigger
                    key={level}
                    value={level.toString()}
                    className="gap-2 rounded-full border border-border px-4 py-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:border-indigo-600 data-[state=active]:shadow-md data-[state=active]:shadow-indigo-500/20 transition-all"
                  >
                    {ssGrades[level].name}
                    <Badge
                      variant="secondary"
                      className="ml-0.5 text-xs data-[state=active]:bg-white/20 data-[state=active]:text-white pointer-events-none"
                    >
                      {ssGrades[level].activities.length}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              {ssLevels.map((level) => (
                <TabsContent key={level} value={level.toString()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ssGrades[level].activities.map((act) => {
                      const config = activityTypeConfig[act.activityType] || {
                        icon: BookOpen,
                        label: act.activityType,
                        color: "bg-gray-100 text-gray-700",
                        gradient: "from-gray-500 to-gray-600",
                      };
                      const TypeIcon = config.icon;

                      return (
                        <Link
                          key={act.id}
                          href={`/activity-forms/social-studies/${act.id}`}
                        >
                          <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer h-full overflow-hidden group">
                            {/* Colored top bar */}
                            <div
                              className={`h-1 bg-gradient-to-r ${config.gradient}`}
                            />
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-base leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {act.name}
                                </CardTitle>
                                <Badge
                                  className={`shrink-0 ${config.color} border-0`}
                                >
                                  <TypeIcon className="h-3 w-3 mr-1" />
                                  {config.label}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-0">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {act.aim}
                              </p>
                              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                                <span className="flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  {act.learningArea.name}
                                </span>
                                {act.strand && (
                                  <span className="text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[140px]">
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
