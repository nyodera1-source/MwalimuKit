import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // ─────────────────────────────────────────────────────────────
    // Paused modules (Phase 1 scope reduction)
    //
    // Assignments, teaching notes, exams, question bank and activity
    // forms are deliberately preserved in the tree but removed from the
    // teacher journey. They are unreachable in production and are not
    // part of the current build surface.
    //
    // They are excluded from lint so that the Phase 1 gate reflects the
    // code we actually ship. Each directory must be linted and cleaned
    // before it is restored to the navigation — do not extend this list
    // to cover code in the active journey.
    // ─────────────────────────────────────────────────────────────
    "app/(teacher)/assignments/**",
    "app/(teacher)/notes/**",
    "app/(teacher)/exams/**",
    "app/(teacher)/question-bank/**",
    "app/(teacher)/activity-forms/**",
    "components/exams/**",
    "lib/export/social-studies-pdf.ts",
    "lib/export/teaching-notes-pdf.ts",
    "lib/export/assignment-pdf.ts",
    "lib/export/exam-pdf.ts",

    // ─────────────────────────────────────────────────────────────
    // Offline authoring tools — run manually via npx tsx, never bundled.
    // ─────────────────────────────────────────────────────────────
    "scripts/**",

    // Standalone CommonJS diagnostic script at the repo root.
    "verify-db.js",
  ]),
]);

export default eslintConfig;
