/**
 * Analytics helpers that exist to keep personal data out of the database.
 *
 * The school's actual conversations happen in Messenger, where they already
 * hold the family's details. This product therefore stores no names, no contact
 * details, and a child's age only as a coarse bucket.
 */

export const AGE_BUCKETS = ["3-4", "5-6", "7-9", "10-12", "13-17", "18+"] as const;

export type AgeBucket = (typeof AGE_BUCKETS)[number];

export function toAgeBucket(age: number): AgeBucket | undefined {
  if (!Number.isFinite(age) || age <= 0) return undefined;
  if (age <= 4) return "3-4";
  if (age <= 6) return "5-6";
  if (age <= 9) return "7-9";
  if (age <= 12) return "10-12";
  if (age <= 17) return "13-17";
  return "18+";
}
