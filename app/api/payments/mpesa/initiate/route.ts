import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  initiateMpesaPayment,
  isMpesaEnabled,
  isPaidProduct,
  normalizeKenyanPhone,
  PRODUCT_PRICES,
} from "@/lib/mpesa";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  InvalidJsonBodyError,
  RequestBodyTooLargeError,
  readJsonBody,
} from "@/lib/request";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await readJsonBody<{
      product?: string;
      documentId?: string;
      phoneNumber?: string;
    }>(request, 16_384);

    if (!body.product || !isPaidProduct(body.product) || !body.documentId || !body.phoneNumber) {
      return NextResponse.json({ error: "Payment details are incomplete." }, { status: 400 });
    }

    const document =
      body.product === "lesson_plan"
        ? await prisma.lessonPlan.findFirst({
            where: { id: body.documentId, userId: session.user.id },
            select: { id: true },
          })
        : await prisma.schemeOfWork.findFirst({
            where: { id: body.documentId, userId: session.user.id },
            select: { id: true },
          });

    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    const paidPayment = await prisma.payment.findFirst({
      where: {
        userId: session.user.id,
        product: body.product,
        documentId: body.documentId,
        status: "completed",
      },
      select: { id: true },
    });

    if (paidPayment) {
      return NextResponse.json({
        status: "completed",
        paymentId: paidPayment.id,
        downloadUrl:
          body.product === "lesson_plan"
            ? `/api/lesson-plans/${body.documentId}/export?format=pdf`
            : `/api/schemes/${body.documentId}/export`,
      });
    }

    if (!isMpesaEnabled()) {
      return NextResponse.json(
        { error: "M-PESA payments are temporarily paused. Please try again later." },
        { status: 503 }
      );
    }

    const phoneNumber = normalizeKenyanPhone(body.phoneNumber);
    const rate = checkRateLimit(
      `mpesa:${session.user.id}:${body.product}:${body.documentId}`,
      3,
      10 * 60 * 1000,
    );
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many payment attempts. Please wait before trying again." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
      );
    }

    const recentPending = await prisma.payment.findFirst({
      where: {
        userId: session.user.id,
        product: body.product,
        documentId: body.documentId,
        phoneNumber,
        status: "pending",
        checkoutRequestId: { not: null },
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
      },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    if (recentPending) {
      return NextResponse.json({
        status: "pending",
        paymentId: recentPending.id,
        message: "A payment prompt is already active. Check your phone and enter your M-PESA PIN.",
      });
    }

    const prefix = body.product === "lesson_plan" ? "LP" : "SW";
    const accountReference = `MWK${prefix}${body.documentId.slice(-6)}`;
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        product: body.product,
        documentId: body.documentId,
        amount: PRODUCT_PRICES[body.product],
        phoneNumber,
        accountReference,
      },
    });

    try {
      const checkout = await initiateMpesaPayment({
        phoneNumber,
        amount: payment.amount,
        accountReference,
      });

      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          merchantRequestId: checkout.merchantRequestId,
          checkoutRequestId: checkout.checkoutRequestId,
        },
        select: { id: true },
      });

      return NextResponse.json({
        status: "pending",
        paymentId: updatedPayment.id,
        message: checkout.customerMessage,
      });
    } catch (error) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "failed",
          resultDescription: error instanceof Error ? error.message : "M-PESA request failed.",
        },
      });
      throw error;
    }
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ error: error.message }, { status: 413 });
    }
    if (error instanceof InvalidJsonBodyError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not start payment." },
      { status: 400 }
    );
  }
}
