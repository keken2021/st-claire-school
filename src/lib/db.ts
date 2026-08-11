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
 * Keep the pool small: Supabase session mode caps concurrent clients (~15 on
 * free tier), and Next build/runtime can otherwise exhaust it.
 */
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: pg.Pool;
};

function createClient(): PrismaClient | null {
  if (!isDatabaseConfigured) return null;

  if (!globalForPrisma.prisma) {
    const pool =
      globalForPrisma.pgPool ??
      new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        max: 3,
        idleTimeoutMillis: 10_000,
        connectionTimeoutMillis: 15_000,
        ssl: { rejectUnauthorized: false },
      });
    globalForPrisma.pgPool = pool;
    globalForPrisma.prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  }

  return globalForPrisma.prisma;
}

export const prisma = createClient();
