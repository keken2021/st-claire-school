"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import type { Program } from "@/types";
import { recommendPrograms, type Experience, type InterestAnswer } from "@/lib/recommend";
import type { SchedulePreference } from "@/lib/schedule";
import { formatSlot, openSeats } from "@/lib/schedule";
import { sendInquiryEvent } from "@/lib/events";
import { toAgeBucket } from "@/lib/privacy";
import MessengerCta from "./MessengerCta";
import ProgramImage from "./ProgramImage";

/**
 * Guided program finder.
 *
 * Answers live in the URL rather than component state, which makes a result
 * shareable, keeps the browser Back button meaningful, and removes any need to
 * keep two sources of truth in sync.
 */

const INTEREST_OPTIONS: { value: InterestAnswer; label: string; hint: string }[] = [
  { value: "music", label: "Music", hint: "Piano, voice, violin, guitar, ukulele" },
  { value: "movement", label: "Dance & Movement", hint: "Ballet, dance, pasarela" },
  { value: "speech", label: "Speech & Academics", hint: "Public speaking, tutorials" },
  { value: "unsure", label: "Not sure yet", hint: "Show me what fits their age" },
];

const EXPERIENCE_OPTIONS: { value: Experience; label: string; hint: string }[] = [
  { value: "none", label: "Complete beginner", hint: "Never had lessons before" },
  { value: "some", label: "A little experience", hint: "Has tried it before" },
  { value: "experienced", label: "Experienced", hint: "Has been playing for years" },
];

const WHEN_OPTIONS: { value: SchedulePreference; label: string; hint: string }[] = [
  { value: "weekend", label: "Weekends", hint: "Saturday classes" },
  { value: "weekday", label: "Weekdays", hint: "Wednesday or Friday classes" },
  { value: "either", label: "Either works", hint: "We're flexible" },
];

const AGE_CHOICES = [3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16];

type StepKey = "age" | "interest" | "exp" | "when";

const STEPS: StepKey[] = ["age", "interest", "exp", "when"];

export default function ProgramFinder({ programs }: { programs: Program[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const ageParam = searchParams.get("age");
  const interestParam = searchParams.get("interest") as InterestAnswer | null;
  const expParam = searchParams.get("exp") as Experience | null;
  const whenParam = searchParams.get("when") as SchedulePreference | null;

  const answered: Record<StepKey, boolean> = {
    age: Boolean(ageParam) && Number.isFinite(Number(ageParam)),
    interest: INTEREST_OPTIONS.some((option) => option.value === interestParam),
    exp: EXPERIENCE_OPTIONS.some((option) => option.value === expParam),
    when: WHEN_OPTIONS.some((option) => option.value === whenParam),
  };

  const currentStep = STEPS.find((step) => !answered[step]);
  const isComplete = currentStep === undefined;

  const result = useMemo(() => {
    if (!isComplete) return null;
    return recommendPrograms(programs, {
      age: Number(ageParam),
      interest: interestParam as InterestAnswer,
      experience: expParam as Experience,
      when: whenParam as SchedulePreference,
    });
  }, [isComplete, programs, ageParam, interestParam, expParam, whenParam]);

  // Move focus to the new question so keyboard and screen reader users follow along.
  useEffect(() => {
    if (hasInteracted) headingRef.current?.focus();
  }, [currentStep, isComplete, hasInteracted]);

  const reportedRef = useRef(false);
  useEffect(() => {
    if (!isComplete || reportedRef.current) return;
    reportedRef.current = true;
    sendInquiryEvent({
      type: "finder_complete",
      source: "finder",
      ageBucket: toAgeBucket(Number(ageParam)),
      interest: (interestParam ?? undefined) as InterestAnswer | undefined,
      experience: (expParam ?? undefined) as Experience | undefined,
      schedulePref: (whenParam ?? undefined) as SchedulePreference | undefined,
    });
  }, [isComplete, ageParam, interestParam, expParam, whenParam]);

  const setParam = (key: StepKey, value: string) => {
    setHasInteracted(true);
    const next = new URLSearchParams(searchParams.toString());
    next.set(key, value);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const goBack = () => {
    setHasInteracted(true);
    const lastAnswered = [...STEPS].reverse().find((step) => answered[step]);
    if (!lastAnswered) return;
    const next = new URLSearchParams(searchParams.toString());
    next.delete(lastAnswered);
    reportedRef.current = false;
    router.replace(next.toString() ? `${pathname}?${next.toString()}` : pathname, {
      scroll: false,
    });
  };

  const stepNumber = currentStep ? STEPS.indexOf(currentStep) + 1 : STEPS.length;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-ink/65 mb-2">
          <span>
            {isComplete ? "Your matches" : `Question ${stepNumber} of ${STEPS.length}`}
          </span>
          {(answered.age || isComplete) && (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-medium"
            >
              <ArrowLeft size={14} strokeWidth={1.75} /> Back
            </button>
          )}
        </div>
        <div
          className="h-1.5 w-full rounded-full bg-mist overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={STEPS.length}
          aria-valuenow={isComplete ? STEPS.length : stepNumber - 1}
          aria-label="Finder progress"
        >
          <div
            className="h-full rounded-full bg-rose-600 transition-all duration-500"
            style={{
              width: `${((isComplete ? STEPS.length : stepNumber - 1) / STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {!isComplete && (
        <fieldset className="rounded-2xl border border-ink/[0.06] bg-white p-6 sm:p-8 shadow-card">
          <legend className="sr-only">
            {currentStep === "age"
              ? "How old is your child?"
              : currentStep === "interest"
                ? "What are they drawn to?"
                : currentStep === "exp"
                  ? "How much experience do they have?"
                  : "Which days work best?"}
          </legend>

          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-2xl sm:text-3xl font-semibold text-ink tracking-display outline-none"
          >
            {currentStep === "age" && "How old is your child?"}
            {currentStep === "interest" && "What are they drawn to?"}
            {currentStep === "exp" && "How much experience do they have?"}
            {currentStep === "when" && "Which days work best for you?"}
          </h2>
          <p className="mt-2 text-sm text-ink/70">
            {currentStep === "age" && "Every program has a minimum age, so this narrows things down fastest."}
            {currentStep === "interest" && "Pick the closest fit. You can always ask us about the others."}
            {currentStep === "exp" && "This tells us whether to start from the very beginning."}
            {currentStep === "when" && "Classes run Wednesdays, Fridays, and Saturdays."}
          </p>

          <div className="mt-6">
            {currentStep === "age" ? (
              <div className="flex flex-wrap gap-2">
                {AGE_CHOICES.map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setParam("age", String(age))}
                    className="h-12 min-w-12 px-4 rounded-lg border border-ink/10 bg-white text-ink/70 font-medium hover:border-rose-400 hover:text-rose-700 transition-colors"
                  >
                    {age}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setParam("age", "18")}
                  className="h-12 px-4 rounded-lg border border-ink/10 bg-white text-ink/70 font-medium hover:border-rose-400 hover:text-rose-700 transition-colors"
                >
                  18+
                </button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {(currentStep === "interest"
                  ? INTEREST_OPTIONS
                  : currentStep === "exp"
                    ? EXPERIENCE_OPTIONS
                    : WHEN_OPTIONS
                ).map((option) => (
                  <label
                    key={option.value}
                    className="group flex cursor-pointer flex-col rounded-xl border border-ink/10 bg-white p-4 transition-colors hover:border-rose-400 has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-rose-500"
                  >
                    <input
                      type="radio"
                      name={currentStep}
                      value={option.value}
                      className="sr-only"
                      onChange={() => setParam(currentStep as StepKey, option.value)}
                    />
                    <span className="font-medium text-ink text-sm group-hover:text-rose-700">
                      {option.label}
                    </span>
                    <span className="mt-0.5 text-xs text-ink/65">{option.hint}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </fieldset>
      )}

      {isComplete && result && (
        <div aria-live="polite">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-2xl sm:text-3xl font-semibold text-ink tracking-display outline-none"
          >
            {result.status === "too-young"
              ? `Almost ready for us`
              : result.recommendations.length === 1
                ? "We found a strong match"
                : `We found ${result.recommendations.length} good matches`}
          </h2>

          <p className="mt-2 text-sm text-ink/70 leading-relaxed">
            {result.status === "too-young"
              ? `Our earliest programs start at age ${result.eligibleAtAge}. Message us and we'll keep you posted, or ask about joining when they're ready.`
              : "Based on their age, interest, and your preferred days. Tap a program to see class times, or send us the details in one tap."}
          </p>

          <ul className="mt-8 space-y-4">
            {result.recommendations.map(({ program, reasons }, index) => {
              const slots = (program.slots ?? []).filter((slot) => slot.isActive);
              const seats = slots.reduce((total, slot) => total + openSeats(slot), 0);
              const nextSlot = slots.find((slot) => openSeats(slot) > 0) ?? slots[0];

              return (
                <li
                  key={program.id}
                  className="rounded-2xl border border-ink/[0.08] bg-white overflow-hidden shadow-card"
                >
                  <div className="flex gap-4 p-5 sm:p-6">
                    <Link
                      href={`/programs/${program.slug}`}
                      className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl"
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      <ProgramImage program={program} sizes="80px" />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-lg font-semibold text-ink tracking-display">
                          <Link href={`/programs/${program.slug}`} className="hover:text-rose-700">
                            {program.name}
                          </Link>
                        </h3>
                        {index === 0 && result.status === "matched" && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-gold/10 px-2 py-1 text-[0.6rem] font-medium uppercase tracking-wider text-gold-dark">
                            <Sparkles size={11} /> Best match
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-ink/70 leading-relaxed">
                        {program.description}
                      </p>

                      {reasons.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {reasons.slice(0, 3).map((reason) => (
                            <li
                              key={reason}
                              className="rounded-md bg-rose-50 px-2 py-1 text-[0.7rem] text-rose-700"
                            >
                              {reason}
                            </li>
                          ))}
                        </ul>
                      )}

                      {nextSlot && result.status === "matched" && (
                        <p className="mt-3 text-xs text-ink/65">
                          {formatSlot(nextSlot)}
                          {seats > 0 ? " · Available" : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-ink/[0.06] bg-mist/30 px-5 py-4 sm:px-6">
                    <MessengerCta
                      source="finder_result"
                      programId={program.id}
                      program={program.name}
                      age={Number(ageParam)}
                      experience={expParam as Experience}
                      when={whenParam as SchedulePreference}
                      interest={interestParam as InterestAnswer}
                      waitlist={result.status === "too-young"}
                      variant={index === 0 ? "primary" : "outline"}
                      label={
                        result.status === "too-young"
                          ? "Ask about joining later"
                          : `Ask about ${program.name}`
                      }
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/programs/find"
              onClick={() => {
                reportedRef.current = false;
              }}
              className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700"
            >
              <RotateCcw size={15} strokeWidth={1.75} /> Start over
            </Link>
            <Link
              href="/programs"
              className="text-sm font-medium text-ink/70 hover:text-ink"
            >
              Browse all programs instead
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
