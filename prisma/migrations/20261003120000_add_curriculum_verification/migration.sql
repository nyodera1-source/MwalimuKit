-- Phase 2A — curriculum verification scaffolding.
--
-- Deliberately nullable. suggested_term / suggested_lessons are overridable
-- teacher defaults, not constraints: schools legitimately run behind or ahead
-- of the suggested pacing, and the coverage checker warns rather than blocks.
--
-- verification defaults to 'unverified'. Nothing may be set to 'verified'
-- until Phase 2B attaches a source_ref citation to the KICD design.

-- ── sub_strands ──
ALTER TABLE "sub_strands" ADD COLUMN "suggested_term" INTEGER;
ALTER TABLE "sub_strands" ADD COLUMN "suggested_lessons" INTEGER;
ALTER TABLE "sub_strands" ADD COLUMN "verification" TEXT NOT NULL DEFAULT 'unverified';
ALTER TABLE "sub_strands" ADD COLUMN "verified_by" TEXT;
ALTER TABLE "sub_strands" ADD COLUMN "verified_at" TIMESTAMP(3);
ALTER TABLE "sub_strands" ADD COLUMN "source_ref" TEXT;

-- Guard the term range at the database level rather than trusting the seeder.
ALTER TABLE "sub_strands"
  ADD CONSTRAINT "sub_strands_suggested_term_range"
  CHECK ("suggested_term" IS NULL OR "suggested_term" BETWEEN 1 AND 3);

ALTER TABLE "sub_strands"
  ADD CONSTRAINT "sub_strands_suggested_lessons_positive"
  CHECK ("suggested_lessons" IS NULL OR "suggested_lessons" > 0);

ALTER TABLE "sub_strands"
  ADD CONSTRAINT "sub_strands_verification_enum"
  CHECK ("verification" IN ('unverified', 'verified', 'disputed'));

CREATE INDEX "sub_strands_verification_idx" ON "sub_strands"("verification");

-- ── slos ──
ALTER TABLE "slos" ADD COLUMN "suggested_lessons" INTEGER;
ALTER TABLE "slos" ADD COLUMN "verification" TEXT NOT NULL DEFAULT 'unverified';
ALTER TABLE "slos" ADD COLUMN "verified_at" TIMESTAMP(3);

ALTER TABLE "slos"
  ADD CONSTRAINT "slos_suggested_lessons_positive"
  CHECK ("suggested_lessons" IS NULL OR "suggested_lessons" > 0);

ALTER TABLE "slos"
  ADD CONSTRAINT "slos_verification_enum"
  CHECK ("verification" IN ('unverified', 'verified', 'disputed'));

CREATE INDEX "slos_verification_idx" ON "slos"("verification");

-- ── curriculum_versions ──
CREATE TABLE "curriculum_versions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source_url" TEXT,
    "source_note" TEXT,
    "effective_year" INTEGER,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curriculum_versions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "curriculum_versions_code_key" ON "curriculum_versions"("code");

-- At most one current version. A partial unique index is the cheapest way to
-- express this in Postgres and needs no application-side transaction.
CREATE UNIQUE INDEX "curriculum_versions_single_current"
  ON "curriculum_versions" ("is_current")
  WHERE "is_current" = true;
