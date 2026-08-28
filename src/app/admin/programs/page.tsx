import Link from "next/link";
import { ArrowRight, ChevronRight, EyeOff } from "lucide-react";
import { getAdminPrograms } from "@/lib/content";
import { openSeats } from "@/lib/schedule";
import { HelpBox, PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminProgramsPage() {
  const programs = await getAdminPrograms();

  return (
    <div>
      <PageHeader
        title="Programs & Classes"
        description="Tap a program to edit its description, class schedule, open seats, and monthly fees. Changes go live on the website as soon as you press Save."
      />

      <HelpBox title="Which program should I open?">
        Each row is one subject on the website (Piano, Ballet, Voice, and so on). Open the one you
        want to change — you will see three steps: program info, class times, and prices.
      </HelpBox>

      <div className="mt-8">
        <ul className="space-y-3">
          {programs.map((program) => {
            const slots = (program.slots ?? []).filter((slot) => slot.isActive);
            const seatsOpen = slots.reduce((total, slot) => total + openSeats(slot), 0);

            return (
              <li key={program.id}>
                <Link
                  href={`/admin/programs/${program.id}`}
                  className="group flex min-h-[72px] items-center justify-between gap-4 rounded-2xl border-2 border-ink/[0.06] bg-white px-5 py-4 transition-colors hover:border-rose-200 hover:bg-rose-50/30 sm:px-6"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-semibold text-ink">{program.name}</span>
                      {!program.isActive && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-mist px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-ink/65">
                          <EyeOff size={12} aria-hidden /> Hidden
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-sm text-ink/65">
                      {program.ageGroup}
                      {slots.length > 0 && (
                        <>
                          {" · "}
                          {slots.length} class {slots.length === 1 ? "time" : "times"}
                          {seatsOpen > 0 && ` · ${seatsOpen} open seats`}
                        </>
                      )}
                      {slots.length === 0 && " · No class times yet"}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-base font-semibold text-rose-600">
                    <span className="hidden sm:inline">Edit</span>
                    <ChevronRight
                      size={22}
                      strokeWidth={2}
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-6 flex items-center gap-2 text-sm text-ink/60">
        <ArrowRight size={16} aria-hidden />
        Class days on the site are Wednesday, Friday, and Saturday only.
      </p>
    </div>
  );
}
