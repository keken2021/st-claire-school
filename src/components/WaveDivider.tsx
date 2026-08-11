interface WaveDividerProps {
  color?: string;
  flip?: boolean;
  className?: string;
}

/** A soft curtain-fold inspired wave, used to transition between sections. */
export default function WaveDivider({
  color = "#FAF7F5",
  flip = false,
  className = "",
}: WaveDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={`w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""} ${className}`}
    >
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[60px] sm:h-[90px]">
        <path
          d="M0,64 C160,110 320,20 480,40 C640,60 720,100 900,80 C1080,60 1200,10 1440,50 L1440,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
