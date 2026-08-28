"use client";

import { useMemo, useState } from "react";
import type { ClassSlot } from "@/types";
import { DAY_NAMES, DAY_SHORT, formatMinutes, openSeats } from "@/lib/schedule";

type DayGroup = {
  dayOfWeek: number;
  slots: ClassSlot[];
};

function groupByDay(slots: ClassSlot[]): DayGroup[] {
  const byDay = new Map<number, ClassSlot[]>();
  for (const slot of slots) {
    const list = byDay.get(slot.dayOfWeek) ?? [];
    list.push(slot);
    byDay.set(slot.dayOfWeek, list);
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => a - b)
    .map(([dayOfWeek, daySlots]) => ({
      dayOfWeek,
      slots: [...daySlots].sort((a, b) => a.startMinutes - b.startMinutes),
    }));
}

function summarizeDays(days: number[]): string {
  const names = days.map((day) => DAY_NAMES[day] ?? "");
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

function defaultDay(groups: DayGroup[]): number {
  const today = new Date().getDay();
  return groups.find((group) => group.dayOfWeek === today)?.dayOfWeek ?? groups[0].dayOfWeek;
}

export default function ClassTimesSchedule({ slots }: { slots: ClassSlot[] }) {
  const groups = useMemo(() => groupByDay(slots), [slots]);
  const [selectedDay, setSelectedDay] = useState(() => defaultDay(groups));

  const active =
    groups.find((group) => group.dayOfWeek === selectedDay) ?? groups[0];

  if (!active) return null;

  const dayLabel = summarizeDays(groups.map((group) => group.dayOfWeek));
  const showTabs = groups.length > 1;

  return (
    <div className="mt-4 rounded-2xl border border-ink/[0.06] bg-white overflow-hidden">
      <p className="px-5 pt-4 text-sm text-ink/65 leading-relaxed">
        Classes on {dayLabel}. {showTabs ? "Pick a day to see times." : "Times for this day:"}
      </p>

      {showTabs && (
        <div
          role="tablist"
          aria-label="Class days"
          className="mt-4 flex gap-2 overflow-x-auto px-5 pb-1"
        >
          {groups.map((group) => {
            const selected = group.dayOfWeek === active.dayOfWeek;
            const availableCount = group.slots.filter((slot) => openSeats(slot) > 0).length;
            return (
              <button
                key={group.dayOfWeek}
                type="button"
                role="tab"
                id={`class-day-tab-${group.dayOfWeek}`}
                aria-selected={selected}
                aria-controls={`class-day-panel-${group.dayOfWeek}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setSelectedDay(group.dayOfWeek)}
                className={`shrink-0 rounded-lg border px-3.5 py-2 text-left transition-colors ${
                  selected
                    ? "border-rose-600 bg-rose-600 text-white"
                    : "border-ink/10 bg-cream/60 text-ink/75 hover:border-rose-300 hover:text-rose-600"
                }`}
              >
                <span className="block text-sm font-medium">
                  <span className="sm:hidden">{DAY_SHORT[group.dayOfWeek]}</span>
                  <span className="hidden sm:inline">{DAY_NAMES[group.dayOfWeek]}</span>
                </span>
                <span
                  className={`mt-0.5 block text-[0.65rem] ${
                    selected ? "text-white/75" : "text-ink/50"
                  }`}
                >
                  {group.slots.length} {group.slots.length === 1 ? "time" : "times"}
                  {availableCount > 0 ? ` · ${availableCount} open` : ""}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div
        role="tabpanel"
        id={`class-day-panel-${active.dayOfWeek}`}
        aria-labelledby={showTabs ? `class-day-tab-${active.dayOfWeek}` : undefined}
        className="p-5"
      >
        {!showTabs && (
          <p className="mb-3 text-sm font-medium text-ink">{DAY_NAMES[active.dayOfWeek]}</p>
        )}

        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {active.slots.map((slot) => {
            const seats = openSeats(slot);
            const available = seats > 0;
            return (
              <li key={slot.id}>
                <div
                  className={`rounded-xl border px-3 py-2.5 ${
                    available
                      ? "border-gold/35 bg-gold/[0.08]"
                      : "border-ink/[0.06] bg-cream/50"
                  }`}
                >
                  <p className="text-sm font-semibold text-ink tabular-nums">
                    {formatMinutes(slot.startMinutes)}
                  </p>
                  <p className="mt-0.5 text-[0.7rem] text-ink/55 tabular-nums">
                    to {formatMinutes(slot.startMinutes + slot.durationMin)}
                  </p>
                  {/* {available ? (
                    <p className="mt-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-gold-dark">
                      Available
                    </p>
                  ) : null} */}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
