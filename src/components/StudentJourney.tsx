import { studentJourney } from "@/data/journey";
import { getIcon } from "@/utils/icons";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function StudentJourney() {
  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="container-page relative">
        <SectionHeading
          eyebrow="The St. Claire Path"
          title="Every Student's Journey to the Stage"
          description="A gentle, proven progression — because talent isn't discovered overnight, it's grown one lesson at a time."
        />

        <div className="mt-16 relative">
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-300/60 to-transparent"
          />

          <ol className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-4">
            {studentJourney.map((step, index) => {
              const Icon = getIcon(step.icon);
              return (
                <Reveal
                  key={step.id}
                  delay={index * 0.1}
                  as="li"
                  className="relative flex flex-col items-center text-center px-2"
                >
                  <div className="relative z-10 h-14 w-14 rounded-xl bg-white border border-rose-200 flex items-center justify-center shadow-card mb-4">
                    <Icon size={22} className="text-rose-600" strokeWidth={1.75} />
                  </div>
                  <span className="font-display font-semibold text-ink text-sm sm:text-base tracking-display">
                    {step.label}
                  </span>
                  <p className="mt-1.5 text-xs text-ink/65 leading-relaxed max-w-[10rem]">
                    {step.description}
                  </p>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
