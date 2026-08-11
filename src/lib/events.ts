import { z } from "zod";
import { AGE_BUCKETS } from "./privacy";

/**
 * Shared contract for funnel events, used by the client sender and the API
 * route. Anything that could identify a family is intentionally absent.
 */
export const inquiryEventSchema = z.object({
  type: z.enum(["messenger_click", "finder_complete", "call_click"]),
  source: z.string().min(1).max(48),
  programId: z.string().max(64).optional(),
  path: z.string().max(160).optional(),
  ageBucket: z.enum(AGE_BUCKETS).optional(),
  interest: z.enum(["music", "movement", "speech", "unsure"]).optional(),
  experience: z.enum(["none", "some", "experienced"]).optional(),
  schedulePref: z.enum(["weekday", "weekend", "either"]).optional(),
});

export type InquiryEventInput = z.infer<typeof inquiryEventSchema>;

/**
 * Fire-and-forget event send. Uses keepalive so the request survives the
 * navigation to Messenger that follows immediately after.
 */
export function sendInquiryEvent(input: InquiryEventInput): void {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({ ...input, path: input.path ?? window.location.pathname });

  try {
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Analytics must never interrupt the parent's journey.
    });
  } catch {
    // Ignore: an ad blocker or offline device is not an error worth surfacing.
  }
}
