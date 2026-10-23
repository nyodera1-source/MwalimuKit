import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isMpesaEnabled, queryMpesaPayment } from "@/lib/mpesa";
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
    select: {
      id: true,
      status: true,
      product: true,
      documentId: true,
      resultDescription: true,
      checkoutRequestId: true,
    },
  });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  }

  let status = payment.status;
  let message = payment.resultDescription;

  if (status === "pending" && payment.checkoutRequestId && request.nextUrl.searchParams.get("reconcile") === "1") {
    try {
      const query = await queryMpesaPayment(payment.checkoutRequestId);
      if (query.resultCode === 0) {
        status = "completed";
        message = query.resultDescription || "Payment confirmed.";
        await prisma.payment.updateMany({
          where: { id: payment.id, status: "pending" },
          data: { status, resultCode: query.resultCode, resultDescription: message, paidAt: new Date() },
        });
      } else {
        status = "failed";
        message = query.resultDescription || "The M-PESA payment was not completed.";
        await prisma.payment.updateMany({
          where: { id: payment.id, status: "pending" },
          data: { status, resultCode: query.resultCode, resultDescription: message },
        });
      }
    } catch {
      // Keep polling the callback path if Daraja's query endpoint is unavailable.
    }
  }

  return NextResponse.json({
    status,
    message,
    downloadUrl:
      status === "completed"
        ? payment.product === "lesson_plan"
          ? `/api/lesson-plans/${payment.documentId}/export?format=pdf`
          : `/api/schemes/${payment.documentId}/export`
        : undefined,
  });
}
