/**
 * Class times are recurring wall-clock patterns, stored as a weekday index plus
 * minutes from midnight. Formatting therefore never touches Date/timezones.
 */

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export type SchedulePreference = "weekday" | "weekend" | "either";

export function isWeekend(dayOfWeek: number): boolean {
  return dayOfWeek === 0 || dayOfWeek === 6;
}

export function formatMinutes(minutes: number): string {
  const total = ((minutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(total / 60);
  const mins = total % 60;
  const period = hours24 < 12 ? "AM" : "PM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(mins).padStart(2, "0")} ${period}`;
}

/** Converts an `<input type="time">` value ("14:30") to minutes from midnight. */
export function parseTimeToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
}

/** Renders minutes from midnight back into an `<input type="time">` value. */
export function minutesToTimeValue(minutes: number): string {
  const total = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function formatSlot(slot: {
  dayOfWeek: number;
  startMinutes: number;
  durationMin: number;
}): string {
  const day = DAY_NAMES[slot.dayOfWeek] ?? "";
  return `${day} ${formatMinutes(slot.startMinutes)} – ${formatMinutes(
    slot.startMinutes + slot.durationMin
  )}`;
}

export function openSeats(slot: { capacity: number; enrolledCount: number }): number {
  return Math.max(0, slot.capacity - slot.enrolledCount);
}

/** True when at least one active slot matches the parent's stated preference. */
export function matchesPreference(
  slots: { dayOfWeek: number; isActive?: boolean }[],
  preference: SchedulePreference
): boolean {
  if (preference === "either") return slots.length > 0;
  return slots.some((slot) => {
    if (slot.isActive === false) return false;
    return preference === "weekend" ? isWeekend(slot.dayOfWeek) : !isWeekend(slot.dayOfWeek);
  });
}

/** Detects colliding active slots for the same program. */
export function findOverlaps<T extends { dayOfWeek: number; startMinutes: number; durationMin: number; id?: string }>(
  slots: T[]
): [T, T][] {
  const collisions: [T, T][] = [];
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i];
      const b = slots[j];
      if (a.dayOfWeek !== b.dayOfWeek) continue;
      const aEnd = a.startMinutes + a.durationMin;
      const bEnd = b.startMinutes + b.durationMin;
      if (a.startMinutes < bEnd && b.startMinutes < aEnd) collisions.push([a, b]);
    }
  }
  return collisions;
}
