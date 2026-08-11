import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * The database is optional at build and dev time. Without DATABASE_URL the
 * public site falls back to the seed content in src/data (see content.ts), so
 * `next build` and CI succeed without secrets. Admin features require a real
 * database and say so plainly in the UI.
 *
 * Prisma 7 connects through a driver adapter rather than a URL in the schema.
 */
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient | null {
  if (!isDatabaseConfigured) return null;

  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }

  return globalForPrisma.prisma;
}

export const prisma = createClient();
