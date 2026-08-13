import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ProgramBrowser from "@/components/ProgramBrowser";
import ServiceCard from "@/components/ServiceCard";
import RippleButton from "@/components/RippleButton";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import { services } from "@/data/services";
import { getPrograms } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Piano, voice, violin, guitar, ukulele, ballet, dance, pasarela, public speaking, and academic tutorials in Minglanilla, Cebu.",
  alternates: { canonical: "/programs" },
};

export const revalidate = 300;

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Every Program, One Home for the Arts"
        description="Piano to public speaking — explore classes built for beginners, performers, and everyone in between."
      />

      <section className="py-20 sm:py-24 bg-cream">
        <div className="container-page">
          <ProgramBrowser programs={programs} />
        </div>

      </section>
      <Reveal className="flex justify-center">
        <RippleButton href="/programs/find" variant="primary">
          Not sure what to choose? Answer these 4 questions
        </RippleButton>
      </Reveal>

      <section className="py-20 sm:py-28 bg-mist/50">
        <div className="container-page">
          <SectionHeading
            eyebrow="Beyond the Classroom"
            title="Services That Support Every Student"
            description="From private coaching to exam prep, we build a plan around your child's goals — not the other way around."
          />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} delay={(index % 4) * 0.08} />
            ))}
          </div>
        </div>
      </section>

      <CTA source="programs_cta" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Programs", path: "/programs" },
        ])}
      />
    </>
  );
}
