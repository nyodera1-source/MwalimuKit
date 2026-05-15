import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isApiAuth = pathname.startsWith("/api/auth");
  if (isApiAuth) return;

  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (!isLoggedIn && !isAuthPage) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/lesson-plans/:path*",
    "/schemes/:path*",
    "/exams/:path*",
    "/notes/:path*",
    "/profile/:path*",
    "/question-bank/:path*",
    "/activity-forms/:path*",
    "/login",
    "/signup",
  ],
};
