import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Live lesson-plan generation is not available." },
    { status: 410 }
  );
}
