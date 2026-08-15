import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import pg from "pg";

/**
 * The database is optional at build and dev time. Without DATABASE_URL the
 * public site falls back to the seed content in src/data (see content.ts), so
 * `next build` and CI succeed without secrets. Admin features require a real
 * database and say so plainly in the UI.
 *
 * Prisma 7 connects through a driver adapter rather than a URL in the schema.
 *
 * Supabase free tier: session mode (port 5432) caps clients at pool_size (~15).
 * Prefer the Transaction pooler URL (port 6543, host …pooler.supabase.com) for
 * DATABASE_URL in .env — see Supabase → Project Settings → Database → Connect.
 * Keep this Node pool tiny so hot-reload / multiple terminals cannot exhaust it.
 */
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: pg.Pool;
};

/** Session-mode URLs hold one DB client for the life of each pool connection. */
function isSessionModeUrl(url: string): boolean {
  try {
    const { port, hostname } = new URL(url);
    if (port === "6543") return false;
    if (hostname.includes("pooler.supabase.com") && port === "5432") return true;
    return port === "5432" || port === "";
  } catch {
    return true;
  }
}

function poolMaxFor(url: string): number {
  // Dev + HMR: one connection is enough. Session mode cannot spare more.
  if (process.env.NODE_ENV !== "production") return 1;
  if (isSessionModeUrl(url)) return 2;
  return 3;
}

function createClient(): PrismaClient | null {
  if (!isDatabaseConfigured) return null;

  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL!;
    const pool =
      globalForPrisma.pgPool ??
      new pg.Pool({
        connectionString,
        max: poolMaxFor(connectionString),
        // Release idle clients quickly so restarts / HMR free Supabase slots.
        idleTimeoutMillis: 5_000,
        connectionTimeoutMillis: 15_000,
        allowExitOnIdle: true,
        ssl: { rejectUnauthorized: false },
      });
    globalForPrisma.pgPool = pool;
    globalForPrisma.prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  }

  return globalForPrisma.prisma;
}

export const prisma = createClient();
