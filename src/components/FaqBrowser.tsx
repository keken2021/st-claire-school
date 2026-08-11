"use client";

import { useMemo, useState } from "react";
import type { FaqItem } from "@/types";
import { faqCategories } from "@/data/faq";
import Accordion from "./Accordion";

export default function FaqBrowser({ items }: { items: FaqItem[] }) {
  const [category, setCategory] = useState<(typeof faqCategories)[number]>("All");

  const filtered = useMemo(
    () => (category === "All" ? items : items.filter((item) => item.category === category)),
    [category, items]
  );

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {faqCategories.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setCategory(option)}
            aria-pressed={category === option}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors border ${
              category === option
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-white text-ink/70 border-ink/10 hover:border-rose-300 hover:text-rose-600"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion key={category} items={filtered} />
      </div>

      <p aria-live="polite" className="sr-only">
        {filtered.length} questions shown
      </p>
    </div>
  );
}
