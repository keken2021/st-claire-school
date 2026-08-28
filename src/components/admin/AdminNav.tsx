"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarClock,
  Home,
  ImageIcon,
  Quote,
} from "lucide-react";

const NAV = [
  {
    href: "/admin",
    label: "Home",
    shortLabel: "Home",
    icon: Home,
    description: "Start here",
  },
  {
    href: "/admin/programs",
    label: "Programs & Classes",
    shortLabel: "Programs",
    icon: CalendarClock,
    description: "Edit classes, times & fees",
    match: (path: string) => path.startsWith("/admin/programs"),
  },
  {
    href: "/admin/testimonials",
    label: "Reviews",
    shortLabel: "Reviews",
    icon: Quote,
    description: "What parents say",
  },
  {
    href: "/admin/gallery",
    label: "Photos",
    shortLabel: "Photos",
    icon: ImageIcon,
    description: "Gallery pictures",
  },
  {
    href: "/admin/insights",
    label: "Activity",
    shortLabel: "Activity",
    icon: BarChart3,
    description: "Who visited the site",
  },
] as const;

function isActive(path: string, item: (typeof NAV)[number]): boolean {
  if ("match" in item && item.match) return item.match(path);
  return path === item.href;
}

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Website sections" className="border-t border-ink/[0.06] bg-white">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-4 py-4 sm:flex sm:flex-wrap sm:gap-2 sm:px-6">
        {NAV.map((item) => {
          const active = isActive(pathname, item);
          const Icon = item.icon;

          return (
            <li key={item.href} className="sm:flex-1 sm:min-w-[140px]">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[72px] flex-col items-start justify-center gap-1 rounded-xl border-2 px-4 py-3 transition-colors sm:min-h-[64px] ${
                  active
                    ? "border-rose-300 bg-rose-50 text-rose-800"
                    : "border-transparent bg-mist/40 text-ink/80 hover:border-ink/10 hover:bg-mist/70"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={20} strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                  <span className="text-base font-semibold">{item.shortLabel}</span>
                </span>
                <span className="hidden text-xs text-ink/60 sm:block">{item.description}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
