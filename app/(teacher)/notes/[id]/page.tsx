import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { NotesForm } from "../notes-form";

export default async function EditNotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const notes = await prisma.teachingNotes.findUnique({
    where: { id },
  });

  if (!notes || notes.userId !== session.user.id) notFound();

  const content = (notes.content as Record<string, string>) || {};

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Teaching Notes</h1>
      <NotesForm
        isEdit
        defaults={{
          id: notes.id,
          title: notes.title || "",
          gradeId: notes.gradeId,
          learningAreaId: notes.learningAreaId,
          strandId: notes.strandId,
          subStrandId: notes.subStrandId,
          noteType: notes.noteType,
          content: {
            introduction: content.introduction || "",
            keyConcepts: content.keyConcepts || "",
            detailedExplanations: content.detailedExplanations || "",
            examples: content.examples || "",
            studentActivities: content.studentActivities || "",
            assessmentQuestions: content.assessmentQuestions || "",
            teacherTips: content.teacherTips || "",
          },
          status: notes.status,
        }}
      />
    </div>
  );
}
