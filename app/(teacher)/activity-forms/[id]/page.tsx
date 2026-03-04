import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ActivityForm } from "../activity-form";

export default async function EditActivityFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const form = await prisma.activityForm.findUnique({
    where: { id },
    include: {
      experiment: {
        include: {
          grade: { select: { name: true } },
          learningArea: { select: { name: true } },
        },
      },
    },
  });

  if (!form || form.userId !== session.user.id) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/activity-forms">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Activity Forms
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Activity Form</h1>
        <p className="text-muted-foreground mt-1">
          Update the activity details and observations
        </p>
      </div>

      {/* Form */}
      <ActivityForm
        experiment={form.experiment}
        defaults={{
          id: form.id,
          title: form.title,
          activityDate: form.activityDate,
          classGroup: form.classGroup,
          observations: form.observations,
          results: form.results,
          teacherNotes: form.teacherNotes,
          status: form.status,
        }}
        isEdit
      />
    </div>
  );
}
