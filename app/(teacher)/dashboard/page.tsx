import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ModuleTile } from "@/components/dashboard/module-tile";
import { RecentDocuments } from "@/components/dashboard/recent-documents";
import { FileText, BookOpen, StickyNote, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  // Parallel queries for counts + last edited
  const [lessonPlanStats, schemeStats, notesStats] = await Promise.all([
    prisma.lessonPlan.aggregate({
      where: { userId },
      _count: true,
      _max: { updatedAt: true },
    }),
    prisma.schemeOfWork.aggregate({
      where: { userId },
      _count: true,
      _max: { updatedAt: true },
    }),
    prisma.teachingNotes.aggregate({
      where: { userId },
      _count: true,
      _max: { updatedAt: true },
    }),
  ]);

  // Recent documents: last 5 from each type, merge and sort
  const [recentPlans, recentSchemes, recentNotes] = await Promise.all([
    prisma.lessonPlan.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, updatedAt: true, status: true },
    }),
    prisma.schemeOfWork.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, updatedAt: true, status: true },
    }),
    prisma.teachingNotes.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, updatedAt: true, status: true },
    }),
  ]);

  const recentDocs = [
    ...recentPlans.map((d) => ({ ...d, type: "lesson-plan" as const })),
    ...recentSchemes.map((d) => ({ ...d, type: "scheme" as const })),
    ...recentNotes.map((d) => ({ ...d, type: "notes" as const })),
  ]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  const modules = [
    {
      title: "Lesson Plans",
      icon: FileText,
      count: lessonPlanStats._count,
      lastEdited: lessonPlanStats._max.updatedAt,
      href: "/lesson-plans",
      createHref: "/lesson-plans/new",
      color: "blue" as const,
    },
    {
      title: "Schemes of Work",
      icon: BookOpen,
      count: schemeStats._count,
      lastEdited: schemeStats._max.updatedAt,
      href: "/schemes",
      createHref: "/schemes/new",
      color: "emerald" as const,
    },
    {
      title: "Teaching Notes",
      icon: StickyNote,
      count: notesStats._count,
      lastEdited: notesStats._max.updatedAt,
      href: "/notes",
      createHref: "/notes/new",
      color: "purple" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="gradient-hero rounded-xl p-6 lg:p-8 text-white">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {session.user.name}
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Your CBE teaching toolkit — create lesson plans, schemes of work, and teaching notes.
            </p>
          </div>
        </div>
      </div>

      {/* Module tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m) => (
          <ModuleTile key={m.title} {...m} />
        ))}
      </div>

      {/* Recent documents */}
      <RecentDocuments documents={recentDocs} />
    </div>
  );
}
