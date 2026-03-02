"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { schemeOfWorkSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSchemeOfWork(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const raw = {
    title: formData.get("title") as string,
    gradeId: formData.get("gradeId") as string,
    learningAreaId: formData.get("learningAreaId") as string,
    term: formData.get("term") as string,
    year: formData.get("year") as string,
    schemeData: formData.get("schemeData") as string,
    status: formData.get("status") as string,
  };

  const parsed = schemeOfWorkSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  let schemeData: unknown;
  try {
    schemeData = JSON.parse(parsed.data.schemeData);
  } catch {
    return { error: "Invalid scheme data" };
  }

  const scheme = await prisma.schemeOfWork.create({
    data: {
      userId: session.user.id,
      gradeId: parsed.data.gradeId,
      learningAreaId: parsed.data.learningAreaId,
      term: parsed.data.term,
      year: parsed.data.year,
      title: parsed.data.title,
      weeks: schemeData as object,
      status: parsed.data.status,
    },
  });

  revalidatePath("/schemes");
  revalidatePath("/dashboard");
  redirect(`/schemes/${scheme.id}/preview`);
}

export async function updateSchemeOfWork(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const id = formData.get("id") as string;
  if (!id) return { error: "Scheme ID is required" };

  const existing = await prisma.schemeOfWork.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing || existing.userId !== session.user.id) {
    return { error: "Scheme not found" };
  }

  const raw = {
    title: formData.get("title") as string,
    gradeId: formData.get("gradeId") as string,
    learningAreaId: formData.get("learningAreaId") as string,
    term: formData.get("term") as string,
    year: formData.get("year") as string,
    schemeData: formData.get("schemeData") as string,
    status: formData.get("status") as string,
  };

  const parsed = schemeOfWorkSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  let schemeData: unknown;
  try {
    schemeData = JSON.parse(parsed.data.schemeData);
  } catch {
    return { error: "Invalid scheme data" };
  }

  await prisma.schemeOfWork.update({
    where: { id },
    data: {
      gradeId: parsed.data.gradeId,
      learningAreaId: parsed.data.learningAreaId,
      term: parsed.data.term,
      year: parsed.data.year,
      title: parsed.data.title,
      weeks: schemeData as object,
      status: parsed.data.status,
    },
  });

  revalidatePath("/schemes");
  revalidatePath(`/schemes/${id}`);
  revalidatePath("/dashboard");
  redirect(`/schemes/${id}/preview`);
}

export async function deleteSchemeOfWork(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const existing = await prisma.schemeOfWork.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing || existing.userId !== session.user.id) {
    return { error: "Scheme not found" };
  }

  await prisma.schemeOfWork.delete({ where: { id } });

  revalidatePath("/schemes");
  revalidatePath("/dashboard");
  redirect("/schemes");
}
