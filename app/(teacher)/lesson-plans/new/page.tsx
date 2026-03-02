import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LessonPlanForm } from "../lesson-plan-form";

export default async function NewLessonPlanPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { fullName: true, primaryGradeId: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Lesson Plan</h1>
      <LessonPlanForm
        teacherName={user?.fullName || session.user.name || ""}
        defaultGradeId={user?.primaryGradeId}
      />
    </div>
  );
}
