import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AssignmentForm } from "../assignment-form";

export default async function NewAssignmentPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { primaryGradeId: true },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Create Assignment</h1>
      <AssignmentForm defaultGradeId={user?.primaryGradeId} />
    </div>
  );
}
