import { describe, expect, it } from "vitest";
import { recommendPrograms, type FinderAnswers } from "./recommend";
import { makeProgram, makeSlot } from "./test-fixtures";

const baseAnswers: FinderAnswers = {
  age: 8,
  interest: "music",
  experience: "none",
  when: "weekend",
};

describe("recommendPrograms", () => {
  it("excludes programs whose minimum age is above the child's age", () => {
    const result = recommendPrograms(
      [
        makeProgram({ id: "ukulele", minAge: 4 }),
        makeProgram({ id: "theory", minAge: 12 }),
      ],
      { ...baseAnswers, age: 6 }
    );

    expect(result.status).toBe("matched");
    expect(result.recommendations.map((entry) => entry.program.id)).toEqual(["ukulele"]);
  });

  it("reports too-young rather than returning nothing when the child misses every minimum", () => {
    const result = recommendPrograms(
      [
        makeProgram({ id: "ballet", minAge: 4, sortOrder: 2 }),
        makeProgram({ id: "ukulele", minAge: 4, sortOrder: 1 }),
        makeProgram({ id: "voice", minAge: 7 }),
      ],
      { ...baseAnswers, age: 3 }
    );

    expect(result.status).toBe("too-young");
    expect(result.eligibleAtAge).toBe(4);
    // Nearest-eligible programs, in the school's preferred order.
    expect(result.recommendations.map((entry) => entry.program.id)).toEqual([
      "ukulele",
      "ballet",
    ]);
  });

  it("ranks a matching interest above a non-matching one", () => {
    const result = recommendPrograms(
      [
        makeProgram({ id: "ballet", interest: "movement", sortOrder: 1 }),
        makeProgram({ id: "piano", interest: "music", sortOrder: 2 }),
      ],
      { ...baseAnswers, interest: "music" }
    );

    expect(result.recommendations[0].program.id).toBe("piano");
  });

  it("does not bias toward any interest when the parent is unsure", () => {
    const programs = [
      makeProgram({ id: "piano", interest: "music", sortOrder: 1 }),
      makeProgram({ id: "ballet", interest: "movement", sortOrder: 2 }),
      makeProgram({ id: "speaking", interest: "speech", sortOrder: 3 }),
    ];

    const result = recommendPrograms(programs, { ...baseAnswers, interest: "unsure" });

    expect(result.recommendations).toHaveLength(3);
    // Equal on every other axis, so the school's own ordering decides.
    expect(result.recommendations.map((entry) => entry.program.id)).toEqual([
      "piano",
      "ballet",
      "speaking",
    ]);
  });

  it("prefers a program with a slot on the requested days", () => {
    const result = recommendPrograms(
      [
        makeProgram({
          id: "weekday-only",
          sortOrder: 1,
          slots: [makeSlot({ id: "s1", dayOfWeek: 3 })],
        }),
        makeProgram({
          id: "weekend-open",
          sortOrder: 2,
          slots: [makeSlot({ id: "s2", dayOfWeek: 6 })],
        }),
      ],
      { ...baseAnswers, when: "weekend" }
    );

    expect(result.recommendations[0].program.id).toBe("weekend-open");
  });

  it("ignores inactive slots when matching the schedule preference", () => {
    const result = recommendPrograms(
      [
        makeProgram({
          id: "cancelled-weekend",
          slots: [makeSlot({ id: "s1", dayOfWeek: 6, isActive: false })],
        }),
      ],
      { ...baseAnswers, when: "weekend" }
    );

    const reasons = result.recommendations[0].reasons;
    expect(reasons).not.toContain("Has weekend classes");
    expect(reasons).not.toContain("Has open seats right now");
  });

  it("credits beginners only to programs that welcome them", () => {
    const result = recommendPrograms(
      [
        makeProgram({ id: "advanced-only", skillLevel: "Advanced", sortOrder: 1 }),
        makeProgram({ id: "beginner-ok", skillLevel: "Beginner", sortOrder: 2 }),
      ],
      { ...baseAnswers, experience: "none" }
    );

    expect(result.recommendations[0].program.id).toBe("beginner-ok");
    expect(result.recommendations[0].reasons).toContain("Welcomes complete beginners");
  });

  it("flags open seats only when a slot actually has room", () => {
    const result = recommendPrograms(
      [
        makeProgram({
          id: "full",
          slots: [makeSlot({ id: "s1", capacity: 6, enrolledCount: 6 })],
        }),
      ],
      baseAnswers
    );

    expect(result.recommendations[0].reasons).not.toContain("Has open seats right now");
  });

  it("skips inactive programs entirely", () => {
    const result = recommendPrograms(
      [makeProgram({ id: "retired", isActive: false }), makeProgram({ id: "live" })],
      baseAnswers
    );

    expect(result.recommendations.map((entry) => entry.program.id)).toEqual(["live"]);
  });

  it("returns at most three recommendations", () => {
    const programs = Array.from({ length: 8 }, (_, index) =>
      makeProgram({ id: `p${index}`, sortOrder: index })
    );

    expect(recommendPrograms(programs, baseAnswers).recommendations).toHaveLength(3);
  });

  it("treats a non-numeric age from the URL as zero rather than crashing", () => {
    const result = recommendPrograms([makeProgram({ id: "piano", minAge: 5 })], {
      ...baseAnswers,
      age: Number.NaN,
    });

    expect(result.status).toBe("too-young");
    expect(result.eligibleAtAge).toBe(5);
  });

  it("clamps a negative age instead of matching everything", () => {
    const result = recommendPrograms([makeProgram({ id: "piano", minAge: 5 })], {
      ...baseAnswers,
      age: -12,
    });

    expect(result.status).toBe("too-young");
  });

  it("still recommends programs to adults, with a weaker age-fit bonus", () => {
    const teenTrack = makeProgram({ id: "teen", minAge: 14, sortOrder: 2 });
    const kidTrack = makeProgram({ id: "kids", minAge: 4, sortOrder: 1 });

    const result = recommendPrograms([kidTrack, teenTrack], { ...baseAnswers, age: 20 });

    expect(result.status).toBe("matched");
    expect(result.recommendations[0].program.id).toBe("teen");
  });

  it("returns an empty matched result when there are no active programs at all", () => {
    const result = recommendPrograms([makeProgram({ id: "x", isActive: false })], baseAnswers);

    expect(result.status).toBe("matched");
    expect(result.recommendations).toEqual([]);
  });

  it("is deterministic for identical inputs", () => {
    const programs = [
      makeProgram({ id: "a", sortOrder: 1 }),
      makeProgram({ id: "b", sortOrder: 2 }),
      makeProgram({ id: "c", sortOrder: 3 }),
    ];

    const first = recommendPrograms(programs, baseAnswers);
    const second = recommendPrograms(programs, baseAnswers);

    expect(first.recommendations.map((entry) => entry.program.id)).toEqual(
      second.recommendations.map((entry) => entry.program.id)
    );
  });
});
