import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ModuleTile } from "@/components/dashboard/module-tile";
import { RecentDocuments } from "@/components/dashboard/recent-documents";
import { GettingStarted } from "@/components/dashboard/getting-started";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/wordmark";
import { ArrowRight, BookOpen, FileText } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  // Parallel queries for counts + last edited
  const [profile, lessonPlanStats, schemeStats] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { primaryGradeId: true, primaryAreas: true },
    }),
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
  ]);

  // Recent documents: last 5 from each type, merge and sort
  const [recentPlans, recentSchemes] = await Promise.all([
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
  ]);

  const recentDocs = [
    ...recentPlans.map((d) => ({ ...d, type: "lesson-plan" as const })),
    ...recentSchemes.map((d) => ({ ...d, type: "scheme" as const })),
  ]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  const needsProfile =
    !profile?.primaryGradeId || profile.primaryAreas.length === 0;
  const isNewTeacher = recentDocs.length === 0;
  const latestDocument = recentDocs[0] ?? null;

  const modules = [
    {
      title: "Schemes of Work",
      icon: BookOpen,
      count: schemeStats._count,
      lastEdited: schemeStats._max.updatedAt,
      href: "/schemes",
      createHref: "/schemes/new",
      color: "blue" as const,
    },
    {
      title: "Lesson Plans",
      icon: FileText,
      count: lessonPlanStats._count,
      lastEdited: lessonPlanStats._max.updatedAt,
      href: "/lesson-plans",
      createHref: "/lesson-plans/new",
      color: "blue" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
        <div className="flex items-start gap-3">
          <Wordmark size="md" className="mt-0.5 w-[150px]" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              Teacher workspace
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              Welcome back, {session.user.name}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Continue preparing your classroom documents.
            </p>
          </div>
        </div>
      </div>

      {/* A new account has no analytics worth showing. Lead with the action. */}
      {isNewTeacher ? (
        <GettingStarted needsProfile={needsProfile} />
      ) : (
        <>
          {needsProfile && (
            <div className="rounded-lg border border-amber-200/80 bg-amber-50/70 px-4 py-3 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-amber-900">
                  Complete your teaching profile
                </p>
                <p className="text-xs text-amber-800 mt-0.5">
                  Set your main grade and learning areas so MwalimuKit can prefill your document tools.
                </p>
              </div>
              <Button asChild size="sm" className="mt-3 sm:mt-0">
                <Link href="/profile">Update Profile</Link>
              </Button>
            </div>
          )}

          {latestDocument && (
            <section className="rounded-xl border border-blue-200 bg-blue-50/55 p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  {latestDocument.type === "scheme" ? (
                    <BookOpen className="h-5 w-5" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Continue where you left off
                  </p>
                  <h2 className="mt-1 truncate text-base font-semibold text-slate-950">
                    {latestDocument.title || "Untitled document"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Updated {formatDistanceToNow(latestDocument.updatedAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
              <Button asChild size="sm" className="mt-4 shrink-0 sm:mt-0">
                <Link href={`/${latestDocument.type === "scheme" ? "schemes" : "lesson-plans"}/${latestDocument.id}`}>
                  Continue editing
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </section>
          )}

          {/* Module tiles */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {modules.map((m) => (
              <ModuleTile key={m.title} {...m} />
            ))}
          </div>

          {/* Recent documents */}
          <RecentDocuments documents={recentDocs} />
        </>
      )}
    </div>
  );
}
