import { prisma } from "@/lib/prisma";
import { normalizeKenyanPhone, queryMpesaPayment } from "@/lib/mpesa";
import {
  InvalidJsonBodyError,
  RequestBodyTooLargeError,
  readJsonBody,
} from "@/lib/request";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let payload: {
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

  try {
    payload = await readJsonBody<typeof payload>(request, 32_768);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError || error instanceof InvalidJsonBodyError) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: error.message }, { status: 400 });
    }
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid callback." }, { status: 400 });
  }

  const callback = payload.Body?.stkCallback;

  if (!callback?.CheckoutRequestID) {
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  const payment = await prisma.payment.findFirst({
    where: { checkoutRequestId: callback.CheckoutRequestID },
    select: {
      id: true,
      amount: true,
      phoneNumber: true,
      merchantRequestId: true,
      status: true,
    },
  });

  if (!payment) {
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  const metadata = callback.CallbackMetadata?.Item || [];
  const getValue = (name: string) => metadata.find((item) => item.Name === name)?.Value;
  const resultCode = Number(callback.ResultCode ?? 1);
  const receipt = getValue("MpesaReceiptNumber");
  const callbackMerchantRequestId = callback.MerchantRequestID;

  if (payment.status !== "pending") {
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  if (!Number.isFinite(resultCode)) {
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid result code." }, { status: 400 });
  }

  let finalStatus = resultCode === 0 ? "completed" : "failed";
  let finalDescription = callback.ResultDesc || null;

  if (resultCode === 0) {
    const amount = Number(getValue("Amount"));
    const callbackPhone = getValue("PhoneNumber");
    let phoneMatches = false;
    if (callbackPhone) {
      try {
        phoneMatches = normalizeKenyanPhone(String(callbackPhone)) === payment.phoneNumber;
      } catch {
        phoneMatches = false;
      }
    }
    const identityMatches = !payment.merchantRequestId || !callbackMerchantRequestId
      ? true
      : payment.merchantRequestId === callbackMerchantRequestId;

    if (!Number.isFinite(amount) || amount !== payment.amount || !phoneMatches || !identityMatches || !receipt) {
      finalStatus = "failed";
      finalDescription = "M-PESA callback details could not be verified.";
    } else {
      try {
        const query = await queryMpesaPayment(callback.CheckoutRequestID);
        if (query.resultCode !== 0) {
          finalStatus = "failed";
          finalDescription = query.resultDescription || "M-PESA payment verification failed.";
        }
      } catch {
        // Leave the payment pending so Daraja can retry the callback rather than
        // granting a download from an unverified success notification.
        return NextResponse.json({ ResultCode: 1, ResultDesc: "Payment verification is temporarily unavailable." }, { status: 500 });
      }
    }
  }

  await prisma.payment.updateMany({
    where: { id: payment.id, status: "pending" },
    data: {
      status: finalStatus,
      resultCode,
      resultDescription: finalDescription,
      mpesaReceiptNumber: receipt ? String(receipt) : null,
      paidAt: finalStatus === "completed" ? new Date() : null,
      callbackPayload: JSON.parse(JSON.stringify(payload)),
    },
  });

  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
