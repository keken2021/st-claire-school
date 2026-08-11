import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import FaqBrowser from "@/components/FaqBrowser";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import { faqs } from "@/data/faq";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Enrollment, schedules, lesson length, age requirements, payments, and recitals at St. Claire School of Music and Performing Arts.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions Parents Ask Us Most"
        description="If your question isn't here, message us — we answer within one business day."
      />

      <section className="py-16 sm:py-20 bg-cream">
        <div className="container-page">
          <FaqBrowser items={faqs} />
        </div>
      </section>

      <CTA
        source="faq_cta"
        title="Still Have a Question?"
        description="Send it to us on Messenger. Real answers from real staff, usually the same day."
      />

      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
    </>
  );
}
