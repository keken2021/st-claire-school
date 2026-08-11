"use client";

import { useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import {
  buildMessengerMessage,
  buildMessengerUrl,
  type MessengerContext,
} from "@/lib/messenger";
import { sendInquiryEvent } from "@/lib/events";
import { toAgeBucket } from "@/lib/privacy";
import type { InterestAnswer } from "@/lib/recommend";

interface MessengerCtaProps extends MessengerContext {
  /** Database id, so the funnel can be grouped by program. */
  programId?: string;
  interest?: InterestAnswer;
  label?: string;
  variant?: "primary" | "gold" | "outline" | "onDark";
  className?: string;
  /** Shows the composed message underneath, so parents see what they'll send. */
  showPreview?: boolean;
}

const VARIANTS: Record<string, string> = {
  primary: "bg-rose-600 text-white hover:bg-rose-700 shadow-soft hover:shadow-elev",
  gold: "bg-gold text-white hover:bg-gold-dark shadow-gold",
  outline:
    "bg-transparent text-rose-700 border border-rose-600/40 hover:border-rose-600 hover:bg-rose-50",
  onDark:
    "bg-white/10 text-white border border-white/25 hover:bg-white/20 hover:border-white/40",
};

/**
 * The single conversion point of the site.
 *
 * Opens the school's Messenger thread and copies a pre-composed, context-rich
 * message to the clipboard, because m.me cannot pre-fill the message body
 * itself. The paste reminder is shown before the click — Messenger opens in a
 * new tab, so a post-click toast on this page would be easy to miss.
 */
export default function MessengerCta({
  programId,
  program,
  age,
  experience,
  when,
  source,
  waitlist,
  interest,
  label,
  variant = "primary",
  className = "",
  showPreview = false,
}: MessengerCtaProps) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const context: MessengerContext = { program, age, experience, when, source, waitlist };
  const message = buildMessengerMessage(context);
  const href = buildMessengerUrl(context);
  const onDark = variant === "onDark";

  const handleClick = () => {
    sendInquiryEvent({
      type: "messenger_click",
      source,
      programId,
      ageBucket: typeof age === "number" ? toAgeBucket(age) : undefined,
      interest,
      experience,
      schedulePref: when,
    });

    // Called inside the click gesture so the clipboard permission holds.
    navigator.clipboard?.writeText(message).then(
      () => {
        setCopied(true);
        setCopyFailed(false);
      },
      () => setCopyFailed(true)
    );
  };

  const defaultLabel = waitlist ? "Ask about the waitlist" : "Ask on Messenger";

  return (
    <div className={showPreview ? "w-full" : "inline-flex flex-col items-start"}>
      {/* Shown before the click: Messenger opens in a new tab, so this is the
          only chance to tell the parent what to do once they get there. */}
      {/* <p
        className={`mb-3 flex items-start gap-2 text-xs leading-relaxed sm:text-sm ${
          onDark ? "text-white/70" : "text-ink/70"
        }`}
      >
        <ClipboardPaste
          size={15}
          strokeWidth={1.75}
          className={`mt-0.5 shrink-0 ${onDark ? "text-gold-light" : "text-rose-600"}`}
          aria-hidden="true"
        />
        <span>
          We&apos;ll copy your message when you click — paste it in Messenger{" "}
          <kbd
            className={`rounded px-1.5 py-0.5 font-medium ${
              onDark ? "bg-white/10 text-white/85" : "bg-mist text-ink/80"
            }`}
          >
            Ctrl + V
          </kbd>{" "}
          and send.
        </span>
      </p> */}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`btn-ripple inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 font-medium text-sm sm:text-[0.9375rem] tracking-wide transition-all duration-300 active:scale-[0.98] ${VARIANTS[variant]} ${className}`}
      >
        <MessageCircle size={18} strokeWidth={1.75} />
        {label ?? defaultLabel}
      </a>

      <p aria-live="polite" className="sr-only">
        {copied
          ? "Your message has been copied. Paste it in Messenger with Control V and send."
          : copyFailed
            ? "Messenger is opening. You can copy your details from the preview below."
            : ""}
      </p>

      {copyFailed && (
        <p
          role="alert"
          className={`mt-2 text-xs leading-relaxed ${onDark ? "text-white/70" : "text-ink/70"}`}
        >
          Messenger is opening. Copy the message below, then paste it there.
        </p>
      )}

      {copied && !copyFailed && (
        <p
          className={`mt-2 inline-flex items-center gap-1.5 text-xs leading-relaxed ${
            onDark ? "text-white/70" : "text-ink/70"
          }`}
        >
          <Check size={13} className={onDark ? "text-gold-light" : "text-rose-600"} />
          Copied. Paste in Messenger and send.
        </p>
      )}

      {showPreview && (
        <div className="mt-4 rounded-xl border border-ink/[0.08] bg-white p-4">
          <p className="eyebrow mb-2">What we&apos;ll copy for you</p>
          <p className="text-sm text-ink/70 leading-relaxed">{message}</p>
        </div>
      )}
    </div>
  );
}
