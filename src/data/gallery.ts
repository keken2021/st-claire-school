/**
 * Real photographs from the school, with dimensions read from the source files
 * so next/image can reserve layout space and avoid shifting.
 *
 * Preferred workflow: drop new photos into `public/images/gallery/` (optionally
 * inside a category subfolder such as `Classes` or `Events`). Those files are
 * picked up automatically and do not need a database row.
 *
 * This curated list is only the fallback when `public/images/gallery` is empty.
 */
import type { GalleryImage } from "@/types";

export const galleryImages: GalleryImage[] = [
  {
    id: "g-piano",
    src: "/images/gallery/piano.jpg",
    category: "Classes",
    caption: "Piano fundamentals in the studio",
    width: 468,
    height: 1040,
  },
  {
    id: "g-vocals",
    src: "/images/gallery/vocals.jpg",
    category: "Classes",
    caption: "Voice coaching session",
    width: 1365,
    height: 2048,
  },
  {
    id: "g-violin",
    src: "/images/gallery/violin1.jpg",
    category: "Classes",
    caption: "Violin students at practice",
    width: 1875,
    height: 1247,
  },
  {
    id: "g-violin-2",
    src: "/images/gallery/violin.jpg",
    category: "Student Performances",
    caption: "Violin performance",
    width: 1365,
    height: 2048,
  },
  {
    id: "g-guitar",
    src: "/images/gallery/guitar-jacob.jpg",
    category: "Classes",
    caption: "Guitar lesson in progress",
    width: 2048,
    height: 1365,
  },
  {
    id: "g-ukulele",
    src: "/images/gallery/ukelele.jpg",
    category: "Classes",
    caption: "Ukulele class for our youngest students",
    width: 1365,
    height: 2048,
  },
  {
    id: "g-ballet",
    src: "/images/gallery/ballet.jpg",
    category: "Student Performances",
    caption: "Ballet students in the studio",
    width: 960,
    height: 720,
  },
  {
    id: "g-dance",
    src: "/images/gallery/dance.jpg",
    category: "Student Performances",
    caption: "Dance production number",
    width: 1848,
    height: 1224,
  },
  {
    id: "g-event",
    src: "/images/gallery/1.jpg",
    category: "Events",
    caption: "School event at St. Claire",
    width: 1848,
    height: 1224,
  },
  {
    id: "g-stage",
    src: "/images/gallery/hero1.jpg",
    category: "Events",
    caption: "On stage at St. Claire",
    width: 958,
    height: 487,
  },
];

export const galleryCategories = [
  "All",
  "Classes",
  "Student Performances",
  "Events",
] as const;
