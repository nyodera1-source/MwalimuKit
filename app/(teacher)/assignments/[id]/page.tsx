import { redirect } from "next/navigation";

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/assignments/${id}/preview`);
}
