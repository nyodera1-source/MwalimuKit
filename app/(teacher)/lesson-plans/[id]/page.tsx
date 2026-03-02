import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { LessonPlanForm } from "../lesson-plan-form";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function EditLessonPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const plan = await prisma.lessonPlan.findUnique({
    where: { id },
  });

  if (!plan || plan.userId !== session.user.id) notFound();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { fullName: true },
  });

  const content = (plan.content as Record<string, unknown>) || {};

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/lesson-plans/${id}/preview`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Preview
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Lesson Plan</h1>
        <Badge variant={plan.status === "published" ? "default" : "secondary"}>
          {plan.status}
        </Badge>
        {plan.isTemplate && <Badge variant="outline">template</Badge>}
      </div>

      <LessonPlanForm
        teacherName={user?.fullName || session.user.name || ""}
        defaults={{
          id: plan.id,
          title: plan.title || "",
          gradeId: plan.gradeId,
          learningAreaId: plan.learningAreaId,
          strandId: plan.strandId,
          subStrandId: plan.subStrandId,
          sloIds: plan.sloIds,
          competencyIds: plan.competencyIds,
          content: content as Record<string, unknown>,
          status: plan.status,
          isTemplate: plan.isTemplate,
        }}
      />
    </div>
  );
}
