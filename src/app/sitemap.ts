import type { MetadataRoute } from "next";
import { getPrograms } from "@/lib/content";
import { site } from "@/lib/site";

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/programs", priority: 0.9 },
  { path: "/programs/find", priority: 0.9 },
  { path: "/about", priority: 0.7 },
  { path: "/gallery", priority: 0.6 },
  { path: "/testimonials", priority: 0.6 },
  { path: "/faq", priority: 0.7 },
  { path: "/visit", priority: 0.8 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const programs = await getPrograms();
  const now = new Date();

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${site.url}${route.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route.priority,
    })),
    ...programs.map((program) => ({
      url: `${site.url}/programs/${program.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
