import { getFunnelSummary } from "@/lib/analytics";
import InsightsCharts from "@/components/admin/InsightsCharts";

export const dynamic = "force-dynamic";

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-ink/[0.08] bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-ink/65">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-display text-ink">{value}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-ink/65">{hint}</p>
    </div>
  );
}

function percent(value: number | null): string {
  return value === null ? "—" : `${Math.round(value * 100)}%`;
}

export default async function InsightsPage() {
  const summary = await getFunnelSummary(30);

  const hasEvents = summary.messengerClicks + summary.finderCompletions > 0;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-display text-ink">
        Inquiry Insights
      </h1>
      <p className="mt-1.5 text-sm text-ink/70">
        Last {summary.windowDays} days. Anonymous and aggregate only — no names, no contact
        details, and children&apos;s ages stored as ranges rather than exact values.
      </p>

      {!summary.available ? (
        <p className="mt-6 rounded-xl border border-gold/40 bg-gold/10 px-5 py-4 text-sm text-gold-dark">
          Connect a database to start collecting enquiry events. Until then the site works
          normally, it simply does not retain them.
        </p>
      ) : !hasEvents ? (
        <p className="mt-6 rounded-xl border border-ink/[0.08] bg-white px-5 py-4 text-sm text-ink/70">
          No inquiries recorded in this window yet. Numbers will appear here as parents use the
          Messenger buttons and the program finder.
        </p>
      ) : (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Messenger inquiries"
              value={String(summary.messengerClicks)}
              hint="Parents who opened a conversation from the site."
            />
            <Stat
              label="Finder completions"
              value={String(summary.finderCompletions)}
              hint="Parents who answered all four questions."
            />
            <Stat
              label="Finder to Messenger"
              value={percent(summary.finderToMessengerRate)}
              hint="Finder completions that went on to message us."
            />
            <Stat
              label="Arrived pre-qualified"
              value={percent(summary.qualifiedShare)}
              hint="inquiries that already carried age, experience, and preferred days."
            />
          </div>

          <div className="mt-6">
            <InsightsCharts summary={summary} />
          </div>

          {summary.ageBuckets.length > 0 && (
            <div className="mt-6 rounded-2xl border border-ink/[0.08] bg-white p-5">
              <h2 className="font-display text-base font-semibold tracking-display text-ink">
                Ages enquired about
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {summary.ageBuckets.map((bucket) => (
                  <li
                    key={bucket.label}
                    className="rounded-lg bg-mist px-3 py-1.5 text-sm text-ink/65"
                  >
                    {bucket.label}: <span className="font-semibold text-ink">{bucket.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
