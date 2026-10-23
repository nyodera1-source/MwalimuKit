import { liveAIEnabled } from "@/lib/ai/openai-client";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: !liveAIEnabled || Boolean(process.env.OPENAI_API_KEY),
  }, { headers: { "Cache-Control": "no-store" } });
}
