import Anthropic from "@anthropic-ai/sdk";

function createClient() {
  return new Anthropic({ apiKey: process.env.CLAUDE_API! });
}

const globalForAnthropic = globalThis as unknown as { anthropic: Anthropic };
export const anthropic = globalForAnthropic.anthropic || createClient();

if (process.env.NODE_ENV !== "production") globalForAnthropic.anthropic = anthropic;
