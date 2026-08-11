import { Music, Music2, Music3, Music4 } from "lucide-react";

const notes = [
  { Icon: Music, top: "12%", left: "8%", size: 26, delay: "0s", anim: "animate-float" },
  { Icon: Music2, top: "24%", left: "88%", size: 34, delay: "1.2s", anim: "animate-floatSlow" },
  { Icon: Music3, top: "68%", left: "4%", size: 22, delay: "2.1s", anim: "animate-float" },
  { Icon: Music4, top: "78%", left: "92%", size: 28, delay: "0.6s", anim: "animate-floatSlow" },
  { Icon: Music2, top: "45%", left: "50%", size: 18, delay: "1.8s", anim: "animate-float" },
];

export default function FloatingNotes({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {notes.map(({ Icon, top, left, size, delay, anim }, i) => (
        <Icon
          key={i}
          style={{ top, left, animationDelay: delay, width: size, height: size }}
          className={`absolute text-rose-300/40 ${anim}`}
        />
      ))}
    </div>
  );
}
