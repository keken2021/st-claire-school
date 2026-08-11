import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import MessengerCta from "@/components/MessengerCta";
import CallLink from "@/components/CallLink";
import FacebookIcon from "@/components/FacebookIcon";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Visit Us",
  description: `Message, call, or visit St. Claire School of Music and Performing Arts in ${site.address.full}. Open Wednesdays, Fridays, and Saturdays.`,
  alternates: { canonical: "/visit" },
};

export default function VisitPage() {
  return (
    <>
      <PageHero
        eyebrow="Visit Us"
        title="Come See the School"
        description="Message us with a question, call during opening hours, or drop by and meet the teachers."
      />

      <section className="py-16 sm:py-20 bg-cream">
        <div className="container-page grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Primary channel */}
          <Reveal className="lg:col-span-3">
            <div className="rounded-2xl border border-rose-200/70 bg-gradient-to-br from-rose-50 to-cream p-7 sm:p-9">
              {/* <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-600 text-white">
                <MessageCircle size={22} strokeWidth={1.75} />
              </span> */}
              <h2 className="mt-5 font-display text-2xl sm:text-3xl font-semibold text-ink tracking-display">
                Messenger is the fastest way to reach us
              </h2>
              <p className="mt-3 text-ink/70 leading-relaxed">
                Our staff are in Messenger throughout the day, so that is where inquiries get
                answered first. We reply{" "}
                <span className="font-medium text-ink">{site.responseWindow}</span>, and usually
                much sooner during opening hours.
              </p>

              <div className="mt-7">
                <MessengerCta source="visit_primary" variant="primary" showPreview />
              </div>

              <p className="mt-6 text-sm text-ink/70 leading-relaxed">
                Know what you&apos;re looking for already?{" "}
                <Link href="/programs/find" className="font-medium text-rose-600 hover:text-rose-700">
                  Answer four quick questions
                </Link>{" "}
                and we&apos;ll include your child&apos;s age, experience, and preferred days in the
                message.
              </p>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-ink/[0.06] bg-white p-6">
                <Phone size={20} className="text-rose-600 mb-3" strokeWidth={1.75} />
                <h3 className="font-display text-lg font-semibold text-ink tracking-display">
                  Prefer to call?
                </h3>
                <p className="mt-1.5 text-sm text-ink/70 leading-relaxed">
                  Reach us during opening hours on Wednesdays, Fridays, and Saturdays.
                </p>
                <CallLink className="mt-4" />
              </div>

              <div className="rounded-2xl border border-ink/[0.06] bg-white p-6">
                <FacebookIcon size={20} className="text-rose-600 mb-3" />
                <h3 className="font-display text-lg font-semibold text-ink tracking-display">
                  Follow along
                </h3>
                <p className="mt-1.5 text-sm text-ink/70 leading-relaxed">
                  Recital dates, student performances, and announcements go up on our page.
                </p>
                <a
                  href={site.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700"
                >
                  Visit our Facebook page
                </a>
              </div>
            </div>
          </Reveal>

          {/* Practical details */}
          <Reveal delay={0.1} className="lg:col-span-2">
            <div className="rounded-2xl border border-ink/[0.06] bg-white p-6 sm:p-7">
              <h2 className="font-display text-lg font-semibold text-ink tracking-display">
                Where to find us
              </h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-3 text-ink/70">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-rose-600" strokeWidth={1.75} />
                  <span>{site.address.full}</span>
                </li>
                <li className="flex items-start gap-3 text-ink/70">
                  <Phone size={17} className="mt-0.5 shrink-0 text-rose-600" strokeWidth={1.75} />
                  <a href={site.phoneHref} className="hover:text-rose-700">
                    {site.phone}
                  </a>
                </li>
              </ul>

              <h3 className="mt-7 flex items-center gap-2 font-display text-base font-semibold text-ink tracking-display">
                <Clock size={17} className="text-rose-600" strokeWidth={1.75} /> School hours
              </h3>
              <dl className="mt-3 space-y-2 text-sm">
                {site.hours.map((entry) => (
                  <div key={entry.day} className="flex justify-between gap-4">
                    <dt className="text-ink/70">{entry.day}</dt>
                    <dd className="text-ink/65">{entry.time}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4 pt-2 border-t border-ink/[0.06]">
                  <dt className="text-ink/65">Other days</dt>
                  <dd className="text-ink/65">Closed</dd>
                </div>
              </dl>
            </div>
            <div className="mt-6 rounded-2xl overflow-hidden border border-ink/[0.06]">
              <iframe
                title={`Map showing ${site.name}`}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15786.59734991598!2d123.77880733955074!3d10.245417200000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a977e206ced581%3A0xc03c79380ae007b3!2sRose%20Pharmacy%20Poblacion%20Minglanilla!5e1!3m2!1sen!2sph"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full"
              />
              <div className="mt-4 flex gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-5">
                <div>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">
                    Our school is located on the <strong>2nd floor</strong> of the same
                    building as Rose Pharmacy Poblacion Minglanilla. Look for Rose Pharmacy
                    at street level, then head upstairs to St Claire.
                  </p>
                </div>
              </div>
            </div>

          </Reveal>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Visit", path: "/visit" },
        ])}
      />
    </>
  );
}
