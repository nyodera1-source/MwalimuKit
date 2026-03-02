import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { QuestionList } from "../question-list";

export default async function ViewPaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const paper = await prisma.questionPaper.findUnique({
    where: { id },
    include: {
      questions: true,
    },
  });

  if (!paper) notFound();

  const questions = paper.questions
    .sort((a, b) => Number(a.questionNumber) - Number(b.questionNumber))
    .map((q) => ({
    id: q.id,
    questionNumber: q.questionNumber,
    text: q.text,
    marks: q.marks,
    hasImage: q.hasImage,
    imageUrl: q.imageUrl,
    topic: q.topic,
    subTopic: q.subTopic,
    answer: q.answer,
    subQuestions: (q.subQuestions as { label: string; text: string; marks: number | null }[] | null),
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/question-bank">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">{paper.subject}</h1>
          <p className="text-sm text-muted-foreground">
            {paper.questions.length} question{paper.questions.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {questions.length > 0 ? (
        <QuestionList questions={questions} paperId={paper.id} />
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No questions in this pool yet.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
