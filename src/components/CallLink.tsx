"use client";

import { Phone } from "lucide-react";
import { site } from "@/lib/site";
import { sendInquiryEvent } from "@/lib/events";

/** Phone fallback for parents who would rather not use Messenger. */
export default function CallLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={site.phoneHref}
      onClick={() => sendInquiryEvent({ type: "call_click", source: "visit_phone" })}
      className={`inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 ${className}`}
    >
      <Phone size={15} strokeWidth={1.75} /> {site.phone}
    </a>
  );
}
