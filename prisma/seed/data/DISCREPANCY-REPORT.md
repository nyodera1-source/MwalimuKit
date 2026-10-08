# Grade 7 Alternative Subjects — Consolidated Discrepancy Report

**Date:** 2026-10-06
**Subjects audited:** French, Arabic, Hindu Religious Education, German
**Authority:** KICD curriculum design PDFs (the ONLY authority)

## Summary

| Subject | Strands | Sub-strands | Lessons | Summary↔body conflicts | Status |
|---------|---------|-------------|---------|------------------------|--------|
| French | 3 | 27 (3×9) | 27/18/9 strand-level + 6 | Yes (9 vs 27 sub-strands) | **Corrected** |
| German | 3 | 27 (3×9) | 3/2/1 per sub-strand | None | **Corrected** |
| Arabic | 3 | 27 (3×9) | 2 per sub-strand | Yes (summary arithmetic wrong) | **Corrected** |
| Hindu | 6 | 8 | 14–16 per sub-strand | None | **Corrected** |

## Conflicts requiring a decision

### 1. French — summary ↔ body sub-strand count

**Summary table (p. iv):** Lists 9 sub-strands with duplicate numbering (1.3 twice, 2.2 twice).
**Body:** 27 sub-strands (9 per strand × 3 strands), numbered 1.1–1.9, 2.1–2.9, 3.1–3.9.

**Decision:** The body is the authority (it contains the actual SLOs). The summary's 9 sub-strands are the distinct skill types, not the theme-specific instances. The module uses the body's 27 sub-strands.

### 2. French — lesson allocation

**Summary table:** Shows strand-level totals (27/18/9) printed once per strand.
**Body:** No per-sub-strand lesson counts.

**Decision:** The strand totals are NOT assigned to sub-strands (per the transcription rules). The module leaves per-sub-strand `suggestedLessons` unset. The strand totals (27/18/9 + 6 showcasing = 60) are documented in the module header.

### 3. Arabic — summary arithmetic inconsistency

**Summary table (p. x):**
- Strand 1.0 sub-strands: 4 + 6 + 6 + 2 + 2 = **20**, but stated "Total 16".
- Strand totals: 16 + 18 + 18 + 6 = **58**, but stated "Total Number of Lessons 60".

**Body:** 9 sub-strands per strand × 2 sessions = 18 per strand, totaling 54 + 6 = 60.

**Decision:** The body is the authority. The module uses the body's per-sub-strand count (2 sessions each). The summary's arithmetic errors are documented but not propagated.

## Unresolved items

| # | Subject | Item | Resolution |
|---|---------|------|------------|
| 1 | French | Summary duplicate numbering (1.3, 2.2) | Body is authority; summary conflict documented |
| 2 | French | Strand-level lesson totals not per-sub-strand | Documented in header; not assigned to sub-strands |
| 3 | Arabic | Summary strand-1.0 arithmetic (20≠16) | Body is authority; summary error documented |
| 4 | Arabic | Summary grand total (58≠60) | Body is authority; summary error documented |

## What was corrected

### French
- **Before:** 9 sub-strands (from summary), paraphrased outcomes, strand total (27) assigned to sub-strand 1.1, duplicate numbering.
- **After:** 27 sub-strands (from body), exact published outcomes, no per-sub-strand lesson assignment, sequential numbering.

### German
- **Before:** (if any) would have used summary's 9 sub-strands.
- **After:** 27 sub-strands (from body), compound names preserved, per-sub-strand lesson counts (3/2/1).

### Arabic
- **Before:** (if any) would have used summary's 5 sub-strands and wrong lesson counts.
- **After:** 27 sub-strands (from body), per-sub-strand lesson count (2 sessions), summary arithmetic errors documented.

### Hindu
- **Before:** (if any) would have used 5 strands (omitting Rites of Passage).
- **After:** 6 strands (including Rites of Passage), 8 sub-strands, per-sub-strand lesson counts (14–16), total 120.

## Files changed

- `prisma/seed/data/grade-7-french.ts` — rewritten from PDF body
- `prisma/seed/data/grade-7-german.ts` — rewritten from PDF body
- `prisma/seed/data/grade-7-arabic.ts` — rewritten from PDF body
- `prisma/seed/data/grade-7-hindu.ts` — rewritten from PDF body
- `prisma/seed/data/audit-grade-7-french.md` — new
- `prisma/seed/data/audit-grade-7-german.md` — new
- `prisma/seed/data/audit-grade-7-arabic.md` — new
- `prisma/seed/data/audit-grade-7-hindu.md` — new
- `tests/grade-7-alternatives-audit.test.ts` — rewritten with exact-name assertions

## NOT done (per user directive)

- NOT added to live catalogue (`grade-7.ts` does not import the alternatives)
- NOT seeded or modified the database
- NOT pushed or deployed
- Awaiting explicit publication approval
