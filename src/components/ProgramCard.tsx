import Link from "next/link";
import { ArrowRight, Clock, Users2 } from "lucide-react";
import type { Program } from "@/types";
import { getIcon } from "@/utils/icons";
import { openSeats } from "@/lib/schedule";
import Reveal from "./Reveal";
import ProgramImage from "./ProgramImage";

interface ProgramCardProps {
  program: Program;
  delay?: number;
}

export default function ProgramCard({ program, delay = 0 }: ProgramCardProps) {
  const Icon = getIcon(program.icon);
  const slots = (program.slots ?? []).filter((slot) => slot.isActive);
  const hasAvailability = slots.some((slot) => openSeats(slot) > 0);

  return (
    <Reveal delay={delay} className="h-full">
      <article className="group h-full flex flex-col rounded-2xl bg-white border border-ink/[0.06] overflow-hidden shadow-card hover:shadow-elev transition-shadow duration-500">
        <Link
          href={`/programs/${program.slug}`}
          className="relative aspect-[4/5] overflow-hidden block"
          tabIndex={-1}
          aria-hidden="true"
        >
          <ProgramImage
            program={program}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <span className="absolute top-4 left-4 h-10 w-10 rounded-lg bg-white/95 backdrop-blur flex items-center justify-center shadow-card">
            <Icon size={18} className="text-rose-600" strokeWidth={1.75} />
          </span>
          <span className="absolute bottom-4 left-4 right-4 text-white font-display text-xl font-semibold tracking-display drop-shadow">
            {program.name}
          </span>
        </Link>

        <div className="flex flex-1 flex-col p-6">
          <p className="text-sm text-ink/70 leading-relaxed flex-1">{program.description}</p>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-ink/70">
              <dt className="sr-only">Ages</dt>
              <Users2 size={14} className="text-rose-500" strokeWidth={1.75} />
              <dd>{program.ageGroup}</dd>
            </div>
            <div className="flex items-center gap-1.5 text-ink/70">
              <dt className="sr-only">Session length</dt>
              <Clock size={14} className="text-rose-500" strokeWidth={1.75} />
              <dd>{program.duration}</dd>
            </div>
          </dl>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-md bg-rose-50 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-rose-700">
              {program.skillLevel}
            </span>
            {hasAvailability && (
              <span className="inline-block rounded-md bg-gold/10 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-gold-dark">
                Available
              </span>
            )}
          </div>

          <Link
            href={`/programs/${program.slug}`}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-rose-600/40 text-rose-700 font-medium text-sm px-5 py-2.5 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-colors"
          >
            View {program.name}
            <ArrowRight size={15} strokeWidth={1.75} />
          </Link>
        </div>
      </article>
    </Reveal>
  );
}
