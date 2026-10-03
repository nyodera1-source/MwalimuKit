/**
 * Guards the Phase 1 invariant: no request may reach OpenAI.
 *
 * This is the control that protects the token budget. If liveAIEnabled
 * ever resolves to true by accident, or the guard is moved out of
 * getOpenAIClient(), these tests fail.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("AI kill switch", () => {
  test("live AI is disabled unless explicitly opted in", async () => {
    const { liveAIEnabled } = await import("../lib/ai/openai-client");
    assert.equal(
      liveAIEnabled,
      process.env.ENABLE_LIVE_AI === "true",
      "liveAIEnabled must equal (ENABLE_LIVE_AI === 'true')"
    );
  });

  test("live AI is disabled by default", () => {
    assert.notEqual(
      process.env.ENABLE_LIVE_AI,
      "true",
      "ENABLE_LIVE_AI must not be set in the test environment"
    );
  });

  test("generateAIText throws before opening a client when disabled", async () => {
    const { generateAIText, AIProviderError } = await import(
      "../lib/ai/openai-client"
    );

    await assert.rejects(
      () => generateAIText({ systemPrompt: "s", userPrompt: "u" }),
      (err: unknown) => {
        assert.ok(err instanceof AIProviderError);
        assert.equal(err.message, "Live AI generation is disabled.");
        assert.equal(err.status, 503);
        return true;
      },
      "must reject with a 503 AIProviderError, never reach the API"
    );
  });

  test("no request is attempted even when a key is present", async () => {
    const { generateAIText } = await import("../lib/ai/openai-client");

    // OPENAI_API_KEY is set in .env. The guard must still short-circuit,
    // otherwise a leaked key would silently start incurring spend.
    await assert.rejects(() => generateAIText({ systemPrompt: "s", userPrompt: "u" }));
  });
});
