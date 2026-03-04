"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ─── Create Activity Form ───

export async function createActivityForm(prevState: { error?: string } | null, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const experimentId = formData.get("experimentId") as string;
  const gradeId = formData.get("gradeId") as string;
  const learningAreaId = formData.get("learningAreaId") as string;
  const title = formData.get("title") as string | null;
  const activityDate = formData.get("activityDate") as string;
  const classGroup = formData.get("classGroup") as string | null;
  const observations = formData.get("observations") as string | null;
  const results = formData.get("results") as string | null;
  const teacherNotes = formData.get("teacherNotes") as string | null;
  const status = formData.get("status") as string;

  if (!experimentId || !gradeId || !learningAreaId || !activityDate) {
    return { error: "Missing required fields" };
  }

  try {
    const form = await prisma.activityForm.create({
      data: {
        userId: session.user.id,
        experimentId,
        gradeId,
        learningAreaId,
        title,
        activityDate: new Date(activityDate),
        classGroup,
        observations,
        results,
        teacherNotes,
        status,
      },
    });

    revalidatePath("/activity-forms");
    redirect(`/activity-forms/${form.id}/preview`);
  } catch (error) {
    console.error("Create activity form error:", error);
    return { error: "Failed to create activity form" };
  }
}

// ─── Update Activity Form ───

export async function updateActivityForm(prevState: { error?: string } | null, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const title = formData.get("title") as string | null;
  const activityDate = formData.get("activityDate") as string;
  const classGroup = formData.get("classGroup") as string | null;
  const observations = formData.get("observations") as string | null;
  const results = formData.get("results") as string | null;
  const teacherNotes = formData.get("teacherNotes") as string | null;
  const status = formData.get("status") as string;

  if (!id || !activityDate) {
    return { error: "Missing required fields" };
  }

  try {
    // Verify ownership
    const existing = await prisma.activityForm.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== session.user.id) {
      return { error: "Not found or unauthorized" };
    }

    await prisma.activityForm.update({
      where: { id },
      data: {
        title,
        activityDate: new Date(activityDate),
        classGroup,
        observations,
        results,
        teacherNotes,
        status,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/activity-forms");
    revalidatePath(`/activity-forms/${id}`);
    redirect(`/activity-forms/${id}/preview`);
  } catch (error) {
    console.error("Update activity form error:", error);
    return { error: "Failed to update activity form" };
  }
}

// ─── Delete Activity Form ───

export async function deleteActivityForm(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    // Verify ownership
    const existing = await prisma.activityForm.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== session.user.id) {
      throw new Error("Not found or unauthorized");
    }

    await prisma.activityForm.delete({ where: { id } });

    revalidatePath("/activity-forms");
    redirect("/activity-forms");
  } catch (error) {
    console.error("Delete activity form error:", error);
    throw error;
  }
}

// ─── Duplicate Activity Form ───

export async function duplicateActivityForm(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    // Get original
    const original = await prisma.activityForm.findUnique({
      where: { id },
    });

    if (!original || original.userId !== session.user.id) {
      throw new Error("Not found or unauthorized");
    }

    // Create duplicate
    const duplicate = await prisma.activityForm.create({
      data: {
        userId: session.user.id,
        experimentId: original.experimentId,
        gradeId: original.gradeId,
        learningAreaId: original.learningAreaId,
        title: original.title ? `${original.title} (Copy)` : null,
        activityDate: new Date(), // Set to today
        classGroup: original.classGroup,
        observations: original.observations,
        results: original.results,
        teacherNotes: original.teacherNotes,
        teacherCopy: original.teacherCopy ? original.teacherCopy as any : undefined,
        status: "draft",
      },
    });

    revalidatePath("/activity-forms");
    redirect(`/activity-forms/${duplicate.id}`);
  } catch (error) {
    console.error("Duplicate activity form error:", error);
    throw error;
  }
}
