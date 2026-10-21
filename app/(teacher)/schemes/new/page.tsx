import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SchemeForm } from "../scheme-form";

export default async function NewSchemePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      schoolName: true,
      primaryGradeId: true,
      primaryAreas: true,
      primaryGrade: { select: { name: true } },
    },
  });

  const defaultLearningArea = user?.primaryGradeId && user.primaryAreas.length > 0
    ? await prisma.learningArea.findFirst({
        where: {
          id: { in: user.primaryAreas },
          gradeId: user.primaryGradeId,
        },
        select: { id: true, name: true },
      })
    : null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Scheme of Work</h1>
      <SchemeForm
        defaultGradeId={user?.primaryGradeId}
        defaultGradeName={user?.primaryGrade?.name}
        defaultLearningAreaId={defaultLearningArea?.id}
        defaultLearningAreaName={defaultLearningArea?.name}
        defaultSchoolName={user?.schoolName}
      />
    </div>
  );
}
