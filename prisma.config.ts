import { defineConfig } from "prisma/config";

/**
 * Prisma 7 keeps connection details out of schema.prisma. The URL here is used
 * by CLI commands (migrate, db push, seed); the runtime client gets its
 * connection through the driver adapter in src/lib/db.ts.
 *
 * Next.js loads .env for the app, but the Prisma CLI runs outside it, so the
 * file is loaded explicitly. The datasource is omitted when DATABASE_URL is
 * absent so that `prisma generate` still works in CI without secrets.
 */
try {
  process.loadEnvFile(".env.local");
} catch {
  // .env.local is optional.
}

try {
  process.loadEnvFile(".env");
} catch {
  // .env is optional.
}

const url = process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  ...(url ? { datasource: { url } } : {}),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
