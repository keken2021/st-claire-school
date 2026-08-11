import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { prisma } from "./lib/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * A valid bcrypt hash of a value nobody knows. Comparing against it when an
 * email does not exist keeps the response time similar to a real miss, so the
 * login form cannot be used to enumerate accounts.
 */
const DECOY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKcEe.7bpQlM2H8T5cQmL8kFRb3H1a0uHzZ2u";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        if (!prisma) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          await bcrypt.compare(password, DECOY_HASH);
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
});

/**
 * Authoritative session check for server components and server actions.
 *
 * Middleware gates the /admin route for user experience, but server actions are
 * independently reachable endpoints, so each one calls this itself rather than
 * assuming the route gate ran.
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Not authorised");
  }

  return session.user;
}
