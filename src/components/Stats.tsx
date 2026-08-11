import { stats } from "@/data/journey";
import AnimatedCounter from "./AnimatedCounter";
import Reveal from "./Reveal";

export default function Stats() {
  return (
    <section className="relative -mt-14 sm:-mt-16 z-20">
      <div className="container-page">
        <Reveal>
          <div className="rounded-2xl bg-white shadow-elev border border-ink/[0.06] grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-ink/[0.06]">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className="flex flex-col items-center justify-center text-center px-4 py-8 sm:py-10"
              >
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  duration={1.6 + index * 0.2}
                  className="font-display font-semibold text-3xl sm:text-4xl text-rose-600 tracking-display"
                />
                <span className="mt-2 text-[0.7rem] sm:text-xs text-ink/65 font-medium uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
