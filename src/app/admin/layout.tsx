import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";
import { isDatabaseConfigured } from "@/lib/db";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Website Manager",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#f4f1ed]">
      <header className="border-b-2 border-ink/[0.06] bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="font-display text-xl font-semibold tracking-display text-ink sm:text-2xl">
              St. Claire Website Manager
            </p>
            <p className="mt-0.5 text-sm text-ink/65">
              Signed in as {session.user.email}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-ink/10 px-4 py-2.5 text-base font-medium text-ink/80 transition-colors hover:border-rose-300 hover:text-rose-700"
            >
              <ExternalLink size={18} strokeWidth={1.75} aria-hidden />
              View website
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-ink/10 px-4 py-2.5 text-base font-medium text-ink/70 transition-colors hover:border-rose-300 hover:text-rose-700"
              >
                <LogOut size={18} strokeWidth={1.75} aria-hidden />
                Sign out
              </button>
            </form>
          </div>
        </div>

        <AdminNav />
      </header>

      {!isDatabaseConfigured && (
        <div className="mx-auto mt-6 max-w-6xl px-4 sm:px-6">
          <p className="rounded-2xl border-2 border-amber-300 bg-amber-50 px-5 py-4 text-base text-amber-900">
            <strong>Editing is turned off.</strong> The website is showing sample content. Ask your
            developer to connect the database before you make changes.
          </p>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
