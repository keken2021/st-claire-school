import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isDatabaseConfigured } from "@/lib/db";
import LoginForm from "@/components/admin/LoginForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Staff Sign In",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <div className="absolute inset-0 bg-spotlight" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
          />
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-display text-white">
            Staff Sign In
          </h1>
          <p className="mt-1.5 text-sm text-white/50">
            {site.shortName} content and schedule management
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-elev">
          {isDatabaseConfigured ? (
            <LoginForm />
          ) : (
            <p className="text-sm leading-relaxed text-ink/70">
              Sign in is unavailable because no database is configured. Set{" "}
              <code className="text-ink">DATABASE_URL</code> and{" "}
              <code className="text-ink">AUTH_SECRET</code>, then run{" "}
              <code className="text-ink">npm run db:push &amp;&amp; npm run db:seed</code>.
            </p>
          )}
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-white/55 hover:text-white"
        >
          Back to the website
        </Link>
      </div>
    </div>
  );
}
