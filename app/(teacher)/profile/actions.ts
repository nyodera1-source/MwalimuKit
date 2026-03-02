"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function updateProfile(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const raw = {
    fullName: formData.get("fullName") as string,
    tscNumber: (formData.get("tscNumber") as string) || undefined,
    county: (formData.get("county") as string) || undefined,
    primaryGradeId: (formData.get("primaryGradeId") as string) || undefined,
    primaryAreas: formData.getAll("primaryAreas") as string[],
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      fullName: parsed.data.fullName,
      tscNumber: parsed.data.tscNumber || null,
      county: parsed.data.county || null,
      primaryGradeId: parsed.data.primaryGradeId || null,
      primaryAreas: parsed.data.primaryAreas || [],
    },
  });

  revalidatePath("/profile");
  return { success: "Profile updated successfully" };
}
