"use client";

import { motion } from "framer-motion";
import FloatingNotes from "./FloatingNotes";

export default function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative bg-ink pt-36 pb-24 sm:pt-44 sm:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-spotlight" />
      <div className="absolute inset-0 bg-gradient-to-b from-rose-900/20 via-transparent to-transparent" />
      <div className="staff-lines opacity-[0.05] absolute inset-x-0 bottom-0" />
      <FloatingNotes className="opacity-30" />
      <div className="container-page relative text-center max-w-2xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eyebrow !text-gold-light mb-5 inline-block"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl font-semibold text-white tracking-display"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-white/65 leading-relaxed text-base sm:text-lg"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
