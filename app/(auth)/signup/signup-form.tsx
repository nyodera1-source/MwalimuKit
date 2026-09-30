"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Check, LockKeyhole, Mail, School, ShieldCheck, UserRound } from "lucide-react";
import { signup } from "./actions";
import { loginWithGoogle } from "../actions";

interface SignupFormProps {
  googleEnabled: boolean;
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 shrink-0">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.4Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.86A6.02 6.02 0 0 1 6.08 12c0-.65.11-1.28.31-1.86V7.52H3.04A10 10 0 0 0 2 12c0 1.61.38 3.13 1.04 4.48l3.35-2.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.01c1.47 0 2.79.51 3.83 1.5l2.87-2.88A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.96 5.52l3.35 2.62C7.18 7.77 9.39 6.01 12 6.01Z"
      />
    </svg>
  );
}

export function SignupForm({ googleEnabled }: SignupFormProps) {
  const [state, action, pending] = useActionState(signup, null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");
  const [termsOpen, setTermsOpen] = useState(false);

  function checkPhoneNumber() {
    const compactPhone = phoneNumber.replace(/[\s-]/g, "");
    const isValid = /^(?:(?:\+?254)|0)?[17]\d{8}$/.test(compactPhone);
    setPhoneMessage(
      isValid
        ? "Number format accepted. Ownership verification will follow."
        : "Enter a valid Kenyan phone number."
    );
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-x-hidden overflow-y-auto bg-[#edf1f3] px-0 py-0 sm:px-4 sm:py-1">
      <main
        className="mx-auto min-h-full w-full min-w-0 border-x border-[#d2d8dc] bg-white px-[30px] py-9 text-[#606060] shadow-sm"
        style={{ maxWidth: "540px" }}
      >
        <h1 className="text-center text-[23px] font-normal leading-tight tracking-normal text-[#665f5a]">
          Register a new membership
        </h1>

        <p className="mt-9 text-[17px] leading-7 tracking-normal text-[#647080]">
          <span className="text-[#d9272e]">*</span> Fields marked with a red asterisk are mandatory.
        </p>

        {state?.error && (
          <div role="alert" className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <form action={action} className="mt-7 space-y-7">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-[17px] font-bold text-[#5e5e5e]">
              Full name <span className="text-[#d9272e]">*</span>
            </label>
            <div className="relative">
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Full name"
                autoComplete="name"
                required
                className="h-[57px] w-full border border-[#6ca7ff] bg-white px-[18px] pr-14 text-[22px] tracking-normal text-[#596575] outline-none transition focus:border-[#1688fa] focus:ring-1 focus:ring-[#1688fa]"
              />
              <UserRound className="pointer-events-none absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 fill-[#777] text-[#777]" />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-[17px] font-bold text-[#5e5e5e]">
              Email <span className="text-[#d9272e]">*</span>
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                required
                className="h-[57px] w-full border border-[#c8d0d8] bg-white px-[18px] pr-14 text-[22px] tracking-normal text-[#596575] outline-none transition focus:border-[#1688fa] focus:ring-1 focus:ring-[#1688fa]"
              />
              <Mail className="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 fill-[#777] text-white" />
            </div>
          </div>

          <div className="border border-[#d7dde2] bg-[#f7f8f9] px-6 py-7">
            <label htmlFor="phoneNumber" className="mb-3 block text-[17px] font-bold text-black">
              Phone number
            </label>
            <div className="flex min-w-0 flex-col min-[420px]:flex-row">
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(event) => {
                  setPhoneNumber(event.target.value);
                  setPhoneMessage("");
                }}
                placeholder="Phone, e.g. 0725123456"
                autoComplete="tel"
                className="h-[57px] min-w-0 flex-1 border border-[#c8d0d8] bg-white px-[18px] text-[20px] tracking-normal text-[#596575] outline-none focus:border-[#21aa46] min-[420px]:border-r-0"
              />
              <button
                type="button"
                onClick={checkPhoneNumber}
                className="h-[57px] shrink-0 border border-[#21aa46] bg-white px-4 text-[18px] font-normal text-[#12a332] transition hover:bg-[#f1fbf4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#21aa46] min-[420px]:w-auto"
              >
                Verify phone
              </button>
            </div>
            {phoneMessage && (
              <p className={`mt-2 text-sm ${phoneMessage.startsWith("Number") ? "text-[#168a37]" : "text-red-600"}`}>
                {phoneMessage}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-[17px] font-bold text-[#5e5e5e]">
              Password <span className="text-[#d9272e]">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                minLength={6}
                required
                className="h-[57px] w-full border border-[#c8d0d8] bg-white px-[18px] pr-14 text-[22px] tracking-normal text-[#596575] outline-none transition focus:border-[#1688fa] focus:ring-1 focus:ring-[#1688fa]"
              />
              <LockKeyhole className="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 fill-[#777] text-[#777]" />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-[17px] font-bold text-[#5e5e5e]">
              Retype password <span className="text-[#d9272e]">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Retype password"
                autoComplete="new-password"
                minLength={6}
                required
                className="h-[57px] w-full border border-[#c8d0d8] bg-white px-[18px] pr-14 text-[22px] tracking-normal text-[#596575] outline-none transition focus:border-[#1688fa] focus:ring-1 focus:ring-[#1688fa]"
              />
              <LockKeyhole className="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 fill-[#777] text-[#777]" />
            </div>
          </div>

          <div>
            <label htmlFor="schoolName" className="mb-2 block text-[17px] font-bold text-[#5e5e5e]">
              School name
            </label>
            <div className="relative">
              <input
                id="schoolName"
                name="schoolName"
                type="text"
                placeholder="School Name"
                autoComplete="organization"
                className="h-[57px] w-full border border-[#c8d0d8] bg-white px-[18px] pr-14 text-[22px] tracking-normal text-[#596575] outline-none transition focus:border-[#1688fa] focus:ring-1 focus:ring-[#1688fa]"
              />
              <School className="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 fill-[#777] text-[#777]" />
            </div>
          </div>

          <div>
            <label htmlFor="referralCode" className="mb-2 block text-[17px] font-bold text-[#5e5e5e]">
              Referral code
            </label>
            <input
              id="referralCode"
              name="referralCode"
              type="text"
              placeholder="Referral Code"
              autoComplete="off"
              className="h-[57px] w-full border border-[#c8d0d8] bg-white px-[18px] text-[22px] tracking-normal text-[#596575] outline-none transition focus:border-[#1688fa] focus:ring-1 focus:ring-[#1688fa]"
            />
          </div>

          <div className="grid items-center gap-5 pt-5 min-[480px]:grid-cols-[1fr_180px]">
            <label className="flex min-w-0 items-center gap-3 text-[18px] font-bold text-[#555]">
              <input
                name="acceptedTerms"
                type="checkbox"
                required
                className="h-8 w-8 shrink-0 accent-[#1688fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1688fa]"
              />
              <span>
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  className="text-[#0077ff] hover:underline"
                >
                  terms
                </button>{" "}
                <span className="text-[#d9272e]">*</span>
              </span>
            </label>
            <button
              type="submit"
              disabled={pending}
              className="h-14 bg-[#23a942] px-7 text-[19px] font-normal text-white transition hover:bg-[#1d9438] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Registering..." : "Register"}
            </button>
          </div>

          <div className="flex min-h-24 items-center justify-between bg-[#2d2d2d] px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2fbd71]">
                <Check className="h-8 w-8 stroke-[3]" />
              </span>
              <span className="text-[18px]">Secure registration</span>
            </div>
            <div className="flex items-center gap-2 text-right">
              <ShieldCheck className="h-8 w-8 text-[#f68b2c]" />
              <span className="text-xs font-bold uppercase tracking-[0.12em]">Protected</span>
            </div>
          </div>
        </form>

        <div className="my-7 text-center text-[20px] text-[#666]">- OR -</div>

        <form action={loginWithGoogle} className="flex justify-center">
          <input type="hidden" name="callbackUrl" value="/dashboard" />
          <button
            type="submit"
            disabled={!googleEnabled}
            title={googleEnabled ? "Sign in with Google" : "Google sign-in is not configured yet"}
            className="flex h-[66px] w-full max-w-[276px] items-center justify-center gap-5 border border-[#e3e6e8] bg-white px-5 text-[19px] text-[#666] shadow-[0_2px_2px_rgba(0,0,0,0.18)] transition hover:bg-[#fafafa] disabled:cursor-not-allowed"
          >
            <GoogleMark />
            Sign in with Google
          </button>
        </form>

        <div className="mt-5 border-t border-[#dedede] pt-7 text-[20px] text-[#666]">
          Already have a membership?{" "}
          <Link href="/login" className="font-bold text-[#0077ff] hover:underline">
            Login
          </Link>
        </div>
      </main>

      {termsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="membership-terms-title"
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/55 p-4"
        >
          <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto bg-white p-7 text-[#4f5965] shadow-xl">
            <h2 id="membership-terms-title" className="text-2xl font-semibold text-[#30363d]">
              MwalimuKit membership terms
            </h2>
            <p className="mt-5 leading-7">
              By creating an account, you agree to provide accurate membership
              information, keep your credentials private, and use MwalimuKit
              lawfully.
            </p>
            <p className="mt-4 leading-7">
              AI-generated teaching materials must be reviewed by the teacher
              before classroom use. MwalimuKit may update these terms as the
              service develops.
            </p>
            <button
              type="button"
              onClick={() => setTermsOpen(false)}
              className="mt-7 h-11 bg-[#23a942] px-7 text-white hover:bg-[#1d9438]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
