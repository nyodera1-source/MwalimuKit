export type PaidProduct = "lesson_plan" | "scheme_of_work";

export const PRODUCT_PRICES: Record<PaidProduct, number> = {
  lesson_plan: 10,
  scheme_of_work: 20,
};

export function isMpesaEnabled() {
  const value = process.env.MPESA_ENABLED?.trim().toLowerCase();
  return ["true", "1", "on", "yes"].includes(value || "");
}

export function isPaidProduct(value: string): value is PaidProduct {
  return value === "lesson_plan" || value === "scheme_of_work";
}

export function normalizeKenyanPhone(value: string) {
  const digits = value.replace(/[^0-9]/g, "");
  const normalized = digits.startsWith("254")
    ? digits
    : digits.startsWith("0")
      ? `254${digits.slice(1)}`
      : `254${digits}`;

  if (!/^254[17]\d{8}$/.test(normalized)) {
    throw new Error("Enter a valid Kenyan M-PESA number, for example 0712345678.");
  }

  return normalized;
}

function getConfig() {
  const environment = process.env.MPESA_ENV === "production" ? "production" : "sandbox";
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;

  if (!consumerKey || !consumerSecret || !shortcode || !passkey) {
    throw new Error("M-PESA payment configuration is incomplete.");
  }

  const baseUrl =
    environment === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";
  const callbackUrl =
    process.env.MPESA_CALLBACK_URL ||
    `${process.env.NEXTAUTH_URL || process.env.AUTH_URL || ""}/api/payments/mpesa/callback`;

  if (!callbackUrl.startsWith("https://")) {
    throw new Error("MPESA_CALLBACK_URL must be a public HTTPS URL.");
  }

  const transactionType =
    process.env.MPESA_TRANSACTION_TYPE ||
    (environment === "production" ? "CustomerBuyGoodsOnline" : "CustomerPayBillOnline");

  if (transactionType !== "CustomerBuyGoodsOnline" && transactionType !== "CustomerPayBillOnline") {
    throw new Error(
      "MPESA_TRANSACTION_TYPE must be CustomerBuyGoodsOnline or CustomerPayBillOnline."
    );
  }

  const businessShortcode =
    transactionType === "CustomerBuyGoodsOnline"
      ? process.env.MPESA_STORE_NUMBER
      : shortcode;
  const partyB =
    transactionType === "CustomerBuyGoodsOnline"
      ? process.env.MPESA_TILL_NUMBER
      : shortcode;

  if (!businessShortcode || !partyB) {
    throw new Error(
      "Till payments require MPESA_STORE_NUMBER and MPESA_TILL_NUMBER in the production environment."
    );
  }

  return {
    consumerKey,
    consumerSecret,
    shortcode: businessShortcode,
    partyB,
    passkey,
    baseUrl,
    callbackUrl,
    transactionType,
  };
}

function darajaTimestamp() {
  const now = new Date(Date.now() + 3 * 60 * 60 * 1000);
  const iso = now.toISOString().replace(/[-:TZ.]/g, "");
  return iso.slice(0, 14);
}

async function getAccessToken(config: ReturnType<typeof getConfig>) {
  const credentials = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
  const response = await fetch(
    `${config.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${credentials}` },
      cache: "no-store",
    }
  );
  const data = (await response.json()) as { access_token?: string; errorMessage?: string };

  if (!response.ok || !data.access_token) {
    throw new Error(data.errorMessage || "Could not connect to M-PESA.");
  }

  return data.access_token;
}

export async function initiateMpesaPayment(input: {
  phoneNumber: string;
  amount: number;
  accountReference: string;
}) {
  const config = getConfig();
  const timestamp = darajaTimestamp();
  const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString("base64");
  const accessToken = await getAccessToken(config);
  const response = await fetch(`${config.baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: config.transactionType,
      Amount: input.amount,
      PartyA: input.phoneNumber,
      PartyB: config.partyB,
      PhoneNumber: input.phoneNumber,
      CallBackURL: config.callbackUrl,
      AccountReference: input.accountReference,
      TransactionDesc: "MWK DOWNLOAD",
    }),
    cache: "no-store",
  });
  const data = (await response.json()) as {
    ResponseCode?: string;
    ResponseDescription?: string;
    MerchantRequestID?: string;
    CheckoutRequestID?: string;
    CustomerMessage?: string;
    errorMessage?: string;
  };

  if (!response.ok || data.ResponseCode !== "0" || !data.CheckoutRequestID) {
    throw new Error(
      data.errorMessage || data.ResponseDescription || "M-PESA could not start the payment prompt."
    );
  }

  return {
    merchantRequestId: data.MerchantRequestID || null,
    checkoutRequestId: data.CheckoutRequestID,
    customerMessage: data.CustomerMessage || "Check your phone and enter your M-PESA PIN.",
  };
}

export async function queryMpesaPayment(checkoutRequestId: string) {
  const config = getConfig();
  const timestamp = darajaTimestamp();
  const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString("base64");
  const accessToken = await getAccessToken(config);
  const response = await fetch(`${config.baseUrl}/mpesa/stkpushquery/v1/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
    cache: "no-store",
  });
  const data = (await response.json()) as {
    ResultCode?: string;
    ResultDesc?: string;
    errorMessage?: string;
  };

  if (!response.ok || typeof data.ResultCode === "undefined") {
    throw new Error(data.errorMessage || data.ResultDesc || "Could not verify the M-PESA payment.");
  }

  return {
    resultCode: Number(data.ResultCode),
    resultDescription: data.ResultDesc || "",
  };
}
