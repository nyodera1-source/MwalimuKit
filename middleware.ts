import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { isPausedApi, isPausedPage } from "@/lib/paused-modules";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  if (pathname.startsWith("/api/auth")) return;

  // Paused API surface: answer 410 before any auth handling, so paused
  // endpoints never leak availability information to signed-out callers.
  if (isPausedApi(pathname)) {
    return Response.json(
      { error: "This module is not currently available." },
      { status: 410 }
    );
  }

  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (isLoggedIn && isPausedPage(pathname)) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (!isLoggedIn && !isAuthPage) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set(
      "callbackUrl",
      `${req.nextUrl.pathname}${req.nextUrl.search}`
    );
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: [
    // Active journey.
    "/dashboard/:path*",
    "/lesson-plans/:path*",
    "/schemes/:path*",
    "/profile/:path*",

    // Paused page routes.
    "/assignments/:path*",
    "/exams/:path*",
    "/notes/:path*",
    "/question-bank/:path*",
    "/activity-forms/:path*",

    // Paused API routes. These must stay in the matcher for the 410 above
    // to apply — an unmatched route is never inspected by middleware.
    // Keep in sync with PAUSED_API_PREFIXES in lib/paused-modules.ts.
    "/api/assignments/:path*",
    "/api/exams/:path*",
    "/api/notes/:path*",
    "/api/question-bank/:path*",
    "/api/curriculum-notes/:path*",
    "/api/activity-forms/:path*",
    "/api/creative-arts/:path*",
    "/api/creative-arts-forms/:path*",
    "/api/experiments/:path*",
    "/api/social-studies/:path*",

    "/login",
    "/signup",
  ],
};
