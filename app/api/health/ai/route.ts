import { openaiModel } from "@/lib/ai/openai-client";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    provider: "openai",
    model: openaiModel,
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    routeVersion: "openai-health-2026-05-16",
  });
}
