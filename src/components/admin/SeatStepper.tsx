"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Minus, Plus } from "lucide-react";
import { idleState } from "@/app/admin/action-state";
import { setEnrolledCount } from "@/app/admin/actions";

export default function SeatStepper({
  slotId,
  enrolledCount,
  capacity,
}: {
  slotId: string;
  enrolledCount: number;
  capacity: number;
}) {
  const [optimisticCount, applyOptimistic] = useOptimistic(
    enrolledCount,
    (_current, next: number) => next
  );
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const change = (delta: number) => {
    const next = optimisticCount + delta;
    if (next < 0 || next > capacity) return;

    startTransition(async () => {
      applyOptimistic(next);
      setError(null);

      const formData = new FormData();
      formData.set("id", slotId);
      formData.set("enrolledCount", String(next));

      const result = await setEnrolledCount(idleState, formData);
      if (result.status === "error") {
        setError(result.message ?? "Could not save. Please try again.");
      }
    });
  };

  const open = Math.max(0, capacity - optimisticCount);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => change(-1)}
          disabled={optimisticCount === 0}
          aria-label="Remove one student"
          className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink/12 bg-white text-ink transition-colors hover:border-rose-300 hover:bg-rose-50 disabled:opacity-40"
        >
          <Minus size={22} strokeWidth={2.5} aria-hidden />
        </button>

        <div className="min-w-[140px] rounded-xl bg-mist/50 px-5 py-3 text-center">
          <p className="text-2xl font-bold tabular-nums text-ink">{optimisticCount}</p>
          <p className="text-sm text-ink/65">of {capacity} enrolled</p>
        </div>

        <button
          type="button"
          onClick={() => change(1)}
          disabled={optimisticCount >= capacity}
          aria-label="Add one student"
          className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink/12 bg-white text-ink transition-colors hover:border-rose-300 hover:bg-rose-50 disabled:opacity-40"
        >
          <Plus size={22} strokeWidth={2.5} aria-hidden />
        </button>
      </div>

      <p aria-live="polite" className="mt-3 text-base text-ink/70">
        {error ? (
          <span className="font-medium text-rose-700">{error}</span>
        ) : open > 0 ? (
          <>
            <strong className="text-emerald-700">{open}</strong> open{" "}
            {open === 1 ? "seat shows" : "seats show"} as &ldquo;Available&rdquo; on the website
          </>
        ) : (
          "Class is full — parents can still message you to enquire"
        )}
      </p>
    </div>
  );
}
