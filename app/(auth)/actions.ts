"use server";

import { redirect } from "next/navigation";

function getSafeCallbackUrl(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  if (value.startsWith("/login") || value.startsWith("/signup")) {
    return "/dashboard";
  }
  return value;
}

export async function loginWithGoogle(formData: FormData) {
  if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) {
    redirect("/login");
  }

  const callbackUrl = getSafeCallbackUrl(formData.get("callbackUrl"));
  const { signIn } = await import("@/lib/auth");
  await signIn("google", { redirectTo: callbackUrl });
}
