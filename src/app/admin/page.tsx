import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  ImageIcon,
  Quote,
} from "lucide-react";
import { getAdminPrograms, getAdminTestimonials, getGallery } from "@/lib/content";
import { getFunnelSummary } from "@/lib/analytics";
import { openSeats } from "@/lib/schedule";
import { HelpBox, PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [programs, testimonials, gallery, funnel] = await Promise.all([
    getAdminPrograms(),
    getAdminTestimonials(),
    getGallery(),
    getFunnelSummary(30),
  ]);

  const activePrograms = programs.filter((program) => program.isActive);
  const activeSlots = programs.flatMap((program) =>
    (program.slots ?? []).filter((slot) => slot.isActive)
  );
  const openSeatTotal = activeSlots.reduce((total, slot) => total + openSeats(slot), 0);
  const fullSlots = activeSlots.filter((slot) => openSeats(slot) === 0);

  const cards = [
    {
      href: "/admin/programs",
      icon: CalendarClock,
      label: "Programs & Classes",
      description: "Change class times, open seats, prices, and program descriptions.",
      value: `${activePrograms.length} programs · ${activeSlots.length} class times`,
      action: "Manage programs",
    },
    {
      href: "/admin/testimonials",
      icon: Quote,
      label: "Parent Reviews",
      description: "Edit what parents and students say on the website.",
      value: `${testimonials.filter((item) => item.isVisible).length} shown on the site`,
      action: "Edit reviews",
    },
    {
      href: "/admin/gallery",
      icon: ImageIcon,
      label: "Photo Gallery",
      description: "See how to add or update photos on the gallery page.",
      value: `${gallery.length} photos on the site`,
      action: "Gallery help",
    },
    {
      href: "/admin/insights",
      icon: BarChart3,
      label: "Website Activity",
      description: "See how many parents used the site and which programs they looked at.",
      value: funnel.available
        ? `${funnel.messengerClicks} Messenger opens (last 30 days)`
        : "Waiting for data",
      action: "View activity",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Welcome"
        description="Use this page to update what parents see on the St. Claire website. Pick a section below. When you save, changes appear on the website right away — no need to call a developer."
      />

      <HelpBox title="Quick guide">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong>Programs & Classes</strong> — update descriptions, class days and times, how
            many seats are open, and monthly fees.
          </li>
          <li>
            <strong>Parent Reviews</strong> — edit quotes from families (turn off “Show on website”
            to hide one).
          </li>
          <li>
            <strong>Website Activity</strong> — optional charts showing parent interest.
          </li>
        </ol>
      </HelpBox>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border-2 border-ink/[0.06] bg-white p-6 transition-colors hover:border-rose-200 hover:shadow-sm"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
              <card.icon size={26} className="text-rose-600" strokeWidth={1.75} />
            </span>
            <p className="mt-5 font-display text-xl font-semibold tracking-display text-ink">
              {card.label}
            </p>
            <p className="mt-2 text-base leading-relaxed text-ink/70">{card.description}</p>
            <p className="mt-3 text-sm font-medium text-ink/55">{card.value}</p>
            <span className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-rose-600">
              {card.action}
              <ArrowRight
                size={18}
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border-2 border-ink/[0.06] bg-white p-6">
        <h2 className="font-display text-xl font-semibold tracking-display text-ink">
          Things to check
        </h2>
        <ul className="mt-4 space-y-3 text-base leading-relaxed text-ink/75">
          <li>
            {openSeatTotal > 0
              ? `${openSeatTotal} open seats are showing as “Available” on the website.`
              : "No class times are showing open seats right now."}
          </li>
          {fullSlots.length > 0 && (
            <li>
              {fullSlots.length} class {fullSlots.length === 1 ? "time is" : "times are"} full — parents
              can still message you, but no “Available” badge will show.
            </li>
          )}
          {programs.some((program) => !program.isActive) && (
            <li>
              {programs.filter((program) => !program.isActive).length} program(s) are hidden from
              the website.
            </li>
          )}
          {programs.some((program) => (program.tuition ?? []).length === 0) && (
            <li>Some programs have no price listed — add tuition under Programs & Classes.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
