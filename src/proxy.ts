import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Gates /admin at the edge (Next 16's proxy convention, formerly middleware).
 *
 * This is the first line of defence, not the only one: the admin layout re-reads
 * the session and every server action calls requireAdmin(), because actions are
 * reachable independently of this matcher.
 *
 * With AUTH_SECRET unset this throws rather than letting requests through, which
 * is the correct direction to fail.
 */
const { auth: proxy } = NextAuth(authConfig);

export default proxy;

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
