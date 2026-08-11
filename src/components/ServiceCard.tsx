import type { ServiceItem } from "@/types";
import { getIcon } from "@/utils/icons";
import Reveal from "./Reveal";

export default function ServiceCard({
  service,
  delay = 0,
}: {
  service: ServiceItem;
  delay?: number;
}) {
  const Icon = getIcon(service.icon);
  return (
    <Reveal delay={delay} className="h-full">
      <div className="h-full rounded-2xl bg-white border border-ink/[0.06] p-6 hover:border-rose-200 hover:shadow-card transition-all duration-300">
        <div className="h-11 w-11 rounded-xl bg-rose-50 flex items-center justify-center mb-4">
          <Icon size={20} className="text-rose-600" strokeWidth={1.75} />
        </div>
        <h3 className="font-display text-lg font-semibold text-ink mb-1.5 tracking-display">
          {service.name}
        </h3>
        <p className="text-sm text-ink/70 leading-relaxed">{service.description}</p>
      </div>
    </Reveal>
  );
}
