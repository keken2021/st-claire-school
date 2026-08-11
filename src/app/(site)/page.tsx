import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import WhyChooseUs from "@/components/WhyChooseUs";
import StudentJourney from "@/components/StudentJourney";
import CTA from "@/components/CTA";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ProgramCard from "@/components/ProgramCard";
import TestimonialCard from "@/components/TestimonialCard";
import RippleButton from "@/components/RippleButton";
import WaveDivider from "@/components/WaveDivider";
import { getPrograms, getTestimonials } from "@/lib/content";

export const revalidate = 300;

export default async function HomePage() {
  const [programs, testimonials] = await Promise.all([getPrograms(), getTestimonials()]);

  return (
    <>
      <Hero />
      <Stats />

      {/* About teaser */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="container-page grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal direction="left">
            <div className="relative">
              <Image
                src="/images/programs/piano.jpg"
                alt="A student at the piano during a lesson at St. Claire"
                width={468}
                height={1040}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="rounded-2xl object-cover w-full aspect-[4/5] shadow-elev"
              />
              <div className="absolute -bottom-5 left-6 right-6 sm:left-auto sm:right-[-1.25rem] sm:max-w-[240px] bg-white rounded-xl shadow-elev border border-ink/[0.05] p-5">
                <p className="font-display text-ink text-sm leading-snug tracking-display">
                  A home where every talent finds its stage.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right">
            <span className="eyebrow mb-4 inline-block">Our Story</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink leading-tight tracking-display">
              More Than Lessons — A Place to Discover Who They Can Become
            </h2>
            <p className="mt-5 text-ink/70 leading-relaxed text-base sm:text-lg">
              For over a decade, St. Claire School of Music and Performing Arts has welcomed
              children, teens, and adults into a warm, encouraging space in the heart of
              Minglanilla, Cebu. What began as a small humble studio has grown into a full arts
              community — but our mission has never changed: to help every student discover the
              talent already inside them, and the confidence to share it with the world.
            </p>
            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 text-rose-600 font-medium text-sm sm:text-base hover:gap-3 transition-all"
            >
              Read Our Full Story <ArrowRight size={16} strokeWidth={1.75} />
            </Link>
          </Reveal>
        </div>
      </section>

      <WhyChooseUs />

      {/* Programs teaser */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="container-page">
          <SectionHeading
            eyebrow="Programs"
            title="Find the Right Stage for Their Talent"
            description="From first piano keys to center-stage choreography, explore programs designed for every age and interest."
          />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.slice(0, 4).map((program, index) => (
              <ProgramCard key={program.id} program={program} delay={index * 0.08} />
            ))}
          </div>
          <Reveal className="mt-12 flex flex-wrap justify-center gap-4">
            <RippleButton href="/programs/find" variant="primary">
              Help Me Choose
            </RippleButton>
            <RippleButton href="/programs" variant="secondary">
              View All Programs <ArrowRight size={16} strokeWidth={1.75} />
            </RippleButton>
          </Reveal>
        </div>
      </section>

      <StudentJourney />

      {/* Testimonials teaser */}
      <section className="py-20 sm:py-28 bg-mist/50 relative overflow-hidden">
        <div className="staff-lines-rose opacity-30 absolute inset-x-0 top-0" />
        <div className="container-page relative">
          <SectionHeading
            eyebrow="Testimonials"
            title="Stories From Our St. Claire Families"
            description="Hear what parents and students have to say about their journey with us."
          />
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                delay={index * 0.1}
              />
            ))}
          </div>
          <Reveal className="mt-12 flex justify-center">
            <RippleButton href="/testimonials" variant="secondary">
              Read More Stories <ArrowRight size={16} strokeWidth={1.75} />
            </RippleButton>
          </Reveal>
        </div>
      </section>

      <WaveDivider color="#1C1917" className="-mb-1" />
      <CTA source="home_cta" />
    </>
  );
}
