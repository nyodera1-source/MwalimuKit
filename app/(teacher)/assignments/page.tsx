import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Plus } from "lucide-react";

export default async function AssignmentsPage({
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

  const assignments = await prisma.assignment.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
    },
  });

  const typeLabels: Record<string, string> = {
    weekly: "Weekly",
    mid_term: "Mid-Term",
    end_term: "End-Term",
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <Button asChild>
          <Link href="/assignments/new">
            <Plus className="mr-2 h-4 w-4" />
            New Assignment
          </Link>
        </Button>
      </div>

      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="all" asChild>
            <Link href="/assignments?tab=all">All</Link>
          </TabsTrigger>
          <TabsTrigger value="drafts" asChild>
            <Link href="/assignments?tab=drafts">Drafts</Link>
          </TabsTrigger>
          <TabsTrigger value="published" asChild>
            <Link href="/assignments?tab=published">Published</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {assignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
              <h2 className="mb-2 text-lg font-semibold">No assignments yet</h2>
              <p className="mb-6 max-w-sm text-muted-foreground">
                Create CBC-aligned weekly, mid-term, and end-term assignments that teachers can edit, preview, and print.
              </p>
              <Button asChild>
                <Link href="/assignments/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Assignment
                </Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">Grade</TableHead>
                    <TableHead className="hidden sm:table-cell">Learning Area</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Marks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        <Link href={`/assignments/${assignment.id}/preview`} className="hover:underline">
                          {assignment.title || "Untitled Assignment"}
                        </Link>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {assignment.grade.name} - {assignment.learningArea.name}
                        </p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{assignment.grade.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{assignment.learningArea.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {typeLabels[assignment.assignmentType] || assignment.assignmentType}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{assignment.totalMarks || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={assignment.status === "published" ? "default" : "secondary"}>
                          {assignment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {formatDistanceToNow(assignment.updatedAt, { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/assignments/${assignment.id}/preview`}>Preview</Link>
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
