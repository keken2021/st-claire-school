import type { ReactNode } from "react";
import { AlertTriangle, Check, TriangleAlert } from "lucide-react";
import type { ActionState } from "@/app/admin/action-state";

const INPUT =
  "w-full rounded-lg border border-ink/12 bg-white px-3.5 py-2 text-sm text-ink outline-none focus:border-rose-400";

export function Field({
  label,
  name,
  hint,
  errors,
  children,
}: {
  label: string;
  name: string;
  hint?: string;
  errors?: string[];
  children: ReactNode;
}) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && !errors?.length && <p className="mt-1 text-xs text-ink/65">{hint}</p>}
      {errors?.map((error) => (
        <p key={error} id={errorId} role="alert" className="mt-1 text-xs text-rose-700">
          {error}
        </p>
      ))}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${INPUT} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${INPUT} ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${INPUT} ${props.className ?? ""}`} />;
}

export function SubmitButton({
  pending,
  children = "Save",
  variant = "primary",
}: {
  pending: boolean;
  children?: ReactNode;
  variant?: "primary" | "quiet";
}) {
  const styles =
    variant === "primary"
      ? "bg-rose-600 text-white hover:bg-rose-700"
      : "border border-ink/12 text-ink/70 hover:border-rose-300 hover:text-rose-700";

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${styles}`}
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

/** Result banner shared by every admin form, including overlap warnings. */
export function FormStatus({ state }: { state: ActionState }) {
  if (state.status === "idle" && !state.warnings?.length) return null;

  return (
    <div aria-live="polite" className="space-y-2">
      {state.status === "success" && state.message && (
        <p className="flex items-center gap-2 rounded-lg bg-rose-50 px-3.5 py-2 text-sm text-rose-700">
          <Check size={15} /> {state.message}
        </p>
      )}
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-rose-100 px-3.5 py-2 text-sm text-rose-800"
        >
          <AlertTriangle size={15} /> {state.message}
        </p>
      )}
      {state.warnings?.map((warning) => (
        <p
          key={warning}
          className="flex items-start gap-2 rounded-lg bg-gold/10 px-3.5 py-2 text-sm text-gold-dark"
        >
          <TriangleAlert size={15} className="mt-0.5 shrink-0" /> {warning}
        </p>
      ))}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-ink/[0.08] bg-white p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-lg font-semibold tracking-display text-ink">{children}</h2>
      {hint && <p className="mt-1 text-sm text-ink/70">{hint}</p>}
    </div>
  );
}
