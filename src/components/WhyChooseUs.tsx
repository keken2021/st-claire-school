import { whyChooseUs } from "@/data/whyChoose";
import { getIcon } from "@/utils/icons";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-28 bg-mist/50">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why Families Choose Us"
          title="A Nurturing Home for Growing Talent"
          description="Every detail, from class size to curriculum, is designed around one goal: helping your child feel safe enough to try, and supported enough to shine."
        />

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {whyChooseUs.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <Reveal key={item.id} delay={(i % 4) * 0.08}>
                <div className="h-full rounded-2xl bg-white p-6 sm:p-7 text-center border border-ink/[0.05] shadow-card hover:-translate-y-1 transition-transform duration-300">
                  <div className="mx-auto h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center mb-5">
                    <Icon size={22} className="text-rose-600" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display font-semibold text-ink text-base mb-2 tracking-display">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
