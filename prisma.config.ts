import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DIRECT_URL for migrations (bypasses PgBouncer)
    // Falls back to DATABASE_URL if DIRECT_URL not set. Prisma generate does
    // not connect to the database, so keep builds usable when no DB variable
    // is present; migration commands still require a real production URL.
    url:
      process.env["DIRECT_URL"] ||
      process.env["DATABASE_URL"] ||
      "postgresql://localhost:5432/mwalimukit",
  },
});
