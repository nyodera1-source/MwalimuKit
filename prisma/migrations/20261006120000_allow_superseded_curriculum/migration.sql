BEGIN;

ALTER TABLE "sub_strands" DROP CONSTRAINT "sub_strands_verification_enum";
ALTER TABLE "sub_strands"
  ADD CONSTRAINT "sub_strands_verification_enum"
  CHECK ("verification" IN ('unverified', 'verified', 'disputed', 'superseded'));

ALTER TABLE "slos" DROP CONSTRAINT "slos_verification_enum";
ALTER TABLE "slos"
  ADD CONSTRAINT "slos_verification_enum"
  CHECK ("verification" IN ('unverified', 'verified', 'disputed', 'superseded'));

COMMIT;
