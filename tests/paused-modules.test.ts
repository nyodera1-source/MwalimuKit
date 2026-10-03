/**
 * Guards the Phase 1 scope reduction.
 *
 * A paused API route that falls out of PAUSED_API_PREFIXES, or out of the
 * middleware matcher, is reachable by any authenticated user. These tests
 * pin both lists against the routes that actually exist on disk so the
 * gap fails loudly instead of shipping silently.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

import {
  PAUSED_API_PREFIXES,
  PAUSED_PAGE_PREFIXES,
  isPausedApi,
  isPausedPage,
  matchesPausedPrefix,
} from "../lib/paused-modules";

const API_DIR = join(process.cwd(), "app", "api");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return entry === "route.ts" ? [full] : [];
  });
}

/**
 * Every API route on disk, as a middleware-visible pathname.
 * API_DIR is app/api, so the "/api" segment has to be restored —
 * otherwise nothing lines up with PAUSED_API_PREFIXES.
 */
const apiRoutesOnDisk = walk(API_DIR).map((file) => {
  const inner = relative(API_DIR, file).split(sep).join("/").replace(/\/route\.ts$/, "");
  return `/api/${inner}`;
});

/** Routes deliberately left reachable during Phase 1. */
const ACTIVE_API_ROUTES = [
  "/api/auth/[...nextauth]",
  "/api/curriculum/competencies",
  "/api/curriculum/grades",
  "/api/curriculum/learning-areas",
  "/api/curriculum/slos",
  "/api/curriculum/strands",
  "/api/curriculum/sub-strands",
  "/api/curriculum/suggestions",
  "/api/health/ai",
  "/api/health/db",
  "/api/lesson-plans/[id]/autosave",
  "/api/lesson-plans/[id]/export",
  "/api/lesson-plans/generate",
  "/api/schemes/[id]/export",
  "/api/schemes/generate",
];

describe("paused prefix matching", () => {
  test("matches an exact path", () => {
    assert.equal(matchesPausedPrefix("/notes", PAUSED_PAGE_PREFIXES), true);
  });

  test("matches a descendant", () => {
    assert.equal(matchesPausedPrefix("/notes/abc/edit", PAUSED_PAGE_PREFIXES), true);
    assert.equal(
      matchesPausedPrefix("/api/assignments/generate", PAUSED_API_PREFIXES),
      true
    );
  });

  test("does not match a partial segment", () => {
    // The failure mode that would silently unpause a sibling module.
    assert.equal(matchesPausedPrefix("/notebook", PAUSED_PAGE_PREFIXES), false);
    assert.equal(
      matchesPausedPrefix("/api/notesearch/import", PAUSED_API_PREFIXES),
      false
    );
  });

  test("curriculum-notes is paused without pausing /api/curriculum", () => {
    assert.equal(isPausedApi("/api/curriculum-notes/generate"), true);
    assert.equal(isPausedApi("/api/curriculum/grades"), false);
    assert.equal(isPausedApi("/api/curriculum/suggestions"), false);
  });
});

describe("scope reduction", () => {
  test("no paused API route exists that is missing from the pause list", () => {
    const unprotected = apiRoutesOnDisk.filter(
      (route) => !ACTIVE_API_ROUTES.includes(route) && !isPausedApi(route)
    );

    assert.deepEqual(
      unprotected,
      [],
      `These API routes are reachable but not paused or declared active: ${unprotected.join(", ")}. ` +
        "Add them to PAUSED_API_PREFIXES or ACTIVE_API_ROUTES deliberately."
    );
  });

  test("the active API list still exists on disk", () => {
    const stale = ACTIVE_API_ROUTES.filter(
      (route) => !apiRoutesOnDisk.includes(route)
    );

    assert.deepEqual(
      stale,
      [],
      `Active API routes that no longer exist: ${stale.join(", ")}. Remove them from the list.`
    );
  });

  test("core active routes are not paused", () => {
    for (const route of ["/api/schemes/generate", "/api/lesson-plans/generate"]) {
      assert.equal(isPausedApi(route), false, `${route} must stay reachable`);
    }
    for (const route of ["/schemes", "/lesson-plans", "/dashboard", "/profile"]) {
      assert.equal(isPausedPage(route), false, `${route} must stay reachable`);
    }
  });

  test("retired teacher-facing modules are paused", () => {
    for (const route of ["/assignments", "/notes", "/exams", "/question-bank", "/activity-forms"]) {
      assert.equal(isPausedPage(route), true, `${route} must be paused`);
    }
  });
});
