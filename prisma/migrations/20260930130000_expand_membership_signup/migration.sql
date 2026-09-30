ALTER TABLE "users"
ADD COLUMN "phone_number" TEXT,
ADD COLUMN "phone_verified_at" TIMESTAMP(3),
ADD COLUMN "school_name" TEXT,
ADD COLUMN "referral_code" TEXT,
ADD COLUMN "accepted_terms_at" TIMESTAMP(3);

CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");
