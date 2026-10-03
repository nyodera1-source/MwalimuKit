import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Live scheme generation is not available." },
    { status: 410 }
  );
}
