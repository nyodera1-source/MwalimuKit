import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function LessonPlansPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  const tab = params.tab || "all";

  const where: Record<string, unknown> = { userId: session.user.id };
  if (tab === "drafts") where.status = "draft";
  if (tab === "published") where.status = "published";
  if (tab === "templates") where.isTemplate = true;

  const plans = await prisma.lessonPlan.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      isTemplate: true,
      updatedAt: true,
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lesson Plans</h1>
        <Button asChild>
          <Link href="/lesson-plans/new">
            <Plus className="h-4 w-4 mr-2" />
            New Plan
          </Link>
        </Button>
      </div>

      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="all" asChild>
            <Link href="/lesson-plans?tab=all">All</Link>
          </TabsTrigger>
          <TabsTrigger value="drafts" asChild>
            <Link href="/lesson-plans?tab=drafts">Drafts</Link>
          </TabsTrigger>
          <TabsTrigger value="published" asChild>
            <Link href="/lesson-plans?tab=published">Published</Link>
          </TabsTrigger>
          <TabsTrigger value="templates" asChild>
            <Link href="/lesson-plans?tab=templates">Templates</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold mb-2">No lesson plans yet</h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Create your first CBE-aligned lesson plan with guided forms and
                curriculum dropdowns.
              </p>
              <Button asChild>
                <Link href="/lesson-plans/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Plan
                </Link>
              </Button>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/lesson-plans/${plan.id}/preview`}
                          className="hover:underline"
                        >
                          {plan.title || "Untitled Plan"}
                        </Link>
                      </TableCell>
                      <TableCell>{plan.grade.name}</TableCell>
                      <TableCell>{plan.learningArea.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            plan.status === "published" ? "default" : "secondary"
                          }
                        >
                          {plan.status}
                        </Badge>
                        {plan.isTemplate && (
                          <Badge variant="outline" className="ml-1">
                            template
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(new Date(plan.updatedAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/lesson-plans/${plan.id}/preview`}>Edit</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
