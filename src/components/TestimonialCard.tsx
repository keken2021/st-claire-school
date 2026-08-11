import { Quote } from "lucide-react";
import type { Testimonial } from "@/types";
import StarRating from "./StarRating";
import Reveal from "./Reveal";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const palette = ["#C43B6E", "#B8973A", "#88264B", "#8F7429", "#A82F5C"];

function colorFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export default function TestimonialCard({
  testimonial,
  delay = 0,
}: {
  testimonial: Testimonial;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <figure className="h-full flex flex-col rounded-2xl bg-white border border-ink/[0.06] p-7 sm:p-8 shadow-card relative">
        <Quote
          className="absolute top-6 right-7 text-rose-100"
          size={36}
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <StarRating rating={testimonial.rating} />
        <blockquote className="mt-4 text-ink/70 text-sm sm:text-base leading-relaxed flex-1">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3 pt-5 border-t border-ink/[0.06]">
          <span
            className="h-11 w-11 shrink-0 rounded-full flex items-center justify-center text-white font-medium text-sm"
            style={{ backgroundColor: colorFor(testimonial.avatarSeed) }}
            aria-hidden="true"
          >
            {initials(testimonial.name)}
          </span>
          <span>
            <span className="block font-semibold text-ink text-sm">{testimonial.name}</span>
            <span className="block text-xs text-ink/65">
              {testimonial.role} · {testimonial.program}
            </span>
          </span>
        </figcaption>
      </figure>
    </Reveal>
  );
}
