import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <Reveal className={`flex flex-col ${alignment} max-w-2xl`}>
      {eyebrow && (
        <span className={`mb-4 eyebrow ${light ? "!text-gold-light" : ""}`}>{eyebrow}</span>
      )}
      <h2
        className={`text-3xl sm:text-4xl md:text-[2.65rem] font-semibold leading-[1.15] tracking-display ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed max-w-xl ${
            light ? "text-white/70" : "text-ink/70"
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
