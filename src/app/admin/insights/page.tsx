import { getFunnelSummary } from "@/lib/analytics";
import InsightsCharts from "@/components/admin/InsightsCharts";
import { HelpBox, PageHeader } from "@/components/admin/ui";

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
    <div className="rounded-2xl border-2 border-ink/[0.06] bg-white p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-ink/60">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-display text-ink">
        {value}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink/65">{hint}</p>
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
      <PageHeader
        title="Website Activity"
        description={`Numbers from the last ${summary.windowDays} days. This shows how parents use the website — no names or phone numbers are stored.`}
      />

      <HelpBox title="What do these numbers mean?">
        When a parent clicks &ldquo;Message us on Facebook&rdquo; or finishes the program finder,
        the site records it here so you can see which programs get the most interest.
      </HelpBox>

      {!summary.available ? (
        <p className="mt-8 rounded-2xl border-2 border-amber-200 bg-amber-50 px-5 py-4 text-base text-amber-900">
          Activity tracking is not connected yet. The website still works — numbers will appear here
          once the database is set up.
        </p>
      ) : !hasEvents ? (
        <p className="mt-8 rounded-2xl border-2 border-ink/[0.06] bg-white px-5 py-4 text-base text-ink/75">
          No activity recorded yet. As parents use the website and open Messenger, charts will show
          up here.
        </p>
      ) : (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Messenger opens"
              value={String(summary.messengerClicks)}
              hint="Parents who clicked to message the school."
            />
            <Stat
              label="Program finder finished"
              value={String(summary.finderCompletions)}
              hint="Parents who answered all four questions."
            />
            <Stat
              label="Finder → Messenger"
              value={percent(summary.finderToMessengerRate)}
              hint="Finder users who then opened Messenger."
            />
            <Stat
              label="Arrived with details"
              value={percent(summary.qualifiedShare)}
              hint="Messages that already included age and schedule preferences."
            />
          </div>

          <div className="mt-8">
            <InsightsCharts summary={summary} />
          </div>

          {summary.ageBuckets.length > 0 && (
            <div className="mt-8 rounded-2xl border-2 border-ink/[0.06] bg-white p-6">
              <h2 className="font-display text-xl font-semibold tracking-display text-ink">
                Ages parents asked about
              </h2>
              <ul className="mt-4 flex flex-wrap gap-3">
                {summary.ageBuckets.map((bucket) => (
                  <li
                    key={bucket.label}
                    className="rounded-xl bg-mist px-4 py-2 text-base text-ink/70"
                  >
                    {bucket.label}: <span className="font-bold text-ink">{bucket.count}</span>
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
