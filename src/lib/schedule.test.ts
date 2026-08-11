import { describe, expect, it } from "vitest";
import {
  findOverlaps,
  formatMinutes,
  formatSlot,
  matchesPreference,
  openSeats,
} from "./schedule";
import { toAgeBucket } from "./privacy";

describe("formatMinutes", () => {
  it("renders midnight and noon without a zero hour", () => {
    expect(formatMinutes(0)).toBe("12:00 AM");
    expect(formatMinutes(720)).toBe("12:00 PM");
  });

  it("renders school hours in twelve-hour time", () => {
    expect(formatMinutes(480)).toBe("8:00 AM");
    expect(formatMinutes(1020)).toBe("5:00 PM");
    expect(formatMinutes(945)).toBe("3:45 PM");
  });

  it("wraps values outside a single day", () => {
    expect(formatMinutes(1440)).toBe("12:00 AM");
    expect(formatMinutes(-60)).toBe("11:00 PM");
  });
});

describe("formatSlot", () => {
  it("shows the day and the full time range", () => {
    expect(formatSlot({ dayOfWeek: 6, startMinutes: 540, durationMin: 60 })).toBe(
      "Saturday 9:00 AM – 10:00 AM"
    );
  });
});

describe("openSeats", () => {
  it("derives remaining seats from capacity", () => {
    expect(openSeats({ capacity: 6, enrolledCount: 4 })).toBe(2);
  });

  it("never reports negative seats if the data drifts", () => {
    expect(openSeats({ capacity: 6, enrolledCount: 9 })).toBe(0);
  });
});

describe("matchesPreference", () => {
  const saturday = { dayOfWeek: 6 };
  const wednesday = { dayOfWeek: 3 };

  it("matches weekend against Saturday and Sunday only", () => {
    expect(matchesPreference([saturday], "weekend")).toBe(true);
    expect(matchesPreference([wednesday], "weekend")).toBe(false);
  });

  it("matches weekday against Monday to Friday", () => {
    expect(matchesPreference([wednesday], "weekday")).toBe(true);
    expect(matchesPreference([saturday], "weekday")).toBe(false);
  });

  it("treats either as satisfied by any slot, and unsatisfied with none", () => {
    expect(matchesPreference([wednesday], "either")).toBe(true);
    expect(matchesPreference([], "either")).toBe(false);
  });

  it("ignores slots marked inactive", () => {
    expect(matchesPreference([{ dayOfWeek: 6, isActive: false }], "weekend")).toBe(false);
  });
});

describe("findOverlaps", () => {
  it("flags two classes sharing a day and time", () => {
    const overlaps = findOverlaps([
      { id: "a", dayOfWeek: 6, startMinutes: 540, durationMin: 60 },
      { id: "b", dayOfWeek: 6, startMinutes: 570, durationMin: 60 },
    ]);

    expect(overlaps).toHaveLength(1);
  });

  it("allows back-to-back classes", () => {
    const overlaps = findOverlaps([
      { id: "a", dayOfWeek: 6, startMinutes: 540, durationMin: 60 },
      { id: "b", dayOfWeek: 6, startMinutes: 600, durationMin: 60 },
    ]);

    expect(overlaps).toHaveLength(0);
  });

  it("does not compare different days", () => {
    const overlaps = findOverlaps([
      { id: "a", dayOfWeek: 3, startMinutes: 540, durationMin: 60 },
      { id: "b", dayOfWeek: 6, startMinutes: 540, durationMin: 60 },
    ]);

    expect(overlaps).toHaveLength(0);
  });
});

describe("toAgeBucket", () => {
  it("buckets ages so no exact age is ever stored", () => {
    expect(toAgeBucket(4)).toBe("3-4");
    expect(toAgeBucket(5)).toBe("5-6");
    expect(toAgeBucket(9)).toBe("7-9");
    expect(toAgeBucket(10)).toBe("10-12");
    expect(toAgeBucket(17)).toBe("13-17");
    expect(toAgeBucket(34)).toBe("18+");
  });

  it("returns nothing for missing or nonsensical ages", () => {
    expect(toAgeBucket(0)).toBeUndefined();
    expect(toAgeBucket(Number.NaN)).toBeUndefined();
  });
});
