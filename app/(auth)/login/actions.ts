"use server";

import { signIn } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

function getSafeCallbackUrl(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  if (value.startsWith("/login") || value.startsWith("/signup")) {
    return "/dashboard";
  }
  return value;
}

export async function login(prevState: unknown, formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const callbackUrl = getSafeCallbackUrl(formData.get("callbackUrl"));

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    console.error("Login failed", error);
    return {
      error:
        "We could not sign you in right now. Please try again in a few minutes.",
    };
  }

  redirect(callbackUrl);
}
