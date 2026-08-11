import type { Metadata } from "next";
import Image from "next/image";
import { Compass, Eye, Target } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import StudentJourney from "@/components/StudentJourney";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import { getIcon } from "@/utils/icons";
import { history } from "@/data/journey";
import { breadcrumbSchema } from "@/lib/structured-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "St. Claire School of Music and Performing Arts has nurtured talent in Minglanilla, Cebu for over a decade. Read our story, mission, and values.",
  alternates: { canonical: "/about" },
};

const coreValues = [
  {
    id: "excellence",
    icon: "Award",
    title: "Excellence",
    description:
      "We hold a high standard, and we teach students how to reach it without losing their love of the art.",
  },
  {
    id: "encouragement",
    icon: "Heart",
    title: "Encouragement",
    description:
      "Progress is celebrated in small increments, because that is how confidence is actually built.",
  },
  {
    id: "discipline",
    icon: "Repeat",
    title: "Discipline",
    description:
      "Consistent, well-structured practice is the habit that outlasts every lesson we teach.",
  },
  {
    id: "creativity",
    icon: "Palette",
    title: "Creativity",
    description:
      "Technique is the foundation; expression is the point. We make room for both.",
  },
  {
    id: "community",
    icon: "HandHeart",
    title: "Community",
    description:
      "Students, parents, and teachers cheer for one another. Recitals feel like family gatherings.",
  },
  {
    id: "integrity",
    icon: "ShieldCheck",
    title: "Integrity",
    description:
      "Honest feedback, clear expectations, and a safe environment where children can try and fail freely.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About St. Claire"
        title="A Decade of Discovering Talent"
        description="What started as a small piano studio in Minglanilla is now a full performing arts community — with the same mission it opened with."
      />

      {/* Story */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="container-page grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal direction="left">
            <Image
              src="/images/programs/vocals.jpg"
              alt="A voice lesson in progress at St. Claire"
              width={1365}
              height={2048}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="rounded-2xl object-cover w-full aspect-[4/5] shadow-elev"
            />
          </Reveal>
          <Reveal direction="right">
            <span className="eyebrow mb-4 inline-block">Our Story</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink leading-tight tracking-display">
              Built Around One Belief
            </h2>
            <p className="mt-5 text-ink/70 leading-relaxed">
              St. Claire School of Music and Performing Arts opened in {site.address.locality} with a
              handful of students, a piano, and the conviction that every child already carries a
              talent worth discovering. That conviction has not changed, even as the school has
              grown into music, dance, and speech programs serving hundreds of families.
            </p>
            <p className="mt-4 text-ink/70 leading-relaxed">
              We keep classes small on purpose. A teacher who knows how a particular student learns
              can adjust in the moment, and that is where real progress happens. Recitals are
              frequent and deliberately low-pressure, because performing is its own skill and it
              improves with practice like any other.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission and vision */}
      <section className="py-20 sm:py-28 bg-mist/50">
        <div className="container-page grid md:grid-cols-2 gap-6 lg:gap-8">
          <Reveal>
            <div className="h-full rounded-2xl bg-white p-8 sm:p-10 shadow-card border border-ink/[0.05]">
              <Target size={26} className="text-rose-600 mb-5" strokeWidth={1.75} />
              <h2 className="font-display text-2xl font-semibold text-ink mb-3 tracking-display">
                Our Mission
              </h2>
              <p className="text-ink/70 leading-relaxed">
                To give every student the opportunity to shine and excel by discovering the talent
                and skills already within them, taught with patience, structure, and genuine care.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl bg-white p-8 sm:p-10 shadow-card border border-ink/[0.05]">
              <Eye size={26} className="text-rose-600 mb-5" strokeWidth={1.75} />
              <h2 className="font-display text-2xl font-semibold text-ink mb-3 tracking-display">
                Our Vision
              </h2>
              <p className="text-ink/70 leading-relaxed">
                To be the school families in Cebu trust with their children&apos;s artistic
                growth — known not only for skilled performers, but for confident, disciplined,
                and kind young people.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Core values */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="container-page">
          <SectionHeading
            eyebrow="What We Stand For"
            title="Six Values That Shape Every Lesson"
            description="These are not wall decorations. They decide how we teach, how we give feedback, and how we treat families."
          />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => {
              const Icon = getIcon(value.icon);
              return (
                <Reveal key={value.id} delay={(index % 3) * 0.08} className="h-full">
                  <div className="h-full rounded-2xl border border-ink/[0.06] bg-white p-7 shadow-card">
                    <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center mb-4">
                      <Icon size={20} className="text-rose-600" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-ink mb-2 tracking-display">
                      {value.title}
                    </h3>
                    <p className="text-sm text-ink/70 leading-relaxed">{value.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Teaching philosophy */}
      <section className="relative py-20 sm:py-28 bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-spotlight" />
        <div className="staff-lines opacity-[0.05] absolute inset-x-0 bottom-0" />
        <div className="container-page relative text-center max-w-2xl mx-auto">
          <Reveal>
            <Compass size={30} className="mx-auto text-gold-light mb-6" strokeWidth={1.5} />
            <span className="eyebrow !text-gold-light mb-5 inline-block">Our Approach</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-display leading-tight">
              Teach the Student, Not the Curriculum
            </h2>
            <p className="mt-5 text-white/65 leading-relaxed text-base sm:text-lg">
              Two students the same age rarely need the same lesson. Our teachers plan around the
              individual — their pace, their motivation, and the music they actually want to play.
              Fundamentals are never skipped, but the route through them is theirs.
            </p>
          </Reveal>
        </div>
      </section>

      <StudentJourney />

      {/* History timeline */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Journey"
            title="How St. Claire Grew"
            description="A decade of steady growth, one student and one recital at a time."
          />
          <ol className="mt-16 relative max-w-3xl mx-auto">
            <div
              aria-hidden="true"
              className="absolute left-[1.4rem] top-2 bottom-2 w-px bg-rose-200"
            />
            {history.map((milestone, index) => (
              <Reveal key={milestone.year} as="li" delay={index * 0.08} className="relative pl-16 pb-10 last:pb-0">
                <div className="absolute left-0 top-0 h-11 w-11 rounded-xl bg-rose-600 text-white flex items-center justify-center text-[0.7rem] font-semibold tracking-display shadow-soft">
                  {milestone.year}
                </div>
                <h3 className="font-display text-xl font-semibold text-ink tracking-display">
                  {milestone.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-ink/70 leading-relaxed">
                  {milestone.description}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CTA source="about_cta" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
    </>
  );
}
