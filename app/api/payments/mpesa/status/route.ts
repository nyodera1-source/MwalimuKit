import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isMpesaEnabled } from "@/lib/mpesa";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const paymentId = request.nextUrl.searchParams.get("paymentId");
  if (!paymentId) {
    return NextResponse.json(
      { enabled: isMpesaEnabled() },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, userId: session.user.id },
    select: { id: true, status: true, product: true, documentId: true, resultDescription: true },
  });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  }

  return NextResponse.json({
    status: payment.status,
    message: payment.resultDescription,
    downloadUrl:
      payment.status === "completed"
        ? payment.product === "lesson_plan"
          ? `/api/lesson-plans/${payment.documentId}/export?format=pdf`
          : `/api/schemes/${payment.documentId}/export`
        : undefined,
  });
}
