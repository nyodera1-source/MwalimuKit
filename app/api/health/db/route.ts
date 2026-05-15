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
  const { raw, parsed, error } = readDatabaseUrl();

  if (!raw || !parsed) {
    return NextResponse.json(
      {
        ok: false,
        databaseUrlPresent: Boolean(raw),
        databaseUrlError: error,
        authSecretPresent: Boolean(
          process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
        ),
      },
      { status: 500 }
    );
  }

  const pool = new Pool({
    connectionString: raw,
    max: 1,
    connectionTimeoutMillis: 5000,
  });

  try {
    await pool.query("select 1");

    return NextResponse.json({
      ok: true,
      databaseUrlPresent: true,
      databaseHost: parsed.hostname,
      databasePort: parsed.port,
      databaseName: parsed.pathname.replace(/^\//, ""),
      authSecretPresent: Boolean(
        process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
      ),
    });
  } catch (dbError) {
    const error = dbError as NodeJS.ErrnoException;

    return NextResponse.json(
      {
        ok: false,
        databaseUrlPresent: true,
        databaseHost: parsed.hostname,
        databasePort: parsed.port,
        databaseName: parsed.pathname.replace(/^\//, ""),
        authSecretPresent: Boolean(
          process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
        ),
        errorCode: error.code,
        errorMessage: error.message,
      },
      { status: 500 }
    );
  } finally {
    await pool.end();
  }
}
