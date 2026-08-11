"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import RippleButton from "./RippleButton";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/visit", label: "Visit" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overHero = !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        overHero ? "bg-transparent py-5" : "glass shadow-elev py-2.5"
      }`}
    >
      <nav
        className="container-page flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label={`${site.shortName} home`}>
          <Image
            src="/logo.png"
            alt={`${site.name} crest`}
            width={48}
            height={48}
            priority
            className="h-11 w-11 sm:h-12 sm:w-12 object-contain"
          />
          <span className="hidden sm:flex flex-col leading-tight">
            <span
              className={`font-display font-semibold text-base tracking-display ${
                overHero ? "text-white" : "text-ink"
              }`}
            >
              {site.shortName}
            </span>
            <span
              className={`text-[0.6rem] tracking-brand uppercase font-medium ${
                overHero ? "text-gold-light/90" : "text-rose-600"
              }`}
            >
              {site.tagline}
            </span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-0.5">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`px-3.5 py-2 rounded-lg text-[0.8125rem] font-medium tracking-wide transition-colors ${
                  overHero
                    ? isActive(link.href)
                      ? "text-white bg-white/12"
                      : "text-white/75 hover:text-white hover:bg-white/8"
                    : isActive(link.href)
                      ? "text-rose-600 bg-rose-50"
                      : "text-ink/65 hover:text-ink hover:bg-mist"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <RippleButton
            href="/programs/find"
            variant={overHero ? "gold" : "primary"}
            className="!py-2.5 !px-5 !text-sm"
          >
            Find a Program
          </RippleButton>
        </div>

        <button
          type="button"
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            overHero ? "text-white hover:bg-white/10" : "text-ink hover:bg-mist"
          }`}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-ink/5 mt-2 bg-cream/95 backdrop-blur-xl">
          <ul className="container-page py-4 flex flex-col gap-0.5">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-rose-600 bg-rose-50"
                      : "text-ink/80 hover:bg-mist"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <RippleButton href="/programs/find" variant="primary" className="w-full">
                Find a Program
              </RippleButton>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
