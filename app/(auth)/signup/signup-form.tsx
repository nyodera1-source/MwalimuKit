"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "./actions";
import { loginWithGoogle } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KENYAN_COUNTIES } from "@/lib/constants";

interface SignupFormProps {
  googleEnabled: boolean;
}

export function SignupForm({ googleEnabled }: SignupFormProps) {
  const [state, action, pending] = useActionState(signup, null);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
        <CardDescription>
          Join MwalimuKit and start creating CBE-aligned documents in minutes
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
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="e.g. Jane Wanjiku"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="county">County</Label>
            <Select name="county" required>
              <SelectTrigger>
                <SelectValue placeholder="Select your county" />
              </SelectTrigger>
              <SelectContent>
                {KENYAN_COUNTIES.map((county) => (
                  <SelectItem key={county} value={county}>
                    {county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating account..." : "Sign Up Free"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
