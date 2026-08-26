"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import RippleButton from "./RippleButton";
import FloatingNotes from "./FloatingNotes";
import { site } from "@/lib/site";

const slides = [
  { src: "/images/gallery/hero1.jpg", width: 958, height: 487 },
  { src: "/images/programs/dance.jpg", width: 1848, height: 1224 },
  { src: "/images/gallery/1.jpg", width: 1848, height: 1224 },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[78svh] sm:min-h-[100svh] flex items-end overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[index].src}
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-hero-veil" />
        <div className="absolute inset-0 bg-spotlight" />
      </div>

      <div
        aria-hidden="true"
        className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-sweep pointer-events-none"
      />

      <FloatingNotes className="opacity-40" />

      <div className="relative z-10 container-page pb-14 sm:pb-28 pt-28 sm:pt-40">
        {/* <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display text-white text-2xl sm:text-3xl md:text-4xl font-semibold tracking-display"
        >
          {site.shortName}
          <span className="mt-2 block text-[0.65rem] sm:text-xs font-body font-medium tracking-brand uppercase text-gold-light/90">
            School of {site.tagline}
          </span>
        </motion.p> */}

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12 }}
          className="max-w-3xl text-white font-display font-semibold text-4xl sm:text-5xl md:text-6xl leading-[1.08] tracking-display"
        >
          Where passion meets <span className="text-gradient-gold">performance</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28 }}
          className="max-w-lg mt-4 sm:mt-6 text-white/75 text-base sm:text-lg leading-relaxed font-light"
        >
          Helping children discover confidence, creativity, and excellence through music and the
          performing arts in {site.address.locality}, {site.address.region}.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.42 }}
          className="mt-7 sm:mt-10 flex flex-wrap items-start gap-4"
        >
          <RippleButton href="/programs/find" variant="gold" className="mb-10">
            Find the Right Program
          </RippleButton>
          {/* <MessengerCta source="hero" variant="onDark" /> */}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-1 text-white/55"
      >
        <span className="text-[0.6rem] uppercase tracking-brand">Scroll</span>
        <ChevronDown size={18} className="animate-bounce" />
      </motion.div>
    </section>
  );
}
