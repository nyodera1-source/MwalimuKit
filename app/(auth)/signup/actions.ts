"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { signupSchema } from "@/lib/validations";
import { redirect } from "next/navigation";

function normalizePhoneNumber(value: string) {
  const phone = value.replace(/[\s-]/g, "");
  if (!phone) return null;
  if (phone.startsWith("+254")) return phone;
  if (phone.startsWith("254")) return `+${phone}`;
  if (phone.startsWith("0")) return `+254${phone.slice(1)}`;
  return `+254${phone}`;
}

export async function signup(prevState: unknown, formData: FormData) {
  const raw = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    phoneNumber: (formData.get("phoneNumber") as string) || "",
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    schoolName: (formData.get("schoolName") as string) || "",
    referralCode: (formData.get("referralCode") as string) || "",
    acceptedTerms: (formData.get("acceptedTerms") as string) || "",
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { fullName, password, schoolName, referralCode } = parsed.data;
  const email = parsed.data.email.toLowerCase();
  const phoneNumber = normalizePhoneNumber(parsed.data.phoneNumber);

  try {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: email, mode: "insensitive" } },
          ...(phoneNumber ? [{ phoneNumber }] : []),
        ],
      },
    });
    if (existing) {
      return {
        error:
          existing.email.toLowerCase() === email
            ? "An account with this email already exists."
            : "An account with this phone number already exists.",
      };
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phoneNumber,
        schoolName: schoolName || null,
        referralCode: referralCode || null,
        acceptedTermsAt: new Date(),
      },
    });

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    console.error("Signup failed", error);
    return {
      error:
        "We could not create your account right now. Please try again in a few minutes.",
    };
  }

  redirect("/dashboard");
}
