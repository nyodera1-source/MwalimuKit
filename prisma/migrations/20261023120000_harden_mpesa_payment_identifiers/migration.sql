DROP INDEX IF EXISTS "payments_checkout_request_id_idx";

CREATE UNIQUE INDEX "payments_checkout_request_id_key"
  ON "payments"("checkout_request_id");

CREATE UNIQUE INDEX "payments_mpesa_receipt_number_key"
  ON "payments"("mpesa_receipt_number");
