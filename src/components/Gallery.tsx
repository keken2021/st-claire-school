"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { GalleryImage } from "@/types";
import Reveal from "./Reveal";

export default function Gallery({
  images,
  limit,
}: {
  images: GalleryImage[];
  limit?: number;
}) {
  const categories = useMemo(() => {
    const unique = Array.from(new Set(images.map((image) => image.category))).sort();
    return ["All", ...unique] as const;
  }, [images]);

  const [active, setActive] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const list =
      active === "All" ? images : images.filter((image) => image.category === active);
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }, [active, images, limit]);

  const close = () => setLightboxIndex(null);

  const step = (delta: number) => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + delta + filtered.length) % filtered.length);
  };

  const current = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div>
      {!limit && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              aria-pressed={active === category}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors border ${
                active === category
                  ? "bg-rose-600 text-white border-rose-600"
                  : "bg-white text-ink/70 border-ink/10 hover:border-rose-300 hover:text-rose-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
        {filtered.map((image, index) => (
          <Reveal
            key={image.id}
            delay={Math.min((index % 8) * 0.05, 0.4)}
            className="mb-4 break-inside-avoid"
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="group relative block w-full overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500"
              aria-label={`View photo: ${image.caption}`}
            >
              <Image
                src={image.src}
                alt={image.caption}
                width={image.width}
                height={image.height}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-white text-xs font-medium flex items-center gap-1.5">
                  <ZoomIn size={14} /> {image.caption}
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={current.caption}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close lightbox"
              className="absolute top-5 right-5 h-11 w-11 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X size={22} />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(-1);
              }}
              aria-label="Previous photo"
              className="absolute left-3 sm:left-6 h-11 w-11 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <ChevronLeft size={22} />
            </button>

            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[80vh] max-w-4xl"
            >
              <Image
                src={current.src}
                alt={current.caption}
                width={current.width}
                height={current.height}
                sizes="90vw"
                className="max-h-[80vh] w-auto rounded-xl object-contain shadow-2xl"
              />
            </motion.div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(1);
              }}
              aria-label="Next photo"
              className="absolute right-3 sm:right-6 h-11 w-11 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <ChevronRight size={22} />
            </button>

            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm px-4 text-center">
              {current.caption} · {current.category}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
