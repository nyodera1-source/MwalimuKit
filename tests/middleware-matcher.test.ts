/**
 * Middleware only runs on paths in its matcher. A paused API prefix that is
 * not matched is never inspected, so the 410 in middleware.ts never fires and
 * the route stays reachable. This test pins the matcher to the pause list.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { PAUSED_API_PREFIXES, PAUSED_PAGE_PREFIXES } from "../lib/paused-modules";

async function loadMatcher(): Promise<string[]> {
  const mod = await import("../middleware");
  return (mod.config as { matcher: string[] }).matcher;
}

describe("middleware matcher covers paused routes", () => {
  test("every paused prefix is matched", async () => {
    const matcher = await loadMatcher();
    // "/api/assignments" → "/api/assignments/:path*"
    const matched = matcher.map((m) => m.replace("/:path*", ""));

    for (const prefix of [...PAUSED_API_PREFIXES, ...PAUSED_PAGE_PREFIXES]) {
      assert.ok(
        matched.includes(prefix),
        `"${prefix}" is paused but absent from the middleware matcher — its routes stay reachable.`
      );
    }
  });

  test("matcher does not blanket-capture the api surface", async () => {
    const matcher = await loadMatcher();
    assert.ok(
      !matcher.includes("/api/:path*"),
      "A blanket /api matcher would subject auth and curriculum routes to the login redirect."
    );
    assert.ok(!matcher.includes("/api/auth/:path*"));
  });
});
