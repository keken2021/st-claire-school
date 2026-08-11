import Link from "next/link";
import { ArrowRight, EyeOff } from "lucide-react";
import { getAdminPrograms } from "@/lib/content";
import { openSeats } from "@/lib/schedule";

export const dynamic = "force-dynamic";

export default async function AdminProgramsPage() {
  const programs = await getAdminPrograms();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-display text-ink">
        Programs &amp; Schedule
      </h1>
      <p className="mt-1.5 text-sm text-ink/70">
        Edit descriptions, class times, seat counts, and tuition. Saved changes reach the public
        pages without a redeploy.
      </p>

      <div className="mt-6">
        <div className="overflow-hidden rounded-2xl border border-ink/[0.08] bg-white">
          <ul className="divide-y divide-ink/[0.06]">
            {programs.map((program) => {
              const slots = (program.slots ?? []).filter((slot) => slot.isActive);
              const seats = slots.reduce((total, slot) => total + openSeats(slot), 0);

              return (
                <li key={program.id}>
                  <Link
                    href={`/admin/programs/${program.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-mist/50"
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 font-medium text-ink">
                        {program.name}
                        {!program.isActive && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-mist px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-ink/65">
                            <EyeOff size={10} /> Hidden
                          </span>
                        )}
                      </span>
                      {/* <span className="mt-0.5 block text-xs text-ink/65">
                        {program.category} · {program.ageGroup} · {slots.length}{" "}
                        {slots.length === 1 ? "class time" : "class times"} ·{" "}
                        {seats > 0 ? `${seats} seats open` : "no seats open"}
                      </span> */}
                    </span>
                    <ArrowRight size={16} className="shrink-0 text-ink/30" strokeWidth={1.75} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
