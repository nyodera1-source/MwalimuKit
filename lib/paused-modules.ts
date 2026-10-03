/**
 * Phase 1 — scope reduction.
 *
 * These modules are preserved in the tree (route code and database tables
 * are untouched) but removed from the teacher journey.
 *
 * Page routes redirect to the dashboard; API routes return 410 Gone.
 *
 * Both lists must be kept in sync with the middleware matcher, which is
 * what routes requests through this module at all. Anything absent from
 * PAUSED_API_PREFIXES is reachable by any authenticated user.
 */

export const PAUSED_PAGE_PREFIXES = [
  "/assignments",
  "/notes",
  "/exams",
  "/question-bank",
  "/activity-forms",
] as const;

export const PAUSED_API_PREFIXES = [
  "/api/assignments",
  "/api/notes",
  "/api/exams",
  "/api/question-bank",
  "/api/curriculum-notes",
  "/api/activity-forms",
  "/api/creative-arts",
  "/api/creative-arts-forms",
  "/api/experiments",
  "/api/social-studies",
] as const;

/** Exact match or a descendant of the prefix. Guards against "/api/notesearch" matching "/api/notes". */
export function matchesPausedPrefix(
  pathname: string,
  prefixes: readonly string[]
): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isPausedPage(pathname: string): boolean {
  return matchesPausedPrefix(pathname, PAUSED_PAGE_PREFIXES);
}

export function isPausedApi(pathname: string): boolean {
  return matchesPausedPrefix(pathname, PAUSED_API_PREFIXES);
}
