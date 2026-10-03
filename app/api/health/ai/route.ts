import { openaiModel, liveAIEnabled } from "@/lib/ai/openai-client";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    provider: "openai",
    model: openaiModel,
    // Live generation is off by default (ENABLE_LIVE_AI). Reporting the
    // key as available while generation is disabled would be misleading.
    liveAIEnabled,
    hasOpenAIKey: liveAIEnabled && Boolean(process.env.OPENAI_API_KEY),
    routeVersion: "openai-health-2026-05-16",
  });
}
