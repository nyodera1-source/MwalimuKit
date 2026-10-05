/**
 * Phase 2A — curriculum data audit.
 *
 * Validates the seed data that would be written to the database. Runs against
 * the TypeScript modules rather than the database so it needs no connection
 * and catches defects before they are ever seeded.
 *
 * Exits non-zero when any ERROR is found, so it can gate `npm run verify`.
 *
 *   npx tsx scripts/audit-curriculum.ts
 *   npx tsx scripts/audit-curriculum.ts --json
 */

import {
  allGrades,
  CORE_COMPETENCIES,
  VALID_COGNITIVE_LEVELS,
  VALID_TERMS,
  type GradeData,
} from "../prisma/seed/data/index";
import { INCOMPLETE_IN_SOURCE } from "../prisma/seed/data/grade-7-mathematics";
import { findEncodingIssues } from "../lib/curriculum/checks";

type Severity = "error" | "warning";

interface Finding {
  severity: Severity;
  code: string;
  location: string;
  message: string;
}

const findings: Finding[] = [];

function report(
  severity: Severity,
  code: string,
  location: string,
  message: string
) {
  findings.push({ severity, code, location, message });
}

function checkText(value: string, location: string, field: string) {
  for (const issue of findEncodingIssues(value)) {
    report("error", issue.code, location, `${field} ${issue.detail}`);
  }
  if (value !== value.trim()) {
    report(
      "warning",
      "text.leading-trailing-space",
      location,
      `${field} has leading or trailing whitespace: ${JSON.stringify(value)}`
    );
  }
}

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim().length === 0;
}

// ── ordering ────────────────────────────────────────────────────────────────
// Contiguous 1..n ordering keeps the teaching sequence stable across re-seeds.

function checkOrder(orders: number[], location: string, label: string) {
  const seen = new Set<number>();
  const duplicates = orders.filter((o) =>
    seen.has(o) ? true : (seen.add(o), false)
  );

  if (duplicates.length > 0) {
    report(
      "error",
      "order.duplicate",
      location,
      `${label} has duplicate order values: ${[...new Set(duplicates)].join(", ")}`
    );
  }

  const sorted = [...orders].sort((a, b) => a - b);
  const contiguous = sorted.every((value, i) => value === i + 1);
  if (!contiguous) {
    report(
      "error",
      "order.non-contiguous",
      location,
      `${label} order is not contiguous from 1: ${sorted.join(", ")}`
    );
  }
}

// ── duplicates ──────────────────────────────────────────────────────────────
// (learningArea, strand) and (strand, subStrand) pairs carry unique
// constraints in the schema, so a duplicate would fail the seed mid-run.

function checkDuplicateNames<T>(
  items: T[],
  nameOf: (item: T) => string,
  location: string,
  label: string,
  code: string
) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const name = nameOf(item);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  const dupes = [...counts.entries()].filter(([, count]) => count > 1);
  if (dupes.length > 0) {
    report(
      "error",
      code,
      location,
      `${label} contains duplicate names that violate a unique constraint: ${dupes
        .map(([name, count]) => `${JSON.stringify(name)} x${count}`)
        .join(", ")}`
    );
  }
}

// ── walk ────────────────────────────────────────────────────────────────────

const validLevels = new Set<string>(VALID_COGNITIVE_LEVELS);
const validTerms = new Set<number>(VALID_TERMS);

let areaCount = 0;
let strandCount = 0;
let subStrandCount = 0;
let sloCount = 0;
let termsPlaced = 0;
/** Learning areas whose citations carry no page; see the report below. */
const pageless = new Set<string>();
let lessonCountsPresent = 0;

function auditGrade(grade: GradeData) {
  const g = `Grade ${grade.level}`;

  if (grade.level < 1 || grade.level > 10) {
    report("error", "grade.range", g, `level ${grade.level} is outside 1-10`);
  }
  if (isBlank(grade.name)) {
    report("error", "name.empty", g, "grade name is empty");
  }
  if (grade.learningAreas.length === 0) {
    report("error", "container.empty", g, "grade has no learning areas");
  }

  checkOrder(
    grade.learningAreas.map((_, i) => i + 1),
    g,
    "learning areas (positional)"
  );

  checkDuplicateNames(
    grade.learningAreas,
    (la) => la.name,
    g,
    "learning areas",
    "name.duplicate-learning-area"
  );

  for (const la of grade.learningAreas) {
    const loc = `${g} / ${la.name}`;
    areaCount++;

    if (isBlank(la.name)) {
      report("error", "name.empty", loc, "learning area name is empty");
    }
    checkText(la.name, loc, "name");

    if (la.strands.length === 0) {
      report("error", "container.empty", loc, "learning area has no strands");
    }

    checkOrder(
      la.strands.map((s) => s.order),
      loc,
      "strands"
    );
    checkDuplicateNames(
      la.strands,
      (s) => s.name,
      loc,
      "strands",
      "name.duplicate-strand"
    );

    for (const strand of la.strands) {
      const sloc = `${loc} / ${strand.name}`;
      strandCount++;

      if (isBlank(strand.name)) {
        report("error", "name.empty", sloc, "strand name is empty");
      }
      checkText(strand.name, sloc, "name");

      if (strand.subStrands.length === 0) {
        report("error", "container.empty", sloc, "strand has no sub-strands");
      }

      checkOrder(
        strand.subStrands.map((s) => s.order),
        sloc,
        "sub-strands"
      );
      checkDuplicateNames(
        strand.subStrands,
        (s) => s.name,
        sloc,
        "sub-strands",
        "name.duplicate-substrand"
      );

      for (const sub of strand.subStrands) {
        const ssloc = `${sloc} / ${sub.name}`;
        subStrandCount++;

        if (isBlank(sub.name)) {
          report("error", "name.empty", ssloc, "sub-strand name is empty");
        }
        checkText(sub.name, ssloc, "name");

        if (sub.slos.length === 0) {
          report(
            "error",
            "container.empty",
            ssloc,
            "sub-strand has no learning outcomes"
          );
        }

        // Phase 2B completeness — tracked here, not yet blocking.
        if (sub.suggestedTerm !== undefined) {
          termsPlaced++;
          if (!validTerms.has(sub.suggestedTerm)) {
            report(
              "error",
              "term.invalid",
              ssloc,
              `suggestedTerm ${sub.suggestedTerm} is outside 1-3`
            );
          }
        }
        if (sub.suggestedLessons !== undefined) {
          lessonCountsPresent++;
          if (!Number.isInteger(sub.suggestedLessons) || sub.suggestedLessons <= 0) {
            report(
              "error",
              "lessons.non-positive",
              ssloc,
              `suggestedLessons ${sub.suggestedLessons} must be a positive integer`
            );
          }
        }

        // Transcribed rows carry a citation. A row claiming "verified" without
        // one is a claim nothing backs, so treat it as an error.
        if (sub.verification === "verified" && !sub.sourceRef) {
          report(
            "error",
            "verification.no-citation",
            ssloc,
            'marked "verified" but has no sourceRef — verification must cite a page'
          );
        }
        if (sub.sourceRef && !/p\.\d+/.test(sub.sourceRef)) {
          // Aggregate per learning area. Some designs print bare page numbers
          // with no recoverable marker, and one warning per row would bury the
          // findings that matter.
          pageless.add(`${g} / ${la.name}`);
        }

        const seenDescriptions = new Map<string, number>();
        for (const slo of sub.slos) {
          sloCount++;
          seenDescriptions.set(
            slo.description,
            (seenDescriptions.get(slo.description) ?? 0) + 1
          );

          if (isBlank(slo.description)) {
            report(
              "error",
              "description.empty",
              ssloc,
              "learning outcome description is empty"
            );
            continue;
          }
          checkText(slo.description, ssloc, "description");

          if (slo.description.length < 15) {
            report(
              "warning",
              "description.truncated",
              ssloc,
              `description looks truncated (${slo.description.length} chars): ${JSON.stringify(slo.description)}`
            );
          }

          if (!validLevels.has(slo.cognitiveLevel)) {
            report(
              "error",
              "cognitive.invalid",
              ssloc,
              `cognitiveLevel ${JSON.stringify(slo.cognitiveLevel)} is not one of ${VALID_COGNITIVE_LEVELS.join(", ")}`
            );
          }
        }

        const dupeDescriptions = [...seenDescriptions.entries()].filter(
          ([, count]) => count > 1
        );
        if (dupeDescriptions.length > 0) {
          report(
            "error",
            "description.duplicate",
            ssloc,
            `duplicate learning outcomes: ${dupeDescriptions
              .map(([d, c]) => `${JSON.stringify(d)} x${c}`)
              .join(", ")}`
          );
        }
      }
    }
  }
}

// ── competencies ────────────────────────────────────────────────────────────

checkDuplicateNames(
  CORE_COMPETENCIES,
  (c) => c.name,
  "core competencies",
  "core competencies",
  "name.duplicate-competency"
);

// ── grade-level sanity ──────────────────────────────────────────────────────

const levels = allGrades.map((g) => g.level);
const dupeLevels = levels.filter((l, i) => levels.indexOf(l) !== i);
if (dupeLevels.length > 0) {
  report(
    "error",
    "grade.duplicate-level",
    "grades",
    `duplicate grade levels: ${[...new Set(dupeLevels)].join(", ")} (level is a unique key)`
  );
}

const expected = Array.from({ length: 10 }, (_, i) => i + 1);
if (levels.length !== 10 || !expected.every((l) => levels.includes(l))) {
  report(
    "error",
    "grade.incomplete",
    "grades",
    `expected grades 1-10, found: ${levels.sort((a, b) => a - b).join(", ")}`
  );
}

for (const grade of allGrades) auditGrade(grade);

// ── defects in the published designs themselves ─────────────────────────────
// Not ours to fix and not fixable by inference: the outcome ends mid-sentence
// in the KICD PDF. Surfaced here so they stay visible in `npm run verify`
// rather than being buried in a data module.

const sourceDefects = INCOMPLETE_IN_SOURCE.map(
  (d) => `${d.location}: "${d.text}" — ${d.issue}`
);

for (const defect of sourceDefects) {
  report("warning", "source.incomplete-outcome", "KICD design", defect);
}

// ── report ──────────────────────────────────────────────────────────────────


// One warning per learning area rather than per row.
for (const area of pageless) {
  report(
    "warning",
    "sourceRef.no-page",
    area,
    "citations omit a page number; this design does not expose recoverable page markers"
  );
}

const errors = findings.filter((f) => f.severity === "error");
const warnings = findings.filter((f) => f.severity === "warning");

if (process.argv.includes("--json")) {
  console.log(
    JSON.stringify(
      { findings, summary: { errors: errors.length, warnings: warnings.length } },
      null,
      2
    )
  );
} else {
  console.log("Curriculum audit");
  console.log("===============");
  console.log(
    `  grades ${allGrades.length} | learning areas ${areaCount} | strands ${strandCount} | ` +
      `sub-strands ${subStrandCount} | outcomes ${sloCount}`
  );
  console.log(
    `  term placement: ${termsPlaced}/${subStrandCount} sub-strands | ` +
      `lesson counts: ${lessonCountsPresent}/${subStrandCount} sub-strands`
  );
  console.log("");

  if (findings.length === 0) {
    console.log("  No findings.");
  } else {
    for (const f of errors) {
      console.log(`  ERROR   [${f.code}] ${f.location}`);
      console.log(`          ${f.message}`);
    }
    const shown = warnings.slice(0, 10);
    for (const f of shown) {
      console.log(`  WARNING [${f.code}] ${f.location}`);
      console.log(`          ${f.message}`);
    }
    if (warnings.length > shown.length) {
      console.log(`  ... and ${warnings.length - shown.length} more warnings`);
    }
  }

  console.log("");
  console.log(`  ${errors.length} errors, ${warnings.length} warnings`);

  const unplaced = subStrandCount - termsPlaced;
  if (unplaced > 0) {
    console.log("");
    console.log(
      `  NOTE: ${unplaced}/${subStrandCount} sub-strands have no suggestedTerm.\n` +
        "        Expected until Phase 2B populates it against the KICD designs."
    );
  }
}

if (errors.length > 0) {
  console.error("\nCurriculum audit failed.");
  process.exit(1);
}
