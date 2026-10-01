"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { signup } from "./actions";
import { loginWithGoogle } from "../actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignupFormProps {
  googleEnabled: boolean;
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
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Register as a new member
          </CardTitle>
          <CardDescription>
            Create your account to access your CBE teaching toolkit
          </CardDescription>
        </CardHeader>

        <CardContent>
          {googleEnabled && (
            <>
              <form action={loginWithGoogle}>
                <input type="hidden" name="callbackUrl" value="/dashboard" />
                <Button type="submit" variant="outline" className="w-full">
                  <span className="text-base font-bold" aria-hidden="true">
                    G
                  </span>
                  Continue with Google
                </Button>
              </form>
              <div className="my-5 flex items-center gap-3" aria-hidden="true">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>
            </>
          )}

          <form action={action} className="space-y-4">
            {state?.error && (
              <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {state.error}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              <span className="text-destructive">*</span> Required fields
            </p>

            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full name <span className="text-destructive">*</span>
              </Label>
              <Input id="fullName" name="fullName" type="text" placeholder="Full name" autoComplete="name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input id="email" name="email" type="email" placeholder="jane@example.com" autoComplete="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone number</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) => {
                    setPhoneNumber(event.target.value);
                    setPhoneMessage("");
                  }}
                  placeholder="e.g. 0725123456"
                  autoComplete="tel"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={checkPhoneNumber}>
                  Verify phone
                </Button>
              </div>
              {phoneMessage && (
                <p className={`text-xs ${phoneMessage.startsWith("Number") ? "text-primary" : "text-destructive"}`}>
                  {phoneMessage}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input id="password" name="password" type="password" autoComplete="new-password" minLength={6} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Retype password <span className="text-destructive">*</span>
              </Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={6} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolName">School name</Label>
              <Input id="schoolName" name="schoolName" type="text" placeholder="School name" autoComplete="organization" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralCode">Referral code</Label>
              <Input id="referralCode" name="referralCode" type="text" placeholder="Referral code" autoComplete="off" />
            </div>

            <label className="flex cursor-pointer items-start gap-3 pt-1 text-sm text-muted-foreground">
              <input name="acceptedTerms" type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-primary" />
              <span>
                I agree to the{" "}
                <button type="button" onClick={() => setTermsOpen(true)} className="font-medium text-primary hover:underline">
                  terms
                </button>{" "}
                <span className="text-destructive">*</span>
              </span>
            </label>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Registering..." : "Register"}
            </Button>

            <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Secure registration
              </span>
              <span className="flex items-center gap-2 font-medium">
                <ShieldCheck className="size-4 text-primary" />
                Protected
              </span>
            </div>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>

      {termsOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="membership-terms-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-7 shadow-xl">
            <h2 id="membership-terms-title" className="text-2xl font-semibold">
              MwalimuKit membership terms
            </h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              By creating an account, you agree to provide accurate membership information, keep your credentials private, and use MwalimuKit lawfully.
            </p>
            <p className="mt-4 leading-7 text-muted-foreground">
              AI-generated teaching materials must be reviewed by the teacher before classroom use. MwalimuKit may update these terms as the service develops.
            </p>
            <Button type="button" onClick={() => setTermsOpen(false)} className="mt-7">
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
