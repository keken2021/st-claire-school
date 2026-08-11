import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BarChart3, Clock, Users2 } from "lucide-react";
import ProgramImage from "@/components/ProgramImage";
import MessengerCta from "@/components/MessengerCta";
import ProgramCard from "@/components/ProgramCard";
import SectionHeading from "@/components/SectionHeading";
import JsonLd from "@/components/JsonLd";
import FloatingNotes from "@/components/FloatingNotes";
import { getProgram, getPrograms } from "@/lib/content";
import { formatSlot, openSeats } from "@/lib/schedule";
import { breadcrumbSchema, courseSchema } from "@/lib/structured-data";

export const revalidate = 300;

export async function generateStaticParams() {
  const programs = await getPrograms();
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);

  if (!program) return { title: "Program not found" };

  const title = `${program.name} Lessons`;
  const description = `${program.description} ${program.ageGroup}, ${program.duration}, in Minglanilla, Cebu.`;

  return {
    title,
    description,
    alternates: { canonical: `/programs/${program.slug}` },
    openGraph: { title, description, url: `/programs/${program.slug}`, type: "article" },
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [program, allPrograms] = await Promise.all([getProgram(slug), getPrograms()]);

  if (!program) notFound();

  const slots = (program.slots ?? []).filter((slot) => slot.isActive);
  const tuition = program.tuition ?? [];
  const totalSeats = slots.reduce((total, slot) => total + openSeats(slot), 0);
  const isFull = slots.length > 0 && totalSeats === 0;

  const related = allPrograms
    .filter((item) => item.id !== program.id && item.category === program.category)
    .slice(0, 3);

  return (
    <>
      {/* Program header */}
      <section className="relative bg-ink pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-spotlight" />
        <FloatingNotes className="opacity-20" />
        <div className="container-page relative">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={15} strokeWidth={1.75} /> All programs
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="eyebrow !text-gold-light mb-4">{program.category}</p>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white tracking-display">
                {program.name}
              </h1>
              <p className="mt-5 text-white/70 leading-relaxed text-base sm:text-lg">
                {program.description}
              </p>

              <dl className="mt-8 grid grid-cols-3 gap-3 max-w-md">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <Users2 size={16} className="mx-auto text-gold-light mb-1.5" strokeWidth={1.75} />
                  <dt className="text-[0.6rem] uppercase tracking-wider text-white/55">Ages</dt>
                  <dd className="text-xs font-semibold text-white mt-0.5">{program.ageGroup}</dd>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <BarChart3 size={16} className="mx-auto text-gold-light mb-1.5" strokeWidth={1.75} />
                  <dt className="text-[0.6rem] uppercase tracking-wider text-white/55">Level</dt>
                  <dd className="text-xs font-semibold text-white mt-0.5">{program.skillLevel}</dd>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <Clock size={16} className="mx-auto text-gold-light mb-1.5" strokeWidth={1.75} />
                  <dt className="text-[0.6rem] uppercase tracking-wider text-white/55">Length</dt>
                  <dd className="text-xs font-semibold text-white mt-0.5">{program.duration}</dd>
                </div>
              </dl>

              <div className="mt-8">
                <MessengerCta
                  source="program_page"
                  programId={program.id}
                  program={program.name}
                  waitlist={isFull}
                  variant="gold"
                />
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-elev">
              <ProgramImage
                program={program}
                sizes="(min-width: 1024px) 45vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Detail, schedule, tuition */}
      <section className="py-16 sm:py-20 bg-cream">
        <div className="container-page grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink tracking-display">
              About this program
            </h2>
            <p className="mt-4 text-ink/70 leading-relaxed text-base sm:text-lg">
              {program.detail ?? program.description}
            </p>

            <h2 className="mt-12 font-display text-2xl font-semibold text-ink tracking-display">
              Class times
            </h2>
            {slots.length === 0 ? (
              <p className="mt-4 text-ink/70 leading-relaxed">
                Class times for this program are arranged individually. Message us and we&apos;ll
                find a slot that works around your schedule.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-ink/[0.06] rounded-2xl border border-ink/[0.06] bg-white overflow-hidden">
                {slots.map((slot) => {
                  const seats = openSeats(slot);
                  return (
                    <li
                      key={slot.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                    >
                      <span className="text-sm font-medium text-ink">{formatSlot(slot)}</span>
                      {seats > 0 ? (
                        <span className="rounded-md bg-gold/10 px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-wider text-gold-dark">
                          {seats} of {slot.capacity} open
                        </span>
                      ) : (
                        <span className="rounded-md bg-mist px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-wider text-ink/65">
                          Full — waitlist
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-3 text-xs text-ink/65">
              Seat counts are kept up to date by our staff. Message us to confirm before you
              travel.
            </p>

            {tuition.length > 0 && (
              <>
                <h2 className="mt-12 font-display text-2xl font-semibold text-ink tracking-display">
                  Tuition
                </h2>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                  {tuition.map((tier) => (
                    <li
                      key={tier.id}
                      className="rounded-2xl border border-ink/[0.06] bg-white p-5"
                    >
                      <p className="eyebrow mb-2">{tier.name}</p>
                      <p className="font-display text-2xl font-semibold text-ink tracking-display">
                        ₱{tier.amount.toLocaleString("en-PH")}
                        <span className="ml-1.5 text-sm font-normal text-ink/65">
                          {tier.cadence}
                        </span>
                      </p>
                      {tier.note && (
                        <p className="mt-2 text-xs text-ink/70 leading-relaxed">{tier.note}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Enquiry rail */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold text-ink tracking-display">
                {isFull ? `Join the ${program.name} waitlist` : `Ask about ${program.name}`}
              </h2>
              <p className="mt-2 text-sm text-ink/70 leading-relaxed">
                We&apos;ll open Messenger and copy your details across, so you only need to press
                send. We usually reply {""}
                <span className="text-ink/70">within one business day</span>.
              </p>
              <div className="mt-5">
                <MessengerCta
                  source="program_rail"
                  programId={program.id}
                  program={program.name}
                  waitlist={isFull}
                  variant="primary"
                  showPreview
                />
              </div>
              <Link
                href="/programs/find"
                className="mt-4 block text-center text-sm font-medium text-rose-600 hover:text-rose-700"
              >
                Not sure this is the one?
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 sm:py-20 bg-mist/40">
          <div className="container-page">
            <SectionHeading
              eyebrow="Also in this category"
              title={`More ${program.category}`}
              align="left"
            />
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item, index) => (
                <ProgramCard key={item.id} program={item} delay={index * 0.08} />
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd data={courseSchema(program)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Programs", path: "/programs" },
          { name: program.name, path: `/programs/${program.slug}` },
        ])}
      />
    </>
  );
}
