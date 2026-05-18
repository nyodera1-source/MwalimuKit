import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, FileText, Pencil, Trash2 } from "lucide-react";
import { deleteAssignment } from "../../actions";
import type { AssignmentQuestionData } from "../../actions";

function normalizeQuestions(value: unknown): AssignmentQuestionData[] {
  if (!Array.isArray(value)) return [];

  return value.map((question, index) => ({
    id: typeof question?.id === "string" ? question.id : undefined,
    orderNum: Number(question?.orderNum) || index + 1,
    text: typeof question?.text === "string" ? question.text : "",
    marks: Number(question?.marks) || 1,
    answer: typeof question?.answer === "string" ? question.answer : "",
    cognitiveLevel: typeof question?.cognitiveLevel === "string" ? question.cognitiveLevel : "apply",
    source: typeof question?.source === "string" ? question.source : "manual",
  }));
}

async function handleDelete(id: string) {
  "use server";
  await deleteAssignment(id);
}

export default async function AssignmentPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
    },
  });

  if (!assignment || assignment.userId !== session.user.id) notFound();

  const questions = normalizeQuestions(assignment.questions);
  const typeLabels: Record<string, string> = {
    weekly: "Weekly Assignment",
    mid_term: "Mid-Term Assignment",
    end_term: "End-Term Assignment",
  };
  const deleteWithId = handleDelete.bind(null, assignment.id);

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/assignments" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Assignments
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{assignment.title || "Untitled Assignment"}</h1>
          <p className="mt-1 text-muted-foreground">
            {assignment.grade.name} - {assignment.learningArea.name}
          </p>
        </div>
        <Badge variant={assignment.status === "published" ? "default" : "secondary"}>
          {assignment.status}
        </Badge>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link href={`/assignments/${assignment.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Link>
        </Button>
        <Button asChild>
          <a href={`/api/assignments/${assignment.id}/export?format=pdf`} download>
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href={`/api/assignments/${assignment.id}/export?format=answers`} download>
            <FileText className="mr-2 h-4 w-4" /> Answer Guide
          </a>
        </Button>
        <form action={deleteWithId} className="ml-auto">
          <Button type="submit" variant="destructive" size="sm">
            <Trash2 className="mr-1 h-4 w-4" /> Delete
          </Button>
        </form>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="border-b pb-5 text-center">
            <h2 className="text-xl font-bold uppercase">{assignment.title || "Untitled Assignment"}</h2>
            <p className="mt-2 text-sm font-medium">
              {typeLabels[assignment.assignmentType] || "Assignment"}
            </p>
            <p className="text-sm text-muted-foreground">
              {assignment.grade.name} - {assignment.learningArea.name}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Term {assignment.term}, {assignment.year}
              {assignment.assignmentType === "weekly" && assignment.weekNumber ? ` - Week ${assignment.weekNumber}` : ""}
            </p>
            <p className="mt-2 text-sm font-medium">
              {assignment.totalMarks || questions.reduce((sum, q) => sum + q.marks, 0)} marks
              {assignment.timeMinutes ? ` - ${assignment.timeMinutes} minutes` : ""}
            </p>
          </div>

          {assignment.instructions && (
            <p className="mt-5 text-sm italic whitespace-pre-wrap">{assignment.instructions}</p>
          )}

          <div className="mt-6 space-y-5">
            {questions.map((question, index) => (
              <div key={`${question.orderNum}-${index}`} className="flex gap-3 text-sm">
                <span className="font-semibold">{index + 1}.</span>
                <div className="flex-1">
                  <p className="whitespace-pre-wrap">{question.text}</p>
                  {question.answer && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-primary">Show answer guide</summary>
                      <div className="mt-2 rounded-md bg-muted p-2 text-xs whitespace-pre-wrap">{question.answer}</div>
                    </details>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({question.marks} mk{question.marks === 1 ? "" : "s"})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
