import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, FileText, Trash2 } from "lucide-react";
import { deleteExam } from "../actions";

async function handleDelete(id: string) {
  "use server";
  await deleteExam(id);
}

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const exam = await prisma.exam.findUnique({
    where: { id },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
      questions: { orderBy: { orderNum: "asc" } },
    },
  });

  if (!exam || exam.userId !== session.user.id) notFound();

  const assessmentLabels: Record<string, string> = {
    end_term: "End of Term",
    mid_term: "Mid-Term",
    cat: "CAT",
    opener: "Opener",
    formative: "Formative",
  };

  const deleteWithId = handleDelete.bind(null, exam.id);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link href="/exams" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Assessments
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{exam.title}</h1>
          <p className="text-muted-foreground mt-1">
            {exam.grade.name} - {exam.learningArea.name} | Term {exam.term}, {exam.year}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={exam.status === "published" ? "default" : "secondary"} className="h-6">
            {exam.status}
          </Badge>
        </div>
      </div>

      {/* Meta info */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Type</p>
              <p className="font-medium">{assessmentLabels[exam.assessmentType || ""] || exam.examType}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Marks</p>
              <p className="font-medium">{exam.totalMarks || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-medium">{exam.timeMinutes ? `${exam.timeMinutes} min` : "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Questions</p>
              <p className="font-medium">{exam.questions.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      {exam.instructions && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase font-medium mb-2">Instructions</p>
            <p className="text-sm whitespace-pre-wrap">{exam.instructions}</p>
          </CardContent>
        </Card>
      )}

      {/* Questions */}
      <div className="space-y-3 mb-6">
        <h2 className="font-semibold">Questions</h2>
        {exam.questions.map((q) => (
          <Card key={q.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="font-bold text-sm shrink-0">Q{q.orderNum}.</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm whitespace-pre-wrap">{q.text}</p>

                  {/* Sub-questions */}
                  {q.subQuestions && Array.isArray(q.subQuestions) && (q.subQuestions as { label: string; text: string; marks: number }[]).length > 0 && (
                    <div className="ml-3 mt-2 space-y-1">
                      {(q.subQuestions as { label: string; text: string; marks: number }[]).map((sq, si) => (
                        <p key={si} className="text-xs text-muted-foreground">
                          <span className="font-medium">({sq.label})</span> {sq.text}
                          {sq.marks > 0 && <span className="ml-1">[{sq.marks}mks]</span>}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Image */}
                  {q.hasImage && q.imageUrl && (
                    <img src={q.imageUrl} alt="Question diagram" className="mt-2 max-h-40 rounded border" />
                  )}

                  {/* Answer (collapsible via details) */}
                  {q.answer && (
                    <details className="mt-2">
                      <summary className="text-xs text-primary cursor-pointer">Show answer</summary>
                      <div className="mt-1 p-2 bg-muted rounded text-xs whitespace-pre-wrap">{q.answer}</div>
                    </details>
                  )}
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <Badge variant="outline" className="text-xs">{q.marks}mk{q.marks !== 1 ? "s" : ""}</Badge>
                  {q.section && <Badge variant="secondary" className="text-xs">Sec {q.section}</Badge>}
                  {q.cognitiveLevel && (
                    <span className="text-xs text-muted-foreground">{q.cognitiveLevel}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 border-t pt-4">
        <Button asChild variant="outline">
          <a href={`/api/exams/${exam.id}/export?format=pdf`} download>
            <Download className="h-4 w-4 mr-2" /> Download PDF
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href={`/api/exams/${exam.id}/export?format=marking-scheme`} download>
            <FileText className="h-4 w-4 mr-2" /> Marking Scheme
          </a>
        </Button>
        <form action={deleteWithId} className="ml-auto">
          <Button type="submit" variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </form>
      </div>
    </div>
  );
}
