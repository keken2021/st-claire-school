"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FunnelSummary } from "@/lib/analytics";

const ROSE = "#C43B6E";
const GOLD = "#B8973A";
const SLICE_COLORS = [ROSE, GOLD, "#88264B", "#D4BC6A", "#A82F5C"];

const axisStyle = { fontSize: 12, fill: "rgba(28,25,23,0.45)" };

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid rgba(28,25,23,0.08)",
  fontSize: 13,
};

function ChartFrame({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink/[0.08] bg-white p-5">
      <h2 className="font-display text-base font-semibold tracking-display text-ink">{title}</h2>
      <p className="mt-1 mb-4 text-xs text-ink/65">{hint}</p>
      <div className="h-64">{children}</div>
    </div>
  );
}

export default function InsightsCharts({ summary }: { summary: FunnelSummary }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ChartFrame
        title="Interest by program"
        hint="Messenger inquiries attributed to each program."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={summary.byProgram} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} stroke="rgba(28,25,23,0.06)" />
            <XAxis type="number" allowDecimals={false} tick={axisStyle} />
            <YAxis type="category" dataKey="label" width={130} tick={axisStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="clicks" name="inquiries" fill={ROSE} radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>

      <ChartFrame
        title="inquiries by day of week"
        hint="When parents reach out — useful for deciding who is on the inbox."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={summary.byDay} margin={{ left: -16, right: 8 }}>
            <CartesianGrid vertical={false} stroke="rgba(28,25,23,0.06)" />
            <XAxis dataKey="label" tick={axisStyle} />
            <YAxis allowDecimals={false} tick={axisStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="clicks" name="Messenger" fill={ROSE} radius={[6, 6, 0, 0]} />
            <Bar dataKey="finderCompletions" name="Finder finished" fill={GOLD} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>

      <ChartFrame
        title="Where inquiries start"
        hint="Which part of the site sends the most parents to Messenger."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={summary.bySource} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} stroke="rgba(28,25,23,0.06)" />
            <XAxis type="number" allowDecimals={false} tick={axisStyle} />
            <YAxis type="category" dataKey="label" width={150} tick={axisStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="clicks" name="inquiries" fill={GOLD} radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>

      <ChartFrame
        title="Requested days"
        hint="Demand for weekday versus weekend classes, straight from the finder."
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={summary.schedulePreference}
              dataKey="count"
              nameKey="label"
              innerRadius={54}
              outerRadius={88}
              paddingAngle={2}
            >
              {summary.schedulePreference.map((entry, index) => (
                <Cell key={entry.label} fill={SLICE_COLORS[index % SLICE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartFrame>
    </div>
  );
}
