import type { Interest, Program } from "@/types";
import { matchesPreference, openSeats, type SchedulePreference } from "./schedule";

export type Experience = "none" | "some" | "experienced";
export type InterestAnswer = Interest | "unsure";

export interface FinderAnswers {
  age: number;
  interest: InterestAnswer;
  experience: Experience;
  when: SchedulePreference;
}

export interface Recommendation {
  program: Program;
  score: number;
  reasons: string[];
}

export interface RecommendationResult {
  /**
   * `matched` when at least one program accepts the child's age.
   * `too-young` when every program has a higher minimum age, in which case
   * `recommendations` holds the nearest-eligible programs and `eligibleAtAge`
   * says when they open up. Returning something useful here matters: an empty
   * result would dead-end the parent.
   */
  status: "matched" | "too-young";
  recommendations: Recommendation[];
  eligibleAtAge?: number;
}

const MAX_RESULTS = 3;

/** Guards against NaN, negatives, and implausible ages from URL params. */
function normalizeAge(age: number): number {
  if (!Number.isFinite(age)) return 0;
  return Math.min(99, Math.max(0, Math.floor(age)));
}

function beginnerFriendly(program: Program): boolean {
  const level = program.skillLevel.toLowerCase();
  return level.includes("beginner") || level.includes("all levels");
}

function advancedTrack(program: Program): boolean {
  const level = program.skillLevel.toLowerCase();
  return level.includes("advanced") || level.includes("all levels");
}

function activeSlots(program: Program) {
  return (program.slots ?? []).filter((slot) => slot.isActive);
}

function scoreProgram(program: Program, answers: FinderAnswers): Recommendation {
  const reasons: string[] = [];
  let score = 0;

  if (answers.interest === "unsure") {
    score += 12;
  } else if (program.interest === answers.interest) {
    score += 40;
    reasons.push(`Matches an interest in ${labelForInterest(program.interest)}`);
  }

  if (answers.experience === "none" && beginnerFriendly(program)) {
    score += 18;
    reasons.push("Welcomes complete beginners");
  } else if (answers.experience === "experienced" && advancedTrack(program)) {
    score += 18;
    reasons.push("Has an advanced track to grow into");
  } else if (answers.experience === "some" && beginnerFriendly(program)) {
    score += 10;
    reasons.push("Suits students with some experience");
  }

  const slots = activeSlots(program);
  if (answers.when === "either") {
    score += 8;
  } else if (matchesPreference(slots, answers.when)) {
    score += 20;
    reasons.push(answers.when === "weekend" ? "Has weekend classes" : "Has weekday classes");
  }

  // Age fit: eligible is a hard filter elsewhere, this rewards age-appropriateness.
  const age = normalizeAge(answers.age);
  if (age <= program.minAge + 8) {
    score += 12;
    reasons.push(`Designed for ages ${program.minAge} and up`);
  } else {
    score += 4;
  }

  const withOpenSeats = slots.filter((slot) => openSeats(slot) > 0);
  if (withOpenSeats.length > 0) {
    score += 6;
    reasons.push("Has open seats right now");
  }

  // Deterministic tiebreak so equal scores keep the school's preferred order.
  score -= program.sortOrder * 0.01;

  return { program, score, reasons };
}

function labelForInterest(interest: Interest): string {
  if (interest === "music") return "music";
  if (interest === "movement") return "dance and movement";
  return "speech and academics";
}

/**
 * Pure recommendation engine. No I/O, no dates, no randomness, so its behaviour
 * is fully determined by its inputs and can be unit tested directly.
 */
export function recommendPrograms(
  allPrograms: Program[],
  answers: FinderAnswers
): RecommendationResult {
  const age = normalizeAge(answers.age);
  const available = allPrograms.filter((program) => program.isActive);
  const eligible = available.filter((program) => age >= program.minAge);

  if (eligible.length === 0) {
    const upcomingAge = available.reduce(
      (min, program) => Math.min(min, program.minAge),
      Number.POSITIVE_INFINITY
    );

    if (!Number.isFinite(upcomingAge)) {
      return { status: "matched", recommendations: [] };
    }

    const nearest = available
      .filter((program) => program.minAge === upcomingAge)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(0, MAX_RESULTS)
      .map((program) => ({
        program,
        score: 0,
        reasons: [`Opens up at age ${program.minAge}`],
      }));

    return { status: "too-young", recommendations: nearest, eligibleAtAge: upcomingAge };
  }

  const ranked = eligible
    .map((program) => scoreProgram(program, { ...answers, age }))
    .sort((a, b) => b.score - a.score || a.program.sortOrder - b.program.sortOrder)
    .slice(0, MAX_RESULTS);

  return { status: "matched", recommendations: ranked };
}
