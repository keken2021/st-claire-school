import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// The session is per-request, so nothing here may be prerendered.
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/programs", label: "Programs & Schedule" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/insights", label: "Inquiry Insights" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Authoritative check. Middleware already gated this route, but a layout that
  // trusts the gate alone breaks the moment the matcher changes.
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-mist/40">
      <header className="border-b border-ink/[0.08] bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="font-display text-lg font-semibold tracking-display text-ink">
              St. Claire Admin
            </p>
            <p className="text-xs text-ink/65">
              Signed in as {session.user.email} · {session.user.role}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-ink/70 hover:text-ink">
              View site
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-ink/10 px-4 py-2 text-sm font-medium text-ink/70 hover:border-rose-300 hover:text-rose-700"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Admin sections" className="mx-auto max-w-6xl px-6">
          <ul className="flex flex-wrap gap-1 pb-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink/70 hover:bg-mist hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {!isDatabaseConfigured && (
        <div className="mx-auto mt-6 max-w-6xl px-6">
          <p className="rounded-xl border border-gold/40 bg-gold/10 px-5 py-4 text-sm text-gold-dark">
            No database is configured. Set <code>DATABASE_URL</code> and run{" "}
            <code>npm run db:push &amp;&amp; npm run db:seed</code> to enable editing. The public
            site is currently serving the built-in seed content.
          </p>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
