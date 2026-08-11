"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Minus, Plus } from "lucide-react";
import { idleState } from "@/app/admin/action-state";
import { setEnrolledCount } from "@/app/admin/actions";

/**
 * Enrolled-count stepper.
 *
 * Staff adjust these counts constantly while parents are standing in front of
 * them, so the number updates immediately via useOptimistic and reverts with an
 * explanation if the write is rejected.
 */
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
        setError(result.message ?? "Could not save that change.");
      }
    });
  };

  const open = Math.max(0, capacity - optimisticCount);

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => change(-1)}
          disabled={optimisticCount === 0}
          aria-label="One fewer student enrolled"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/12 text-ink/70 hover:border-rose-300 hover:text-rose-700 disabled:opacity-40"
        >
          <Minus size={14} />
        </button>

        <span className="min-w-24 text-center text-sm tabular-nums text-ink">
          <span className="font-semibold">{optimisticCount}</span>
          <span className="text-ink/65"> / {capacity} enrolled</span>
        </span>

        <button
          type="button"
          onClick={() => change(1)}
          disabled={optimisticCount >= capacity}
          aria-label="One more student enrolled"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/12 text-ink/70 hover:border-rose-300 hover:text-rose-700 disabled:opacity-40"
        >
          <Plus size={14} />
        </button>
      </div>

      <p aria-live="polite" className="mt-1 text-xs text-ink/65">
        {error ? (
          <span className="text-rose-700">{error}</span>
        ) : open > 0 ? (
          `${open} ${open === 1 ? "seat" : "seats"} shown as open`
        ) : (
          "Shown as full — CTA switches to the waitlist"
        )}
      </p>
    </div>
  );
}
