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
import { Plus, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function SchemesPage({
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

  const schemes = await prisma.schemeOfWork.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      term: true,
      year: true,
      status: true,
      updatedAt: true,
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Schemes of Work</h1>
        <Button asChild>
          <Link href="/schemes/new">
            <Plus className="h-4 w-4 mr-2" />
            New Scheme
          </Link>
        </Button>
      </div>

      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="all" asChild>
            <Link href="/schemes?tab=all">All</Link>
          </TabsTrigger>
          <TabsTrigger value="drafts" asChild>
            <Link href="/schemes?tab=drafts">Drafts</Link>
          </TabsTrigger>
          <TabsTrigger value="published" asChild>
            <Link href="/schemes?tab=published">Published</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {schemes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold mb-2">No schemes of work yet</h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Create your first term-long scheme of work with weekly planning
                aligned to the CBE curriculum.
              </p>
              <Button asChild>
                <Link href="/schemes/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Scheme
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
                    <TableHead>Term</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schemes.map((scheme) => (
                    <TableRow key={scheme.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/schemes/${scheme.id}/preview`}
                          className="hover:underline"
                        >
                          {scheme.title || "Untitled Scheme"}
                        </Link>
                      </TableCell>
                      <TableCell>{scheme.grade.name}</TableCell>
                      <TableCell>{scheme.learningArea.name}</TableCell>
                      <TableCell>Term {scheme.term}, {scheme.year}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            scheme.status === "published" ? "default" : "secondary"
                          }
                        >
                          {scheme.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(new Date(scheme.updatedAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/schemes/${scheme.id}/preview`}>View</Link>
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
