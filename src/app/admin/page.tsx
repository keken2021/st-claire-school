import Link from "next/link";
import { ArrowRight, BarChart3, CalendarClock, ImageIcon, Quote } from "lucide-react";
import { getAdminGallery, getAdminPrograms, getAdminTestimonials } from "@/lib/content";
import { getFunnelSummary } from "@/lib/analytics";
import { openSeats } from "@/lib/schedule";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [programs, testimonials, gallery, funnel] = await Promise.all([
    getAdminPrograms(),
    getAdminTestimonials(),
    getAdminGallery(),
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
      label: "Programs & Schedule",
      value: `${activePrograms.length} live · ${activeSlots.length} class times`,
    },
    {
      href: "/admin/testimonials",
      icon: Quote,
      label: "Testimonials",
      value: `${testimonials.filter((item) => item.isVisible).length} published`,
    },
    {
      href: "/admin/gallery",
      icon: ImageIcon,
      label: "Gallery",
      value: `${gallery.filter((item) => item.isVisible).length} published`,
    },
    {
      href: "/admin/insights",
      icon: BarChart3,
      label: "Inquiry Insights",
      value: funnel.available
        ? `${funnel.messengerClicks} inquiries in 30 days`
        : "Awaiting a database",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-display text-ink">Overview</h1>
      <p className="mt-1.5 text-sm text-ink/70">
        Everything parents see on the website is edited from here.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-ink/[0.08] bg-white p-5 transition-colors hover:border-rose-200"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50">
              <card.icon size={19} className="text-rose-600" strokeWidth={1.75} />
            </span>
            <p className="mt-4 font-display text-base font-semibold tracking-display text-ink">
              {card.label}
            </p>
            <p className="mt-1 text-sm text-ink/70">{card.value}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-rose-600">
              Open <ArrowRight size={14} strokeWidth={1.75} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-ink/[0.08] bg-white p-5">
        <h2 className="font-display text-base font-semibold tracking-display text-ink">
          Needs attention
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-ink/70">
          <li>
            {openSeatTotal > 0
              ? `${openSeatTotal} seats are currently advertised as open across all programs.`
              : "No open seats are advertised. Every class time is showing as full."}
          </li>
          {fullSlots.length > 0 && (
            <li>
              {fullSlots.length} class {fullSlots.length === 1 ? "time is" : "times are"} full, so
              those buttons now ask parents about the waitlist.
            </li>
          )}
          {programs.some((program) => !program.isActive) && (
            <li>
              {programs.filter((program) => !program.isActive).length} program(s) are hidden from
              the website.
            </li>
          )}
          {programs.some((program) => (program.tuition ?? []).length === 0) && (
            <li>
              Some programs have no published tuition, so their pages omit the rate section.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
