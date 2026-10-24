"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "./actions";
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

interface LoginFormProps {
  callbackUrl: string;
  googleEnabled: boolean;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z" />
      <path fill="#34A853" d="M12 21.99c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.99Z" />
      <path fill="#FBBC05" d="M6.54 14.08A5.86 5.86 0 0 1 6.23 12c0-.72.12-1.42.31-2.08V7.39H3.3A9.98 9.98 0 0 0 2.25 12c0 1.66.4 3.23 1.05 4.61l3.24-2.53Z" />
      <path fill="#EA4335" d="M12 5.89c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 2.99 14.63 2 12 2a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 7.61 9.46 5.89 12 5.89Z" />
    </svg>
  );
}

export function LoginForm({ callbackUrl, googleEnabled }: LoginFormProps) {
  const [state, action, pending] = useActionState(login, null);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Log in to access your CBE teaching toolkit
        </CardDescription>
      </CardHeader>
      <CardContent>
        {googleEnabled && (
          <>
            <form action={loginWithGoogle}>
              <input type="hidden" name="callbackUrl" value={callbackUrl} />
              <Button type="submit" variant="outline" className="w-full">
                <GoogleIcon />
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
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          {state?.error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
              {state.error}
            </div>
          )}

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
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">Password</Label>
              <a
                href="mailto:info@mwalimukit.com?subject=Password%20reset%20request"
                className="text-sm text-primary hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up free
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
