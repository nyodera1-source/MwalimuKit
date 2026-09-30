-- Google accounts authenticate externally and therefore do not have a password.
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;
