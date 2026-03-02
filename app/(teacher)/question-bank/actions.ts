"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// ─── Create a question paper with its questions ───

export async function createQuestionPaper(_prev: unknown, formData: FormData) {
  const subject = formData.get("subject") as string;
  const gradeLevel = formData.get("gradeLevel") as string;
  const year = Number(formData.get("year"));
  const term = formData.get("term") ? Number(formData.get("term")) : null;
  const examType = formData.get("examType") as string;
  const school = (formData.get("school") as string) || null;
  const source = (formData.get("source") as string) || null;
  const paperNumber = formData.get("paperNumber") ? Number(formData.get("paperNumber")) : null;
  const totalMarks = formData.get("totalMarks") ? Number(formData.get("totalMarks")) : null;
  const timeMinutes = formData.get("timeMinutes") ? Number(formData.get("timeMinutes")) : null;
  const questionsJson = formData.get("questions") as string;

  if (!subject || !gradeLevel || !year || !examType) {
    return { error: "Subject, grade level, year, and exam type are required." };
  }

  try {
    const questions = questionsJson ? JSON.parse(questionsJson) : [];

    const paper = await prisma.questionPaper.create({
      data: {
        subject,
        gradeLevel,
        year,
        term,
        examType,
        school,
        source,
        paperNumber,
        totalMarks,
        timeMinutes,
        questions: {
          create: questions.map((q: {
            questionNumber: string;
            section?: string;
            text: string;
            marks?: number;
            topic?: string;
            subTopic?: string;
            answer?: string;
            hasImage?: boolean;
            imageUrl?: string;
            subQuestions?: unknown;
          }) => ({
            questionNumber: q.questionNumber,
            section: q.section || null,
            text: q.text,
            marks: q.marks || null,
            topic: q.topic || null,
            subTopic: q.subTopic || null,
            answer: q.answer || null,
            hasImage: q.hasImage || false,
            imageUrl: q.imageUrl || null,
            subQuestions: q.subQuestions || null,
          })),
        },
      },
    });

    redirect(`/question-bank/${paper.id}`);
  } catch (e) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
    return { error: "Failed to create question paper." };
  }
}

// ─── Update a question paper ───

export async function updateQuestionPaper(_prev: unknown, formData: FormData) {
  const id = formData.get("id") as string;
  const subject = formData.get("subject") as string;
  const gradeLevel = formData.get("gradeLevel") as string;
  const year = Number(formData.get("year"));
  const term = formData.get("term") ? Number(formData.get("term")) : null;
  const examType = formData.get("examType") as string;
  const school = (formData.get("school") as string) || null;
  const source = (formData.get("source") as string) || null;
  const paperNumber = formData.get("paperNumber") ? Number(formData.get("paperNumber")) : null;
  const totalMarks = formData.get("totalMarks") ? Number(formData.get("totalMarks")) : null;
  const timeMinutes = formData.get("timeMinutes") ? Number(formData.get("timeMinutes")) : null;
  const questionsJson = formData.get("questions") as string;

  if (!id || !subject || !gradeLevel || !year || !examType) {
    return { error: "Missing required fields." };
  }

  try {
    const questions = questionsJson ? JSON.parse(questionsJson) : [];

    // Delete old questions and recreate
    await prisma.question.deleteMany({ where: { paperId: id } });

    await prisma.questionPaper.update({
      where: { id },
      data: {
        subject,
        gradeLevel,
        year,
        term,
        examType,
        school,
        source,
        paperNumber,
        totalMarks,
        timeMinutes,
        questions: {
          create: questions.map((q: {
            questionNumber: string;
            section?: string;
            text: string;
            marks?: number;
            topic?: string;
            subTopic?: string;
            answer?: string;
            hasImage?: boolean;
            imageUrl?: string;
            subQuestions?: unknown;
          }) => ({
            questionNumber: q.questionNumber,
            section: q.section || null,
            text: q.text,
            marks: q.marks || null,
            topic: q.topic || null,
            subTopic: q.subTopic || null,
            answer: q.answer || null,
            hasImage: q.hasImage || false,
            imageUrl: q.imageUrl || null,
            subQuestions: q.subQuestions || null,
          })),
        },
      },
    });

    redirect(`/question-bank/${id}`);
  } catch (e) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
    return { error: "Failed to update question paper." };
  }
}

// ─── Delete a question paper ───

export async function deleteQuestionPaper(id: string) {
  await prisma.questionPaper.delete({ where: { id } });
  redirect("/question-bank");
}

// ─── Update a single question ───

export async function updateQuestion(data: {
  id: string;
  text: string;
  marks: number | null;
  answer: string | null;
  topic: string | null;
  subTopic: string | null;
  hasImage?: boolean;
  imageUrl?: string | null;
  subQuestions: { label: string; text: string; marks: number | null }[] | null;
}) {
  await prisma.question.update({
    where: { id: data.id },
    data: {
      text: data.text,
      marks: data.marks,
      answer: data.answer,
      topic: data.topic,
      subTopic: data.subTopic,
      subQuestions: data.subQuestions || undefined,
      ...(data.hasImage !== undefined && { hasImage: data.hasImage }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
    },
  });
  return { success: true };
}

// ─── Add a single question to a pool ───

export async function addQuestion(data: {
  paperId: string;
  text: string;
  marks: number | null;
  answer: string | null;
  topic: string | null;
  subTopic: string | null;
  hasImage?: boolean;
  imageUrl?: string | null;
  subQuestions: { label: string; text: string; marks: number | null }[] | null;
}) {
  // Find next question number
  const lastQ = await prisma.question.findFirst({
    where: { paperId: data.paperId },
    orderBy: { questionNumber: "desc" },
  });
  // questionNumber is a string, so parse numerically
  const allQs = await prisma.question.findMany({
    where: { paperId: data.paperId },
    select: { questionNumber: true },
  });
  const maxNum = allQs.reduce((max, q) => {
    const n = Number(q.questionNumber);
    return isNaN(n) ? max : Math.max(max, n);
  }, 0);
  const nextNum = String(maxNum + 1);

  const question = await prisma.question.create({
    data: {
      paperId: data.paperId,
      questionNumber: nextNum,
      text: data.text,
      marks: data.marks,
      answer: data.answer,
      topic: data.topic,
      subTopic: data.subTopic,
      hasImage: data.hasImage || false,
      imageUrl: data.imageUrl || null,
      subQuestions: data.subQuestions || undefined,
    },
  });
  return { success: true, id: question.id, questionNumber: nextNum };
}

// ─── Delete a single question ───

export async function deleteQuestion(id: string) {
  await prisma.question.delete({ where: { id } });
  return { success: true };
}
