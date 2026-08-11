import { site } from "./site";
import type { Experience } from "./recommend";
import type { SchedulePreference } from "./schedule";

/**
 * Messenger handoff.
 *
 * Constraint worth knowing: m.me links cannot pre-fill the message body. Only a
 * `ref` payload can ride along, and it is readable by the page's automation
 * rather than shown to the parent. So we compose the message ourselves, copy it
 * to the clipboard as the link opens, and tell the parent to paste it. The ref
 * is still attached so the school can attribute the thread to a program.
 */

export interface MessengerContext {
  /** Program display name, when the enquiry is about one program. */
  program?: string;
  age?: number;
  experience?: Experience;
  when?: SchedulePreference;
  /** Where in the UI the click came from, for funnel attribution. */
  source: string;
  /** Set when the matching class is full, which changes the ask. */
  waitlist?: boolean;
}

const EXPERIENCE_PHRASE: Record<Experience, string> = {
  none: "no experience yet",
  some: "a little experience",
  experienced: "several years of experience",
};

const WHEN_PHRASE: Record<SchedulePreference, string> = {
  weekday: "weekdays work best for us",
  weekend: "weekends work best for us",
  either: "we are flexible on days",
};

/** Builds the message the parent will send, in their voice, not ours. */
export function buildMessengerMessage(context: MessengerContext): string {
  const parts: string[] = ["Hi St. Claire!"];

  if (context.program) {
    parts.push(
      context.waitlist
        ? `I'd like to ask about the waitlist for ${context.program}.`
        : `I'm asking about ${context.program}.`
    );
  } else {
    parts.push("I'd like to ask about enrolling my child.");
  }

  const details: string[] = [];
  if (typeof context.age === "number" && context.age > 0) {
    details.push(`my child is ${context.age}`);
  }
  if (context.experience) {
    details.push(EXPERIENCE_PHRASE[context.experience]);
  }
  if (details.length > 0) {
    parts.push(`${capitalize(details.join(" and "))}.`);
  }

  if (context.when) {
    parts.push(`${capitalize(WHEN_PHRASE[context.when])}.`);
  }

  parts.push("Could you tell me about schedules and tuition? Thank you!");

  return parts.join(" ");
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Compact, URL-safe attribution payload. Kept short because m.me truncates long
 * ref values, and deliberately free of anything personally identifying.
 */
export function encodeRef(context: MessengerContext): string {
  const compact: Record<string, string> = { s: context.source };
  if (context.program) compact.p = slugish(context.program);
  if (context.when) compact.w = context.when;
  if (context.waitlist) compact.q = "1";

  const raw = Object.entries(compact)
    .map(([key, value]) => `${key}-${value}`)
    .join("_");

  return raw.slice(0, 180);
}

function slugish(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildMessengerUrl(context: MessengerContext): string {
  const ref = encodeRef(context);
  return `https://m.me/${site.messengerHandle}?ref=${encodeURIComponent(ref)}`;
}
