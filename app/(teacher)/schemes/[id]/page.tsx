import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SchemeForm } from "../scheme-form";
import type { SchemeConfig } from "@/lib/export/scheme-of-work-types";

export default async function EditSchemePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const scheme = await prisma.schemeOfWork.findUnique({
    where: { id },
  });

  if (!scheme || scheme.userId !== session.user.id) notFound();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { primaryGradeId: true },
  });

  const schemeData = (scheme.weeks as unknown as SchemeConfig) || undefined;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/schemes/${id}/preview`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Preview
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Scheme of Work</h1>
      </div>
      <SchemeForm
        defaultGradeId={user?.primaryGradeId}
        defaults={{
          id: scheme.id,
          title: scheme.title || undefined,
          gradeId: scheme.gradeId,
          learningAreaId: scheme.learningAreaId,
          term: scheme.term,
          year: scheme.year,
          schemeData: schemeData || undefined,
          status: scheme.status,
        }}
      />
    </div>
  );
}
