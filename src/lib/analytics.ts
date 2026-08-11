import { prisma } from "./db";
import { DAY_SHORT } from "./schedule";

/**
 * Funnel aggregation for /admin/insights.
 *
 * Aggregation happens in Postgres via groupBy rather than by pulling rows into
 * the app, so the dashboard stays cheap as the event table grows.
 */

export interface FunnelSummary {
  /** Whether real data is available; false means no database is configured. */
  available: boolean;
  windowDays: number;
  finderCompletions: number;
  messengerClicks: number;
  callClicks: number;
  /** Share of finder completions that went on to open Messenger. */
  finderToMessengerRate: number | null;
  /** Share of Messenger clicks that arrived carrying finder answers. */
  qualifiedShare: number | null;
  byProgram: { label: string; clicks: number }[];
  bySource: { label: string; clicks: number }[];
  byDay: { label: string; clicks: number; finderCompletions: number }[];
  schedulePreference: { label: string; count: number }[];
  ageBuckets: { label: string; count: number }[];
}

const EMPTY: FunnelSummary = {
  available: false,
  windowDays: 30,
  finderCompletions: 0,
  messengerClicks: 0,
  callClicks: 0,
  finderToMessengerRate: null,
  qualifiedShare: null,
  byProgram: [],
  bySource: [],
  byDay: [],
  schedulePreference: [],
  ageBuckets: [],
};

export async function getFunnelSummary(windowDays = 30): Promise<FunnelSummary> {
  if (!prisma) return { ...EMPTY, windowDays };

  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
  const where = { createdAt: { gte: since } };

  const [byType, byProgram, bySource, bySchedule, byAge, qualified, programs, rows] =
    await Promise.all([
      prisma.inquiryEvent.groupBy({ by: ["type"], where, _count: { _all: true } }),
      prisma.inquiryEvent.groupBy({
        by: ["programId"],
        where: { ...where, type: "messenger_click" },
        _count: { _all: true },
      }),
      prisma.inquiryEvent.groupBy({
        by: ["source"],
        where: { ...where, type: "messenger_click" },
        _count: { _all: true },
      }),
      prisma.inquiryEvent.groupBy({
        by: ["schedulePref"],
        where: { ...where, schedulePref: { not: null } },
        _count: { _all: true },
      }),
      prisma.inquiryEvent.groupBy({
        by: ["ageBucket"],
        where: { ...where, ageBucket: { not: null } },
        _count: { _all: true },
      }),
      prisma.inquiryEvent.count({
        where: { ...where, type: "messenger_click", schedulePref: { not: null } },
      }),
      prisma.program.findMany({ select: { id: true, name: true } }),
      prisma.inquiryEvent.findMany({
        where,
        select: { type: true, createdAt: true },
      }),
    ]);

  const countFor = (type: string) =>
    byType.find((entry) => entry.type === type)?._count._all ?? 0;

  const messengerClicks = countFor("messenger_click");
  const finderCompletions = countFor("finder_complete");
  const programNames = new Map(programs.map((program) => [program.id, program.name]));

  // Clicks per weekday, which is what tells the owner when to staff up.
  const weekdayTotals = DAY_SHORT.map((label) => ({
    label,
    clicks: 0,
    finderCompletions: 0,
  }));

  for (const row of rows) {
    const bucket = weekdayTotals[row.createdAt.getDay()];
    if (row.type === "messenger_click") bucket.clicks += 1;
    if (row.type === "finder_complete") bucket.finderCompletions += 1;
  }

  return {
    available: true,
    windowDays,
    finderCompletions,
    messengerClicks,
    callClicks: countFor("call_click"),
    finderToMessengerRate:
      finderCompletions > 0 ? qualified / finderCompletions : null,
    qualifiedShare: messengerClicks > 0 ? qualified / messengerClicks : null,
    byProgram: byProgram
      .map((entry) => ({
        label: entry.programId
          ? (programNames.get(entry.programId) ?? "Removed program")
          : "No program named",
        clicks: entry._count._all,
      }))
      .sort((a, b) => b.clicks - a.clicks),
    bySource: bySource
      .map((entry) => ({ label: humanizeSource(entry.source), clicks: entry._count._all }))
      .sort((a, b) => b.clicks - a.clicks),
    byDay: weekdayTotals,
    schedulePreference: bySchedule
      .map((entry) => ({ label: entry.schedulePref ?? "unknown", count: entry._count._all }))
      .sort((a, b) => b.count - a.count),
    ageBuckets: byAge
      .map((entry) => ({ label: entry.ageBucket ?? "unknown", count: entry._count._all }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  };
}

const SOURCE_LABELS: Record<string, string> = {
  hero: "Home hero",
  footer: "Footer",
  program_page: "Program page header",
  program_rail: "Program page sidebar",
  finder_result: "Finder result",
  visit_primary: "Visit page",
  visit_phone: "Visit page phone",
  home_cta: "Home closing CTA",
  programs_cta: "Programs closing CTA",
  about_cta: "About closing CTA",
  faq_cta: "FAQ closing CTA",
  gallery_cta: "Gallery closing CTA",
  testimonials_cta: "Testimonials closing CTA",
  cta: "Closing CTA",
};

function humanizeSource(source: string): string {
  return SOURCE_LABELS[source] ?? source.replace(/_/g, " ");
}
