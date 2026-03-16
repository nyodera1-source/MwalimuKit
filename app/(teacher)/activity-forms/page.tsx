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
  Palette,
  Music,
  Theater,
  PersonStanding,
  FileCheck,
  Calendar,
  Music2,
  FolderOpen,
  Layers,
} from "lucide-react";

// Sub-type styling configs (for section headers within a learning area)
const subTypeConfig: Record<
  string,
  { icon: typeof Beaker; label: string; color: string; gradient: string }
> = {
  // Science subjects
  Biology: { icon: Leaf, label: "Biology", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", gradient: "from-green-500 to-emerald-500" },
  Chemistry: { icon: Beaker, label: "Chemistry", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", gradient: "from-blue-500 to-cyan-500" },
  Physics: { icon: Zap, label: "Physics", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", gradient: "from-amber-500 to-orange-500" },
  // Social Studies activity types
  map_work: { icon: Map, label: "Map Work", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", gradient: "from-blue-500 to-indigo-500" },
  research: { icon: Search, label: "Research", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", gradient: "from-purple-500 to-violet-500" },
  debate: { icon: MessageSquare, label: "Debate", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", gradient: "from-orange-500 to-red-500" },
  field_study: { icon: Compass, label: "Field Study", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", gradient: "from-green-500 to-teal-500" },
  case_study: { icon: FileText, label: "Case Study", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400", gradient: "from-teal-500 to-cyan-500" },
  // Creative Arts activity types
  visual_art: { icon: Palette, label: "Visual Art", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400", gradient: "from-rose-500 to-pink-500" },
  music: { icon: Music, label: "Music", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400", gradient: "from-violet-500 to-purple-500" },
  drama: { icon: Theater, label: "Drama & Theatre", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", gradient: "from-amber-500 to-yellow-500" },
  dance: { icon: PersonStanding, label: "Dance", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", gradient: "from-emerald-500 to-teal-500" },
  // Creative Arts form types
  adjudication: { icon: FileCheck, label: "Adjudication Form", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", gradient: "from-blue-500 to-cyan-500" },
  rehearsal_plan: { icon: Calendar, label: "Rehearsal Plan", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", gradient: "from-green-500 to-emerald-500" },
  performance_program: { icon: Music2, label: "Performance Program", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", gradient: "from-amber-500 to-orange-500" },
  portfolio_assessment: { icon: FolderOpen, label: "Portfolio Assessment", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", gradient: "from-purple-500 to-violet-500" },
};

// Learning area icons
const learningAreaIcons: Record<string, typeof FlaskConical> = {
  "Biology": Leaf,
  "Chemistry": Beaker,
  "Physics": Zap,
  "Integrated Science": FlaskConical,
  "Science": FlaskConical,
  "Social Studies": BookOpen,
  "History and Government": BookOpen,
  "Geography": Compass,
  "Creative Arts": Palette,
  "Creative Arts and Sports": Palette,
  "Art and Design": Palette,
  "Music": Music,
};

// Learning area accent colors for section headers
const learningAreaAccents = [
  { headerBg: "bg-pink-50 dark:bg-pink-950/30", headerBorder: "border-pink-200 dark:border-pink-800", headerText: "text-pink-700 dark:text-pink-400", hoverText: "group-hover:text-pink-600 dark:group-hover:text-pink-400", strandText: "text-pink-600 dark:text-pink-400" },
  { headerBg: "bg-indigo-50 dark:bg-indigo-950/30", headerBorder: "border-indigo-200 dark:border-indigo-800", headerText: "text-indigo-700 dark:text-indigo-400", hoverText: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400", strandText: "text-indigo-600 dark:text-indigo-400" },
  { headerBg: "bg-purple-50 dark:bg-purple-950/30", headerBorder: "border-purple-200 dark:border-purple-800", headerText: "text-purple-700 dark:text-purple-400", hoverText: "group-hover:text-purple-600 dark:group-hover:text-purple-400", strandText: "text-purple-600 dark:text-purple-400" },
  { headerBg: "bg-emerald-50 dark:bg-emerald-950/30", headerBorder: "border-emerald-200 dark:border-emerald-800", headerText: "text-emerald-700 dark:text-emerald-400", hoverText: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400", strandText: "text-emerald-600 dark:text-emerald-400" },
  { headerBg: "bg-amber-50 dark:bg-amber-950/30", headerBorder: "border-amber-200 dark:border-amber-800", headerText: "text-amber-700 dark:text-amber-400", hoverText: "group-hover:text-amber-600 dark:group-hover:text-amber-400", strandText: "text-amber-600 dark:text-amber-400" },
  { headerBg: "bg-cyan-50 dark:bg-cyan-950/30", headerBorder: "border-cyan-200 dark:border-cyan-800", headerText: "text-cyan-700 dark:text-cyan-400", hoverText: "group-hover:text-cyan-600 dark:group-hover:text-cyan-400", strandText: "text-cyan-600 dark:text-cyan-400" },
  { headerBg: "bg-rose-50 dark:bg-rose-950/30", headerBorder: "border-rose-200 dark:border-rose-800", headerText: "text-rose-700 dark:text-rose-400", hoverText: "group-hover:text-rose-600 dark:group-hover:text-rose-400", strandText: "text-rose-600 dark:text-rose-400" },
];

type UnifiedItem = {
  id: string;
  name: string;
  description: string;
  gradeName: string;
  gradeLevel: number;
  learningArea: string;
  strandName: string | null;
  href: string;
  kind: "experiment" | "social-studies" | "creative-arts" | "creative-arts-form";
  subType?: string;
  artDiscipline?: string;
};

export default async function ActivityFormsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [experiments, socialStudies, creativeArts, creativeArtsForms] =
    await Promise.all([
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
      prisma.creativeArtsActivity.findMany({
        include: {
          grade: { select: { name: true, level: true } },
          learningArea: { select: { name: true } },
          strand: { select: { name: true } },
        },
        orderBy: [{ gradeId: "asc" }, { activityType: "asc" }],
      }),
      prisma.creativeArtsForm.findMany({
        include: {
          grade: { select: { name: true, level: true } },
          learningArea: { select: { name: true } },
          strand: { select: { name: true } },
        },
        orderBy: [{ gradeId: "asc" }, { formType: "asc" }],
      }),
    ]);

  // Unify all items
  const allItems: UnifiedItem[] = [
    ...experiments.map((exp) => ({
      id: exp.id,
      name: exp.name,
      description: exp.aim,
      gradeName: exp.grade.name,
      gradeLevel: exp.grade.level,
      learningArea: exp.learningArea.name,
      strandName: exp.strand?.name ?? null,
      href: `/activity-forms/experiment/${exp.id}`,
      kind: "experiment" as const,
      subType: exp.subject,
    })),
    ...socialStudies.map((act) => ({
      id: act.id,
      name: act.name,
      description: act.aim,
      gradeName: act.grade.name,
      gradeLevel: act.grade.level,
      learningArea: act.learningArea.name,
      strandName: act.strand?.name ?? null,
      href: `/activity-forms/social-studies/${act.id}`,
      kind: "social-studies" as const,
      subType: act.activityType,
    })),
    ...creativeArts.map((act) => ({
      id: act.id,
      name: act.name,
      description: act.aim,
      gradeName: act.grade.name,
      gradeLevel: act.grade.level,
      learningArea: act.learningArea.name,
      strandName: act.strand?.name ?? null,
      href: `/activity-forms/creative-arts/${act.id}`,
      kind: "creative-arts" as const,
      subType: act.activityType,
    })),
    ...creativeArtsForms.map((form) => ({
      id: form.id,
      name: form.name,
      description: form.description,
      gradeName: form.grade.name,
      gradeLevel: form.grade.level,
      learningArea: form.learningArea.name,
      strandName: form.strand?.name ?? null,
      href: `/activity-forms/creative-arts-forms/${form.id}`,
      kind: "creative-arts-form" as const,
      subType: form.formType,
      artDiscipline: form.artDiscipline,
    })),
  ];

  // Group: grade level → learning area → items
  const byGrade: Record<
    number,
    { gradeName: string; learningAreas: Record<string, UnifiedItem[]> }
  > = {};

  for (const item of allItems) {
    if (!byGrade[item.gradeLevel]) {
      byGrade[item.gradeLevel] = { gradeName: item.gradeName, learningAreas: {} };
    }
    const grade = byGrade[item.gradeLevel];
    if (!grade.learningAreas[item.learningArea]) {
      grade.learningAreas[item.learningArea] = [];
    }
    grade.learningAreas[item.learningArea].push(item);
  }

  const gradeLevels = Object.keys(byGrade).map(Number).sort();
  const totalCount = allItems.length;
  const defaultGrade = gradeLevels[0]?.toString() || "7";

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
              Ready-made CBC-aligned practicals and worksheets — pick a grade to start
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
            title: "Pick a Grade",
            desc: "Select your grade to see all available activities",
            color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
          },
          {
            step: "2",
            icon: Eye,
            title: "Browse & Preview",
            desc: "Activities are grouped by learning area for easy browsing",
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

      {totalCount === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-2xl bg-pink-100 dark:bg-pink-900/20 mb-4">
              <Layers className="h-12 w-12 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No activities available yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Activities and practicals are being prepared and will appear here soon.
            </p>
          </CardContent>
        </Card>
      ) : (
        /* ═══ Grade Tabs (single level of tabs) ═══ */
        <Tabs defaultValue={defaultGrade} className="w-full">
          <TabsList className="mb-6 bg-transparent gap-2 p-0">
            {gradeLevels.map((level) => {
              const itemCount = Object.values(byGrade[level].learningAreas).reduce(
                (sum, items) => sum + items.length,
                0
              );
              return (
                <TabsTrigger
                  key={level}
                  value={level.toString()}
                  className="gap-2 rounded-full border border-gray-300 dark:border-gray-600 px-5 py-2.5 text-foreground/80 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:border-pink-600 data-[state=active]:shadow-md data-[state=active]:shadow-pink-500/20 transition-all"
                >
                  {byGrade[level].gradeName}
                  <Badge variant="secondary" className="ml-0.5 text-xs">
                    {itemCount}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {gradeLevels.map((level) => {
            const { learningAreas } = byGrade[level];
            const laNames = Object.keys(learningAreas).sort();

            return (
              <TabsContent key={level} value={level.toString()}>
                <div className="space-y-8">
                  {laNames.map((la, laIdx) => {
                    const items = learningAreas[la];
                    const accent = learningAreaAccents[laIdx % learningAreaAccents.length];
                    const LaIcon = learningAreaIcons[la] || Layers;

                    // Group items by sub-type within this learning area
                    const bySubType: Record<string, UnifiedItem[]> = {};
                    for (const item of items) {
                      const key = item.subType || "other";
                      if (!bySubType[key]) bySubType[key] = [];
                      bySubType[key].push(item);
                    }
                    const subTypes = Object.keys(bySubType).sort();

                    return (
                      <div key={la}>
                        {/* Learning area header */}
                        <div className={`flex items-center gap-3 mb-5 px-4 py-3 rounded-xl border ${accent.headerBg} ${accent.headerBorder}`}>
                          <LaIcon className={`h-5 w-5 ${accent.headerText}`} />
                          <h2 className={`font-semibold ${accent.headerText}`}>{la}</h2>
                          <Badge variant="secondary" className="text-xs">
                            {items.length} {items.length === 1 ? "activity" : "activities"}
                          </Badge>
                        </div>

                        {/* Sub-type sections within this learning area */}
                        <div className="space-y-6 pl-2">
                          {subTypes.map((st) => {
                            const config = subTypeConfig[st] || {
                              icon: FileText,
                              label: st,
                              color: "bg-gray-100 text-gray-700",
                              gradient: "from-gray-500 to-gray-600",
                            };
                            const SubIcon = config.icon;
                            const stItems = bySubType[st];

                            // If there's only one sub-type, skip the sub-header
                            const showSubHeader = subTypes.length > 1;

                            return (
                              <div key={st}>
                                {showSubHeader && (
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className={`p-1.5 rounded-lg ${config.color}`}>
                                      <SubIcon className="h-3.5 w-3.5" />
                                    </div>
                                    <h3 className="font-medium text-sm text-muted-foreground">{config.label}</h3>
                                    <span className="text-xs text-muted-foreground/70">
                                      {stItems.length}
                                    </span>
                                    <div className="flex-1 border-t border-border/50" />
                                  </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {stItems.map((item) => (
                                    <Link key={item.id} href={item.href}>
                                      <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer h-full overflow-hidden group">
                                        <div className={`h-1 bg-gradient-to-r ${config.gradient}`} />
                                        <CardHeader className="pb-2">
                                          <CardTitle className={`text-base leading-tight ${accent.hoverText} transition-colors`}>
                                            {item.name}
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3 pt-0">
                                          <p className="text-sm text-muted-foreground line-clamp-2">
                                            {item.description}
                                          </p>
                                          {(item.strandName || item.artDiscipline) && (
                                            <div className="flex items-center gap-2 pt-3 border-t">
                                              {item.strandName && (
                                                <span className={`text-xs ${accent.strandText} font-medium truncate`}>
                                                  {item.strandName}
                                                </span>
                                              )}
                                              {item.artDiscipline && (
                                                <Badge variant="outline" className="text-xs">
                                                  {item.artDiscipline === "visual_art"
                                                    ? "Visual Art"
                                                    : item.artDiscipline === "mixed"
                                                      ? "Mixed Arts"
                                                      : item.artDiscipline.charAt(0).toUpperCase() + item.artDiscipline.slice(1)}
                                                </Badge>
                                              )}
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}
