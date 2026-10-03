import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ModuleTile } from "@/components/dashboard/module-tile";
import { RecentDocuments } from "@/components/dashboard/recent-documents";
import { GettingStarted } from "@/components/dashboard/getting-started";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo-mark";
import { FileText, BookOpen } from "lucide-react";

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
      {/* Welcome banner */}
      <div className="gradient-hero rounded-xl p-6 lg:p-8 text-white">
        <div className="flex items-start gap-3">
          <LogoMark size="lg" className="mt-0.5" />
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {session.user.name}
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Create curriculum-aligned schemes of work and lesson plans.
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
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 sm:flex sm:items-center sm:justify-between">
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

          {/* Module tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
