import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { AssignmentForm } from "../../assignment-form";
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

export default async function EditAssignmentPage({
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

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit Assignment</h1>
      <AssignmentForm
        initialAssignment={{
          id: assignment.id,
          title: assignment.title,
          gradeId: assignment.gradeId,
          learningAreaId: assignment.learningAreaId,
          assignmentType: assignment.assignmentType,
          term: assignment.term,
          year: assignment.year,
          weekNumber: assignment.weekNumber,
          totalMarks: assignment.totalMarks,
          timeMinutes: assignment.timeMinutes,
          instructions: assignment.instructions,
          strandIds: assignment.strandIds,
          subStrandIds: assignment.subStrandIds,
          sloIds: assignment.sloIds,
          competencyIds: assignment.competencyIds,
          questions: normalizeQuestions(assignment.questions),
          status: assignment.status,
          gradeName: assignment.grade.name,
          learningAreaName: assignment.learningArea.name,
        }}
      />
    </div>
  );
}
