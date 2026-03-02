import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      fullName: true,
      email: true,
      tscNumber: true,
      county: true,
      primaryGradeId: true,
      primaryAreas: true,
    },
  });

  if (!user) redirect("/login");

  const grades = await prisma.grade.findMany({
    orderBy: { level: "asc" },
    select: { id: true, name: true },
  });

  // If user has a primary grade, fetch its learning areas
  let learningAreas: { id: string; name: string }[] = [];
  if (user.primaryGradeId) {
    learningAreas = await prisma.learningArea.findMany({
      where: { gradeId: user.primaryGradeId },
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    });
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <ProfileForm
        user={user}
        grades={grades}
        initialLearningAreas={learningAreas}
      />
    </div>
  );
}
