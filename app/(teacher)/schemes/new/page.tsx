import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SchemeForm } from "../scheme-form";

export default async function NewSchemePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { primaryGradeId: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Scheme of Work</h1>
      <SchemeForm defaultGradeId={user?.primaryGradeId} />
    </div>
  );
}
