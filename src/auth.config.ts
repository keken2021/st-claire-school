import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe half of the auth setup.
 *
 * Middleware runs on the edge runtime, where Prisma and bcrypt cannot go, so the
 * providers live in auth.ts and only this config is shared with middleware.
 */
export const authConfig = {
  // Required for local e2e / next start on 127.0.0.1 (Auth.js otherwise
  // rejects the host and leaves the credentials callback hanging).
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      if (!request.nextUrl.pathname.startsWith("/admin")) return true;
      return Boolean(auth?.user);
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "staff";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string) ?? "staff";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
