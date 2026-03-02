"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { lessonPlanSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createLessonPlan(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const raw = {
    title: formData.get("title") as string,
    gradeId: formData.get("gradeId") as string,
    learningAreaId: formData.get("learningAreaId") as string,
    strandId: formData.get("strandId") as string,
    subStrandId: formData.get("subStrandId") as string,
    sloIds: formData.getAll("sloIds") as string[],
    competencyIds: formData.getAll("competencyIds") as string[],
    date: formData.get("date") as string,
    duration: formData.get("duration") as string,
    objectives: formData.get("objectives") as string,
    keyInquiryQuestion: formData.get("keyInquiryQuestion") as string,
    resources: formData.get("resources") as string,
    digitalResources: formData.get("digitalResources") as string,
    activitiesIntroduction: formData.get("activitiesIntroduction") as string,
    activitiesDevelopment: formData.get("activitiesDevelopment") as string,
    activitiesConclusion: formData.get("activitiesConclusion") as string,
    assessmentStrategy: formData.get("assessmentStrategy") as string,
    assessmentDescription: formData.get("assessmentDescription") as string,
    reflection: formData.get("reflection") as string,
    status: formData.get("status") as string,
    isTemplate: formData.get("isTemplate") === "true",
  };

  const parsed = lessonPlanSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { date, duration, objectives, keyInquiryQuestion, resources, digitalResources,
    activitiesIntroduction, activitiesDevelopment, activitiesConclusion,
    assessmentStrategy, assessmentDescription, reflection,
    ...dbFields } = parsed.data;

  const plan = await prisma.lessonPlan.create({
    data: {
      ...dbFields,
      userId: session.user.id,
      content: {
        date,
        duration,
        objectives,
        keyInquiryQuestion,
        resources,
        digitalResources,
        activities: {
          introduction: activitiesIntroduction,
          development: activitiesDevelopment,
          conclusion: activitiesConclusion,
        },
        assessmentStrategy,
        assessmentDescription,
        reflection,
      },
    },
  });

  revalidatePath("/lesson-plans");
  revalidatePath("/dashboard");
  redirect(`/lesson-plans/${plan.id}/preview`);
}

export async function updateLessonPlan(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const id = formData.get("id") as string;
  if (!id) return { error: "Plan ID is required" };

  const existing = await prisma.lessonPlan.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing || existing.userId !== session.user.id) {
    return { error: "Plan not found" };
  }

  const raw = {
    title: formData.get("title") as string,
    gradeId: formData.get("gradeId") as string,
    learningAreaId: formData.get("learningAreaId") as string,
    strandId: formData.get("strandId") as string,
    subStrandId: formData.get("subStrandId") as string,
    sloIds: formData.getAll("sloIds") as string[],
    competencyIds: formData.getAll("competencyIds") as string[],
    date: formData.get("date") as string,
    duration: formData.get("duration") as string,
    objectives: formData.get("objectives") as string,
    keyInquiryQuestion: formData.get("keyInquiryQuestion") as string,
    resources: formData.get("resources") as string,
    digitalResources: formData.get("digitalResources") as string,
    activitiesIntroduction: formData.get("activitiesIntroduction") as string,
    activitiesDevelopment: formData.get("activitiesDevelopment") as string,
    activitiesConclusion: formData.get("activitiesConclusion") as string,
    assessmentStrategy: formData.get("assessmentStrategy") as string,
    assessmentDescription: formData.get("assessmentDescription") as string,
    reflection: formData.get("reflection") as string,
    status: formData.get("status") as string,
    isTemplate: formData.get("isTemplate") === "true",
  };

  const parsed = lessonPlanSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { date, duration, objectives, keyInquiryQuestion, resources, digitalResources,
    activitiesIntroduction, activitiesDevelopment, activitiesConclusion,
    assessmentStrategy, assessmentDescription, reflection,
    ...dbFields } = parsed.data;

  await prisma.lessonPlan.update({
    where: { id },
    data: {
      ...dbFields,
      content: {
        date,
        duration,
        objectives,
        keyInquiryQuestion,
        resources,
        digitalResources,
        activities: {
          introduction: activitiesIntroduction,
          development: activitiesDevelopment,
          conclusion: activitiesConclusion,
        },
        assessmentStrategy,
        assessmentDescription,
        reflection,
      },
    },
  });

  revalidatePath("/lesson-plans");
  revalidatePath(`/lesson-plans/${id}`);
  revalidatePath("/dashboard");
  redirect(`/lesson-plans/${id}/preview`);
}

export async function publishLessonPlan(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const existing = await prisma.lessonPlan.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing || existing.userId !== session.user.id) {
    return { error: "Plan not found" };
  }

  await prisma.lessonPlan.update({
    where: { id },
    data: { status: "published" },
  });

  revalidatePath("/lesson-plans");
  revalidatePath(`/lesson-plans/${id}`);
  revalidatePath("/dashboard");
  redirect(`/lesson-plans/${id}/preview`);
}

export async function deleteLessonPlan(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const existing = await prisma.lessonPlan.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing || existing.userId !== session.user.id) {
    return { error: "Plan not found" };
  }

  await prisma.lessonPlan.delete({ where: { id } });

  revalidatePath("/lesson-plans");
  revalidatePath("/dashboard");
  redirect("/lesson-plans");
}

export async function duplicateLessonPlan(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const existing = await prisma.lessonPlan.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return { error: "Plan not found" };
  }

  const newPlan = await prisma.lessonPlan.create({
    data: {
      userId: session.user.id,
      gradeId: existing.gradeId,
      learningAreaId: existing.learningAreaId,
      strandId: existing.strandId,
      subStrandId: existing.subStrandId,
      sloIds: existing.sloIds,
      competencyIds: existing.competencyIds,
      title: `Copy of ${existing.title || "Untitled Plan"}`,
      content: existing.content as object,
      status: "draft",
      isTemplate: false,
    },
  });

  revalidatePath("/lesson-plans");
  revalidatePath("/dashboard");
  redirect(`/lesson-plans/${newPlan.id}`);
}
