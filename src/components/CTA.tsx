import RippleButton from "./RippleButton";
import MessengerCta from "./MessengerCta";
import Reveal from "./Reveal";
import FloatingNotes from "./FloatingNotes";

interface CTAProps {
  title?: string;
  description?: string;
  source?: string;
}

export default function CTA({
  title = "Ready to Help Your Child Shine?",
  description = "Tell us your child's age and interest, and we'll point you to the right program. Most questions are answered the same day on Messenger.",
  source = "cta",
}: CTAProps) {
  return (
    <section className="relative overflow-hidden bg-ink py-20 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-800/30 via-ink to-ink" />
      <div className="absolute inset-0 bg-spotlight opacity-60" />
      <FloatingNotes className="opacity-25" />
      <div className="container-page relative text-center max-w-2xl mx-auto">
        <Reveal>
          <p className="eyebrow !text-gold-light mb-5">Begin Their Journey</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-[2.65rem] font-semibold text-white tracking-display leading-tight">
            {title}
          </h2>
          <p className="mt-5 text-white/60 leading-relaxed text-base sm:text-lg">{description}</p>
          <div className="mt-10 flex flex-wrap justify-center items-start gap-4">
            <RippleButton href="/programs/find" variant="gold">
              Find the Right Program
            </RippleButton>
            <MessengerCta source={source} variant="onDark" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
