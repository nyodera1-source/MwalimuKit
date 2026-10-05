-- Phase 2B — Grade 7 English transcription support.
--
-- KICD English publishes three levels: theme (1.0), skill strand (1.1) and
-- unit (1.1.1). The skill strand repeats across all fifteen themes, so it
-- cannot be a Strand (unique per learning area). It is stored as a plain
-- column on sub_strands: nullable, additive, no backfill.

ALTER TABLE "sub_strands" ADD COLUMN "skill_strand" TEXT;

CREATE INDEX "sub_strands_skill_strand_idx" ON "sub_strands"("skill_strand")
  WHERE "skill_strand" IS NOT NULL;