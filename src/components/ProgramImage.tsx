import Image from "next/image";
import { getIcon } from "@/utils/icons";
import type { Program } from "@/types";

/**
 * Some programs have no photograph yet. Rather than reaching for stock imagery
 * that misrepresents the school, those render a branded panel built from the
 * program's own icon.
 */
export default function ProgramImage({
  program,
  sizes,
  priority = false,
  className = "",
}: {
  program: Pick<Program, "name" | "image" | "icon">;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (program.image) {
    return (
      <Image
        src={program.image}
        alt={`${program.name} class at St. Claire`}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }

  const Icon = getIcon(program.icon);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-800 via-rose-900 to-ink ${className}`}
    >
      <div className="staff-lines absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-20" />
      <Icon size={56} strokeWidth={1.25} className="relative text-gold-light/70" />
    </div>
  );
}
