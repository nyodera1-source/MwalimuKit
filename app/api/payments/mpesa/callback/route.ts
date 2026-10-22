import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    Body?: {
      stkCallback?: {
        MerchantRequestID?: string;
        CheckoutRequestID?: string;
        ResultCode?: number;
        ResultDesc?: string;
        CallbackMetadata?: { Item?: Array<{ Name?: string; Value?: string | number }> };
      };
    };
  };
  const callback = payload.Body?.stkCallback;

  if (!callback?.CheckoutRequestID) {
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  const payment = await prisma.payment.findFirst({
    where: { checkoutRequestId: callback.CheckoutRequestID },
    select: { id: true },
  });

  if (!payment) {
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  const metadata = callback.CallbackMetadata?.Item || [];
  const getValue = (name: string) => metadata.find((item) => item.Name === name)?.Value;
  const resultCode = Number(callback.ResultCode ?? 1);
  const receipt = getValue("MpesaReceiptNumber");

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: resultCode === 0 ? "completed" : "failed",
      resultCode,
      resultDescription: callback.ResultDesc || null,
      mpesaReceiptNumber: receipt ? String(receipt) : null,
      paidAt: resultCode === 0 ? new Date() : null,
      callbackPayload: JSON.parse(JSON.stringify(payload)),
    },
  });

  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
