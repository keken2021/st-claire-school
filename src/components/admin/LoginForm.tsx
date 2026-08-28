"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { signInWithCredentials } from "@/app/admin/auth-actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signInWithCredentials, null);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block text-base font-semibold text-ink">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded-xl border-2 border-ink/10 bg-white px-4 py-3.5 text-base text-ink outline-none transition-colors focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-base font-semibold text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border-2 border-ink/10 bg-white px-4 py-3.5 text-base text-ink outline-none transition-colors focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
        />
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-xl border-2 border-rose-200 bg-rose-50 px-4 py-3.5 text-base font-medium text-rose-800"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
      >
        <LogIn size={20} strokeWidth={2} aria-hidden />
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
