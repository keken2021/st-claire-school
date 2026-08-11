"use client";

import Link from "next/link";
import {
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

interface RippleButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  /** Internal paths render as a next/link, absolute URLs as a plain anchor. */
  href?: string;
  className?: string;
}

let rippleId = 0;

const VARIANTS: Record<string, string> = {
  primary: "bg-rose-600 text-white hover:bg-rose-700 shadow-soft hover:shadow-elev",
  secondary:
    "bg-transparent text-rose-700 border border-rose-600/40 hover:border-rose-600 hover:bg-rose-50",
  ghost: "bg-transparent text-ink hover:bg-mist border border-ink/12",
  gold: "bg-gold text-white hover:bg-gold-dark shadow-gold",
};

export default function RippleButton({
  children,
  variant = "primary",
  href,
  className = "",
  onClick,
  ...rest
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number; size: number }[]
  >([]);

  const classes = `btn-ripple relative inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 font-medium text-sm sm:text-[0.9375rem] tracking-wide transition-all duration-300 active:scale-[0.98] ${VARIANTS[variant]} ${className}`;

  const spawnRipple = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const id = rippleId++;
    setRipples((prev) => [
      ...prev,
      {
        id,
        x: event.clientX - rect.left - size / 2,
        y: event.clientY - rect.top - size / 2,
        size,
      },
    ]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 650);
  };

  const rippleNodes = ripples.map((ripple) => (
    <span
      key={ripple.id}
      className="ripple"
      style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }}
    />
  ));

  if (href) {
    const isInternal = href.startsWith("/");
    if (isInternal) {
      return (
        <Link href={href} className={classes} onClick={spawnRipple}>
          {children}
          {rippleNodes}
        </Link>
      );
    }
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        onClick={spawnRipple}
      >
        {children}
        {rippleNodes}
      </a>
    );
  }

  return (
    <button
      className={classes}
      onClick={(event) => {
        spawnRipple(event);
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
      {rippleNodes}
    </button>
  );
}
