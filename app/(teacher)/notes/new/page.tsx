import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NotesForm } from "../notes-form";

export default async function NewNotesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { primaryGradeId: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Teaching Notes</h1>
      <NotesForm defaultGradeId={user?.primaryGradeId} />
    </div>
  );
}
