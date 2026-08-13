/**
 * `next build` typechecks both `.next/types` and `.next/dev/types` (via
 * tsconfig). After `next dev`, the latter can be incomplete/stale and fail
 * with "Cannot find name 'RouteHandlerConfig'". Remove it before production
 * builds so local `npm run build` matches a clean Vercel checkout.
 */
import { rmSync } from "node:fs";

try {
  rmSync(".next/dev", { recursive: true, force: true });
} catch {
  // Nothing to clean.
}
