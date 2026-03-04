import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ActivityForm } from "../../activity-form";

export default async function NewActivityFromExperimentPage({
  params,
}: {
  params: Promise<{ experimentId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { experimentId } = await params;

  const exp = await prisma.labExperiment.findUnique({
    where: { id: experimentId },
    include: {
      grade: { select: { name: true } },
      learningArea: { select: { name: true } },
    },
  });

  if (!exp) notFound();

  // Cast JSON fields to proper types for ActivityForm
  const experiment: {
    id: string;
    name: string;
    subject: string;
    gradeId: string;
    learningAreaId: string;
    aim: string;
    materials: string[];
    procedure: string[];
    safetyNotes: string[];
    expectedResults: string;
    relatedConcepts: string[];
    grade: { name: string };
    learningArea: { name: string };
  } = {
    id: exp.id,
    name: exp.name,
    subject: exp.subject,
    gradeId: exp.gradeId,
    learningAreaId: exp.learningAreaId,
    aim: exp.aim,
    materials: Array.isArray(exp.materials) ? exp.materials : [],
    procedure: Array.isArray(exp.procedure) ? exp.procedure : [],
    safetyNotes: Array.isArray(exp.safetyNotes) ? exp.safetyNotes : [],
    expectedResults: exp.expectedResults,
    relatedConcepts: Array.isArray(exp.relatedConcepts) ? exp.relatedConcepts : [],
    grade: exp.grade,
    learningArea: exp.learningArea,
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/activity-forms/new">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Experiments
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">New Activity Form</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the activity details and observations
        </p>
      </div>

      {/* Form */}
      <ActivityForm experiment={experiment} />
    </div>
  );
}
