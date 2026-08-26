import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import FacebookIcon from "./FacebookIcon";
import MessengerCta from "./MessengerCta";
import { site } from "@/lib/site";
import { getPrograms } from "@/lib/content";

export default async function Footer() {
  const year = new Date().getFullYear();
  const programs = await getPrograms();

  return (
    <footer className="relative bg-ink text-white/70 overflow-hidden">
      <div className="staff-lines opacity-[0.04] absolute inset-x-0 top-0" />
      <div className="container-page py-12 sm:py-16 grid gap-8 sm:gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-3 mb-5">
            <Image
              src="/logo.png"
              alt={`${site.shortName} crest`}
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
            <span className="font-display text-lg text-white font-semibold leading-tight tracking-display">
              {site.shortName}
              <span className="block text-[0.6rem] tracking-brand uppercase text-gold-light/80 font-medium mt-0.5">
                {site.tagline}
              </span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-white/55 max-w-xs">
            Give your child the opportunity to shine and excel — discovering the talent and
            skills already within them, in {site.address.locality}, {site.address.region}.
          </p>
          <div className="mt-6">
            <MessengerCta source="footer" variant="onDark" label="Message us" />
          </div>
        </div>

        <div>
          <h2 className="font-display text-white text-sm font-semibold tracking-wider uppercase mb-4 sm:mb-5">
            Quick Links
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-1">
            {[
              { href: "/about", label: "About Us" },
              { href: "/programs", label: "Programs" },
              { href: "/programs/find", label: "Find a Program" },
              { href: "/gallery", label: "Photo Gallery" },
              { href: "/testimonials", label: "Testimonials" },
              { href: "/faq", label: "FAQ" },
              { href: "/visit", label: "Visit Us" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-gold-light transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-white text-sm font-semibold tracking-wider uppercase mb-4 sm:mb-5">
            Programs
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-1">
            {programs.slice(0, 6).map((program) => (
              <li key={program.id}>
                <Link
                  href={`/programs/${program.slug}`}
                  className="hover:text-gold-light transition-colors"
                >
                  {program.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-white text-sm font-semibold tracking-wider uppercase mb-5">
            Contact
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="shrink-0 mt-0.5 text-gold-light" strokeWidth={1.75} />
              <span>{site.address.full}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="shrink-0 text-gold-light" strokeWidth={1.75} />
              <a href={site.phoneHref} className="hover:text-gold-light transition-colors">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-gold-light" strokeWidth={1.75} />
              <a href={`mailto:${site.email}`} className="hover:text-gold-light transition-colors">
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FacebookIcon size={16} className="shrink-0 text-gold-light" />
              <a
                href={site.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-light transition-colors"
              >
                Follow us on Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.08]">
        <div className="container-page py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/55">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>{site.address.full}</p>
        </div>
      </div>
    </footer>
  );
}
