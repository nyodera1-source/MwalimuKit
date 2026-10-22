CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "phone_number" TEXT NOT NULL,
    "account_reference" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "merchant_request_id" TEXT,
    "checkout_request_id" TEXT,
    "mpesa_receipt_number" TEXT,
    "result_code" INTEGER,
    "result_description" TEXT,
    "callback_payload" JSONB,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "payments_user_id_product_document_id_idx" ON "payments"("user_id", "product", "document_id");
CREATE INDEX "payments_checkout_request_id_idx" ON "payments"("checkout_request_id");
CREATE INDEX "payments_status_idx" ON "payments"("status");

ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
