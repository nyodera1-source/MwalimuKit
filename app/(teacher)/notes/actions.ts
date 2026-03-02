"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { teachingNotesSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTeachingNotes(
  prevState: unknown,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const raw = {
    title: formData.get("title") as string,
    gradeId: formData.get("gradeId") as string,
    learningAreaId: formData.get("learningAreaId") as string,
    strandId: formData.get("strandId") as string,
    subStrandId: formData.get("subStrandId") as string,
    noteType: formData.get("noteType") as string,
    content: formData.get("content") as string,
    status: formData.get("status") as string,
  };

  const parsed = teachingNotesSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { content: contentStr, ...dbFields } = parsed.data;

  let contentJson: object = {};
  try {
    contentJson = JSON.parse(contentStr);
  } catch {
    return { error: "Invalid content format" };
  }

  const notes = await prisma.teachingNotes.create({
    data: {
      ...dbFields,
      userId: session.user.id,
      content: contentJson,
    },
  });

  revalidatePath("/notes");
  revalidatePath("/dashboard");
  redirect(`/notes/${notes.id}/preview`);
}

export async function updateTeachingNotes(
  prevState: unknown,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const id = formData.get("id") as string;
  if (!id) return { error: "Notes ID is required" };

  const existing = await prisma.teachingNotes.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing || existing.userId !== session.user.id) {
    return { error: "Notes not found" };
  }

  const raw = {
    title: formData.get("title") as string,
    gradeId: formData.get("gradeId") as string,
    learningAreaId: formData.get("learningAreaId") as string,
    strandId: formData.get("strandId") as string,
    subStrandId: formData.get("subStrandId") as string,
    noteType: formData.get("noteType") as string,
    content: formData.get("content") as string,
    status: formData.get("status") as string,
  };

  const parsed = teachingNotesSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { content: contentStr, ...dbFields } = parsed.data;

  let contentJson: object = {};
  try {
    contentJson = JSON.parse(contentStr);
  } catch {
    return { error: "Invalid content format" };
  }

  await prisma.teachingNotes.update({
    where: { id },
    data: {
      ...dbFields,
      content: contentJson,
    },
  });

  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
  revalidatePath("/dashboard");
  redirect(`/notes/${id}/preview`);
}

export async function deleteTeachingNotes(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const existing = await prisma.teachingNotes.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing || existing.userId !== session.user.id) {
    return { error: "Notes not found" };
  }

  await prisma.teachingNotes.delete({ where: { id } });

  revalidatePath("/notes");
  revalidatePath("/dashboard");
  redirect("/notes");
}

export async function duplicateTeachingNotes(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const existing = await prisma.teachingNotes.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return { error: "Notes not found" };
  }

  const newNotes = await prisma.teachingNotes.create({
    data: {
      userId: session.user.id,
      gradeId: existing.gradeId,
      learningAreaId: existing.learningAreaId,
      strandId: existing.strandId,
      subStrandId: existing.subStrandId,
      title: `Copy of ${existing.title || "Untitled Notes"}`,
      noteType: existing.noteType,
      content: existing.content as object,
      status: "draft",
    },
  });

  revalidatePath("/notes");
  revalidatePath("/dashboard");
  redirect(`/notes/${newNotes.id}`);
}
