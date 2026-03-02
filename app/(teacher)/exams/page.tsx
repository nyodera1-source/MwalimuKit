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

export default async function ExamsPage({
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

  const exams = await prisma.exam.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      grade: true,
      learningArea: true,
    },
  });

  const assessmentLabels: Record<string, string> = {
    end_term: "End Term",
    mid_term: "Mid-Term",
    cat: "CAT",
    opener: "Opener",
    formative: "Formative",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Assessments</h1>
        <Button asChild>
          <Link href="/exams/new">
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Link>
        </Button>
      </div>

      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="all" asChild>
            <Link href="/exams?tab=all">All</Link>
          </TabsTrigger>
          <TabsTrigger value="drafts" asChild>
            <Link href="/exams?tab=drafts">Drafts</Link>
          </TabsTrigger>
          <TabsTrigger value="published" asChild>
            <Link href="/exams?tab=published">Published</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {exams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold mb-2">No assessments yet</h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Create AI-powered assessments aligned to the CBC curriculum.
                Select your SLOs and let AI generate the questions.
              </p>
              <Button asChild>
                <Link href="/exams/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Assessment
                </Link>
              </Button>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">Grade</TableHead>
                    <TableHead className="hidden sm:table-cell">Subject</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Marks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">
                        <Link href={`/exams/${exam.id}`} className="hover:underline">
                          {exam.title || "Untitled"}
                        </Link>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {exam.grade.name} - {exam.learningArea.name}
                        </p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{exam.grade.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{exam.learningArea.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {assessmentLabels[exam.assessmentType || ""] || exam.examType}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {exam.totalMarks || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={exam.status === "published" ? "default" : "secondary"}>
                          {exam.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden sm:table-cell">
                        {formatDistanceToNow(new Date(exam.updatedAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/exams/${exam.id}`}>View</Link>
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
