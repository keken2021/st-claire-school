import type { ReactNode } from "react";
import { AlertTriangle, Check, CircleHelp, TriangleAlert } from "lucide-react";
import type { ActionState } from "@/app/admin/action-state";

/** Shared input styles — larger touch targets and readable text for all ages. */
const INPUT =
  "w-full rounded-xl border-2 border-ink/10 bg-white px-4 py-3 text-base text-ink outline-none transition-colors focus:border-rose-400 focus:ring-2 focus:ring-rose-100";

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-8">
      <h1 className="font-display text-2xl font-semibold tracking-display text-ink sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink/75">{description}</p>
      {children}
    </header>
  );
}

/** Plain-language tip box at the top of a page or section. */
export function HelpBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-5 flex gap-3 rounded-2xl border-2 border-sky-200 bg-sky-50 px-5 py-4">
      <CircleHelp
        size={22}
        className="mt-0.5 shrink-0 text-sky-700"
        strokeWidth={1.75}
        aria-hidden
      />
      <div>
        <p className="text-base font-semibold text-sky-900">{title}</p>
        <div className="mt-1.5 text-sm leading-relaxed text-sky-900/85">{children}</div>
      </div>
    </div>
  );
}

/** Numbered step badge for multi-part edit screens. */
export function StepBadge({ step, label }: { step: number; label: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-600 text-lg font-bold text-white"
        aria-hidden
      >
        {step}
      </span>
      <p className="text-lg font-semibold text-ink">{label}</p>
    </div>
  );
}

export function Field({
  label,
  name,
  hint,
  errors,
  required,
  children,
}: {
  label: string;
  name: string;
  hint?: string;
  errors?: string[];
  required?: boolean;
  children: ReactNode;
}) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-base font-semibold text-ink">
        {label}
        {required && (
          <span className="ml-1 font-normal text-rose-600" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {hint && !errors?.length && (
        <p className="mt-2 text-sm leading-relaxed text-ink/65">{hint}</p>
      )}
      {errors?.map((error) => (
        <p key={error} id={errorId} role="alert" className="mt-2 text-sm font-medium text-rose-700">
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
  return (
    <select
      {...props}
      className={`${INPUT} cursor-pointer ${props.className ?? ""}`}
    />
  );
}

/** Large, easy-to-tap checkbox with a clear on/off label. */
export function ToggleField({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-xl border-2 border-ink/10 bg-mist/30 px-4 py-4 transition-colors has-[:checked]:border-rose-300 has-[:checked]:bg-rose-50/50">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-1 h-6 w-6 shrink-0 rounded-md border-2 border-ink/20 accent-rose-600"
      />
      <span>
        <span className="block text-base font-semibold text-ink">{label}</span>
        {hint && <span className="mt-1 block text-sm text-ink/65">{hint}</span>}
      </span>
    </label>
  );
}

export function SubmitButton({
  pending,
  children = "Save changes",
  variant = "primary",
  className = "",
}: {
  pending: boolean;
  children?: ReactNode;
  variant?: "primary" | "quiet" | "danger";
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
      : variant === "danger"
        ? "border-2 border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
        : "border-2 border-ink/12 bg-white text-ink hover:border-rose-300 hover:text-rose-700";

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold transition-colors disabled:opacity-60 ${styles} ${className}`}
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

/** Result banner shared by every admin form, including overlap warnings. */
export function FormStatus({ state }: { state: ActionState }) {
  if (state.status === "idle" && !state.warnings?.length) return null;

  return (
    <div aria-live="polite" className="space-y-3">
      {state.status === "success" && state.message && (
        <p className="flex items-center gap-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3.5 text-base font-medium text-emerald-800">
          <Check size={20} strokeWidth={2.5} aria-hidden />
          {state.message}
        </p>
      )}
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="flex items-center gap-3 rounded-xl border-2 border-rose-200 bg-rose-50 px-4 py-3.5 text-base font-medium text-rose-800"
        >
          <AlertTriangle size={20} strokeWidth={2} aria-hidden />
          {state.message}
        </p>
      )}
      {state.warnings?.map((warning) => (
        <p
          key={warning}
          className="flex items-start gap-3 rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-3.5 text-base text-amber-900"
        >
          <TriangleAlert size={20} className="mt-0.5 shrink-0" strokeWidth={2} aria-hidden />
          {warning}
        </p>
      ))}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border-2 border-ink/[0.06] bg-white p-6 sm:p-7 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="font-display text-xl font-semibold tracking-display text-ink">{children}</h2>
      {hint && <p className="mt-2 text-base leading-relaxed text-ink/70">{hint}</p>}
    </div>
  );
}

/** Visual separator for "add new" areas inside a card. */
export function AddNewSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-8 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/40 p-5 sm:p-6">
      <p className="text-lg font-semibold text-ink">{title}</p>
      {description && (
        <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </div>
  );
}
