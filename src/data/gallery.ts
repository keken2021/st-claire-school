import type { GalleryImage } from "@/types";

/**
 * Real photographs from the school, with dimensions read from the source files
 * so next/image can reserve layout space and avoid shifting.
 *
 * Additional photos live in src/assets and can be published through /admin once
 * the school confirms captions and consent for any images featuring minors.
 */
export const galleryImages: GalleryImage[] = [
  {
    id: "g-piano",
    src: "/images/programs/piano.jpg",
    category: "Classes",
    caption: "Piano fundamentals in the studio",
    width: 468,
    height: 1040,
  },
  {
    id: "g-vocals",
    src: "/images/programs/vocals.jpg",
    category: "Classes",
    caption: "Voice coaching session",
    width: 1365,
    height: 2048,
  },
  {
    id: "g-violin",
    src: "/images/programs/violin1.jpg",
    category: "Classes",
    caption: "Violin students at practice",
    width: 1875,
    height: 1247,
  },
  {
    id: "g-violin-2",
    src: "/images/site/violin.jpg",
    category: "Student Performances",
    caption: "Violin performance",
    width: 1365,
    height: 2048,
  },
  {
    id: "g-guitar",
    src: "/images/programs/guitar-jacob.jpg",
    category: "Classes",
    caption: "Guitar lesson in progress",
    width: 2048,
    height: 1365,
  },
  {
    id: "g-ukulele",
    src: "/images/programs/ukelele.jpg",
    category: "Classes",
    caption: "Ukulele class for our youngest students",
    width: 1365,
    height: 2048,
  },
  {
    id: "g-ballet",
    src: "/images/programs/ballet.jpg",
    category: "Student Performances",
    caption: "Ballet students in the studio",
    width: 960,
    height: 720,
  },
  {
    id: "g-dance",
    src: "/images/programs/dance.jpg",
    category: "Student Performances",
    caption: "Dance production number",
    width: 1848,
    height: 1224,
  },
  {
    id: "g-event",
    src: "/images/site/1.jpg",
    category: "Events",
    caption: "School event at St. Claire",
    width: 1848,
    height: 1224,
  },
  {
    id: "g-stage",
    src: "/images/site/hero1.jpg",
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
