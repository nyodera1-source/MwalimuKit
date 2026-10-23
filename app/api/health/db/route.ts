import { NextResponse } from "next/server";
import { Pool } from "pg";

export const dynamic = "force-dynamic";

function readDatabaseUrl() {
  const raw = process.env.DATABASE_URL;

  if (!raw) {
    return { raw, parsed: null, error: "DATABASE_URL is missing" };
  }

  try {
    return { raw, parsed: new URL(raw), error: null };
  } catch {
    return { raw, parsed: null, error: "DATABASE_URL is not a valid URL" };
  }
}

export async function GET() {
  const { raw, parsed } = readDatabaseUrl();

  if (!raw || !parsed) {
    return NextResponse.json(
      { ok: false },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  const pool = new Pool({
    connectionString: raw,
    max: 1,
    connectionTimeoutMillis: 5000,
  });

  try {
    await pool.query("select 1");

    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (dbError) {
    return NextResponse.json(
      { ok: false },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  } finally {
    await pool.end();
  }
}
