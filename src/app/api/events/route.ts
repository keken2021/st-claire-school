import { NextResponse } from "next/server";
import { inquiryEventSchema } from "@/lib/events";
import { prisma } from "@/lib/db";

/**
 * Anonymous funnel event ingestion.
 *
 * Validated with the same Zod schema the client uses, so an unexpected field or
 * a hand-crafted request cannot widen what gets stored. Nothing personally
 * identifying is accepted: age arrives only as a bucket, and there is no field
 * for a name or contact detail.
 */

export const runtime = "nodejs";

/**
 * Per-instance throttle. This is not a distributed rate limiter and does not
 * pretend to be one; it exists to blunt an accidental client-side loop. A real
 * abuse control would live at the edge.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const hits = new Map<string, { count: number; resetAt: number }>();

function isThrottled(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const key =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isThrottled(key)) {
    return NextResponse.json({ error: "Too many events" }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = inquiryEventSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid event", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Without a database the site still works; events are simply not retained.
  if (!prisma) {
    return NextResponse.json({ ok: true, stored: false }, { status: 202 });
  }

  const { programId, ...rest } = parsed.data;

  try {
    // Programs may come from seed content that has no matching row yet, so the
    // relation is only set when it genuinely exists.
    const linkedProgramId = programId
      ? (await prisma.program.findUnique({ where: { id: programId }, select: { id: true } }))?.id
      : undefined;

    await prisma.inquiryEvent.create({
      data: { ...rest, programId: linkedProgramId ?? null },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[events] Failed to record inquiry event", error);
    return NextResponse.json({ ok: true, stored: false }, { status: 202 });
  }
}
