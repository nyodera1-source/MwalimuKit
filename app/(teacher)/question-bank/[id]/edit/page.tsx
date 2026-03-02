import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PaperForm } from "../../paper-form";

export default async function EditPaperPage({
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
      questions: { orderBy: [{ section: "asc" }, { questionNumber: "asc" }] },
    },
  });

  if (!paper) notFound();

  const defaults = {
    id: paper.id,
    subject: paper.subject,
    gradeLevel: paper.gradeLevel,
    year: paper.year,
    term: paper.term,
    examType: paper.examType,
    school: paper.school,
    source: paper.source,
    paperNumber: paper.paperNumber,
    totalMarks: paper.totalMarks,
    timeMinutes: paper.timeMinutes,
    questions: paper.questions
      .sort((a, b) => Number(a.questionNumber) - Number(b.questionNumber))
      .map((q) => ({
        id: q.id,
        questionNumber: q.questionNumber,
        section: q.section || "",
        text: q.text,
        marks: q.marks,
        topic: q.topic || "",
        subTopic: q.subTopic || "",
        answer: q.answer || "",
        hasImage: q.hasImage,
        imageUrl: q.imageUrl || "",
        subQuestions: (q.subQuestions as { label: string; text: string; marks: number | null }[] | null) || [],
      })),
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/question-bank/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
        <h1 className="text-xl font-bold">Edit Paper</h1>
      </div>
      <PaperForm defaults={defaults} />
    </div>
  );
}
