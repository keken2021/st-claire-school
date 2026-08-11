"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { signInWithCredentials } from "@/app/admin/auth-actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signInWithCredentials, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded-lg border border-ink/12 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-rose-400"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-ink/12 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-rose-400"
        />
      </div>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
      >
        <LogIn size={16} strokeWidth={1.75} />
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
