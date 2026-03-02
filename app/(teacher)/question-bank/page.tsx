import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText } from "lucide-react";
import { SearchFilters } from "./search-filters";
import { PdfImportDialog } from "./pdf-import-dialog";

export default async function QuestionBankPage({
  searchParams,
}: {
  searchParams: Promise<{
    subject?: string;
    grade?: string;
    year?: string;
    type?: string;
    q?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;

  // Build filters
  const where: Record<string, unknown> = {};
  if (params.subject) where.subject = { contains: params.subject, mode: "insensitive" };
  if (params.grade) where.gradeLevel = { contains: params.grade, mode: "insensitive" };
  if (params.year) where.year = Number(params.year);
  if (params.type) where.examType = { contains: params.type, mode: "insensitive" };
  if (params.q) {
    where.OR = [
      { subject: { contains: params.q, mode: "insensitive" } },
      { school: { contains: params.q, mode: "insensitive" } },
      { gradeLevel: { contains: params.q, mode: "insensitive" } },
    ];
  }

  const papers = await prisma.questionPaper.findMany({
    where,
    include: { _count: { select: { questions: true } } },
    orderBy: [{ year: "desc" }, { subject: "asc" }],
    take: 100,
  });

  // Get distinct values for dropdown filters
  const allPapers = await prisma.questionPaper.findMany({
    select: { subject: true, gradeLevel: true, year: true, examType: true },
    distinct: ["subject", "gradeLevel", "year", "examType"],
    orderBy: { year: "desc" },
  });

  const subjects = [...new Set(allPapers.map((p) => p.subject))].sort();
  const grades = [...new Set(allPapers.map((p) => p.gradeLevel))].sort();
  const years = [...new Set(allPapers.map((p) => p.year))].sort((a, b) => b - a);
  const examTypes = [...new Set(allPapers.map((p) => p.examType))].sort();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Question Bank</h1>
          <p className="text-sm text-muted-foreground">
            {papers.length} subject{papers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <PdfImportDialog />
          <Button asChild>
            <Link href="/question-bank/new">
              <Plus className="h-4 w-4 mr-2" /> Add Paper
            </Link>
          </Button>
        </div>
      </div>

      {/* Dropdown search & filters */}
      <SearchFilters
        subjects={subjects}
        grades={grades}
        years={years}
        examTypes={examTypes}
      />

      {/* Papers list */}
      {papers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No papers yet</p>
            <p className="text-sm mt-1">Add your first question paper to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {papers.map((paper) => (
            <Link key={paper.id} href={`/question-bank/${paper.id}`}>
              <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{paper.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {paper._count.questions} Q{paper._count.questions !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
