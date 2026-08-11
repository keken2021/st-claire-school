"use client";

import { useMemo, useState } from "react";
import type { Program } from "@/types";
import { programCategories } from "@/data/programs";
import ProgramCard from "./ProgramCard";

export default function ProgramBrowser({ programs }: { programs: Program[] }) {
  const [category, setCategory] = useState<(typeof programCategories)[number]>("All");

  const filtered = useMemo(
    () =>
      category === "All"
        ? programs
        : programs.filter((program) => program.category === category),
    [category, programs]
  );

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-14">
        {programCategories.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setCategory(option)}
            aria-pressed={category === option}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
              category === option
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-white text-ink/70 border-ink/10 hover:border-rose-300 hover:text-rose-600"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filtered.map((program, index) => (
          <ProgramCard key={program.id} program={program} delay={(index % 6) * 0.06} />
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {filtered.length} programs shown
      </p>
    </div>
  );
}
