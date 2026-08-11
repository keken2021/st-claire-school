import type { ClassSlot, Program } from "@/types";

/** Minimal program builder so each test states only what it cares about. */
export function makeProgram(overrides: Partial<Program> & { id: string }): Program {
  return {
    slug: overrides.id,
    name: overrides.id,
    category: "Music",
    interest: "music",
    description: `${overrides.id} description`,
    ageGroup: "Ages 5+",
    minAge: 5,
    skillLevel: "Beginner to Advanced",
    duration: "60 min / session",
    icon: "Piano",
    image: null,
    sortOrder: 1,
    isActive: true,
    slots: [],
    tuition: [],
    ...overrides,
  };
}

export function makeSlot(overrides: Partial<ClassSlot> & { id: string }): ClassSlot {
  return {
    programId: "program",
    dayOfWeek: 6,
    startMinutes: 540,
    durationMin: 60,
    capacity: 6,
    enrolledCount: 0,
    isActive: true,
    ...overrides,
  };
}
