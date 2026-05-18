"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assignmentSchema } from "@/lib/validations";
import type { Prisma } from "@/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface AssignmentQuestionData {
  id?: string;
  orderNum: number;
  text: string;
  marks: number;
  answer?: string;
  cognitiveLevel?: string;
  source?: string;
}

function parseJsonArray(value: string, fallback: string[] = []) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function parseQuestions(value: string): AssignmentQuestionData[] {
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error("Questions must be an array.");

  return parsed
    .filter((q) => typeof q?.text === "string" && q.text.trim().length > 0)
    .map((q, index) => ({
      id: typeof q.id === "string" ? q.id : undefined,
      orderNum: index + 1,
      text: q.text.trim(),
      marks: Number(q.marks) > 0 ? Number(q.marks) : 1,
      answer: typeof q.answer === "string" ? q.answer : "",
      cognitiveLevel: typeof q.cognitiveLevel === "string" ? q.cognitiveLevel : "apply",
      source: typeof q.source === "string" ? q.source : "manual",
    }));
}

function toJsonInput(value: AssignmentQuestionData[]): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function saveAssignment(_prev: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const raw = {
    title: formData.get("title"),
    gradeId: formData.get("gradeId"),
    learningAreaId: formData.get("learningAreaId"),
    assignmentType: formData.get("assignmentType"),
    term: formData.get("term"),
    year: formData.get("year"),
    weekNumber: formData.get("weekNumber"),
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

  const parsed = assignmentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  let questions: AssignmentQuestionData[];
  try {
    questions = parseQuestions(parsed.data.questions);
  } catch {
    return { error: "Invalid assignment questions." };
  }

  if (questions.length === 0) {
    return { error: "Add at least one question before saving." };
  }

  let assignmentId: string;
  try {
    const assignment = await prisma.assignment.create({
      data: {
        userId: session.user.id,
        gradeId: parsed.data.gradeId,
        learningAreaId: parsed.data.learningAreaId,
        assignmentType: parsed.data.assignmentType,
        term: parsed.data.term,
        year: parsed.data.year,
        weekNumber: parsed.data.weekNumber === "" ? null : parsed.data.weekNumber || null,
        title: parsed.data.title,
        totalMarks: parsed.data.totalMarks || null,
        timeMinutes: parsed.data.timeMinutes || null,
        instructions: parsed.data.instructions || null,
        strandIds: parseJsonArray(parsed.data.strandIds),
        subStrandIds: parseJsonArray(parsed.data.subStrandIds),
        sloIds: parseJsonArray(parsed.data.sloIds),
        competencyIds: parseJsonArray(parsed.data.competencyIds),
        questions: toJsonInput(questions),
        status: parsed.data.status,
      },
    });
    assignmentId = assignment.id;
  } catch (error) {
    console.error("Create assignment error:", error);
    return { error: "Failed to save assignment." };
  }

  revalidatePath("/assignments");
  revalidatePath("/dashboard");
  redirect(`/assignments/${assignmentId}/preview`);
}

export async function updateAssignment(id: string, _prev: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const existing = await prisma.assignment.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing || existing.userId !== session.user.id) return { error: "Assignment not found." };

  const raw = {
    title: formData.get("title"),
    gradeId: formData.get("gradeId"),
    learningAreaId: formData.get("learningAreaId"),
    assignmentType: formData.get("assignmentType"),
    term: formData.get("term"),
    year: formData.get("year"),
    weekNumber: formData.get("weekNumber"),
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

  const parsed = assignmentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  let questions: AssignmentQuestionData[];
  try {
    questions = parseQuestions(parsed.data.questions);
  } catch {
    return { error: "Invalid assignment questions." };
  }

  if (questions.length === 0) {
    return { error: "Add at least one question before saving." };
  }

  try {
    await prisma.assignment.update({
      where: { id },
      data: {
        gradeId: parsed.data.gradeId,
        learningAreaId: parsed.data.learningAreaId,
        assignmentType: parsed.data.assignmentType,
        term: parsed.data.term,
        year: parsed.data.year,
        weekNumber: parsed.data.weekNumber === "" ? null : parsed.data.weekNumber || null,
        title: parsed.data.title,
        totalMarks: parsed.data.totalMarks || null,
        timeMinutes: parsed.data.timeMinutes || null,
        instructions: parsed.data.instructions || null,
        strandIds: parseJsonArray(parsed.data.strandIds),
        subStrandIds: parseJsonArray(parsed.data.subStrandIds),
        sloIds: parseJsonArray(parsed.data.sloIds),
        competencyIds: parseJsonArray(parsed.data.competencyIds),
        questions: toJsonInput(questions),
        status: parsed.data.status,
      },
    });
  } catch (error) {
    console.error("Update assignment error:", error);
    return { error: "Failed to update assignment." };
  }

  revalidatePath("/assignments");
  revalidatePath(`/assignments/${id}`);
  revalidatePath(`/assignments/${id}/preview`);
  revalidatePath("/dashboard");
  redirect(`/assignments/${id}/preview`);
}

export async function deleteAssignment(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!assignment || assignment.userId !== session.user.id) return { error: "Not found." };

  await prisma.assignment.delete({ where: { id } });
  revalidatePath("/assignments");
  revalidatePath("/dashboard");
  redirect("/assignments");
}
