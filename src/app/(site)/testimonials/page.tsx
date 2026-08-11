import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import TestimonialCard from "@/components/TestimonialCard";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import { getTestimonials } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "What parents and students say about learning music, dance, and public speaking at St. Claire School of Music and Performing Arts.",
  alternates: { canonical: "/testimonials" },
};

export const revalidate = 300;

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Stories From Our Families"
        description="The reason we do this — in the words of the parents and students who live it."
      />

      <section className="py-16 sm:py-20 bg-cream">
        <div className="container-page grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              delay={(index % 3) * 0.08}
            />
          ))}
        </div>
      </section>

      <CTA source="testimonials_cta" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Testimonials", path: "/testimonials" },
        ])}
      />
    </>
  );
}
