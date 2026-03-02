"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { examSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface ExamQuestionData {
  orderNum: number;
  section?: string;
  text: string;
  marks: number;
  imageUrl?: string;
  hasImage?: boolean;
  answer?: string;
  cognitiveLevel?: string;
  sloId?: string;
  subQuestions?: unknown;
  source?: string;
}

export async function createExam(_prev: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const raw = {
    title: formData.get("title"),
    gradeId: formData.get("gradeId"),
    learningAreaId: formData.get("learningAreaId"),
    examType: formData.get("examType"),
    assessmentType: formData.get("assessmentType"),
    term: formData.get("term"),
    year: formData.get("year"),
    totalMarks: formData.get("totalMarks"),
    timeMinutes: formData.get("timeMinutes"),
    instructions: formData.get("instructions"),
    strandIds: formData.get("strandIds"),
    subStrandIds: formData.get("subStrandIds"),
    sloIds: formData.get("sloIds"),
    competencyIds: formData.get("competencyIds"),
    questions: formData.get("questions"),
    status: formData.get("status"),
  };

  const parsed = examSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;
  let questions: ExamQuestionData[] = [];
  try {
    questions = JSON.parse(data.questions);
  } catch {
    return { error: "Invalid questions data." };
  }

  let examId: string;
  try {
    const exam = await prisma.exam.create({
      data: {
        userId: session.user.id,
        gradeId: data.gradeId,
        learningAreaId: data.learningAreaId,
        examType: data.examType,
        assessmentType: data.assessmentType,
        term: data.term,
        year: data.year,
        title: data.title,
        totalMarks: data.totalMarks || null,
        timeMinutes: data.timeMinutes || null,
        instructions: data.instructions || null,
        strandIds: JSON.parse(data.strandIds),
        subStrandIds: JSON.parse(data.subStrandIds),
        sloIds: JSON.parse(data.sloIds),
        competencyIds: JSON.parse(data.competencyIds),
        status: data.status,
        questions: {
          create: questions.map((q) => ({
            orderNum: q.orderNum,
            section: q.section || null,
            text: q.text,
            marks: q.marks,
            imageUrl: q.imageUrl || null,
            hasImage: q.hasImage || false,
            answer: q.answer || null,
            cognitiveLevel: q.cognitiveLevel || null,
            sloId: q.sloId || null,
            subQuestions: q.subQuestions || undefined,
            source: q.source || "ai",
          })),
        },
      },
    });
    examId = exam.id;
  } catch (e) {
    console.error("Create exam error:", e);
    return { error: "Failed to save exam." };
  }

  revalidatePath("/exams");
  redirect(`/exams`);
}

export async function deleteExam(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const exam = await prisma.exam.findUnique({ where: { id }, select: { userId: true } });
  if (!exam || exam.userId !== session.user.id) return { error: "Not found." };

  await prisma.exam.delete({ where: { id } });
  revalidatePath("/exams");
  redirect("/exams");
}
