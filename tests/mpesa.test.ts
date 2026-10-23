import { test } from "node:test";
import assert from "node:assert/strict";

import { isMpesaEnabled, normalizeKenyanPhone } from "../lib/mpesa";

test("M-PESA is disabled unless the flag is explicitly enabled", () => {
  const previous = process.env.MPESA_ENABLED;
  try {
    delete process.env.MPESA_ENABLED;
    assert.equal(isMpesaEnabled(), false);
    process.env.MPESA_ENABLED = "false";
    assert.equal(isMpesaEnabled(), false);
    process.env.MPESA_ENABLED = "true";
    assert.equal(isMpesaEnabled(), true);
  } finally {
    if (typeof previous === "undefined") delete process.env.MPESA_ENABLED;
    else process.env.MPESA_ENABLED = previous;
  }
});

test("Kenyan phone numbers are normalized for callback comparison", () => {
  assert.equal(normalizeKenyanPhone("0712 345 678"), "254712345678");
  assert.equal(normalizeKenyanPhone("+254712345678"), "254712345678");
});
