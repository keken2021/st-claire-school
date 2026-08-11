import type { Program } from "@/types";

/**
 * Canonical program content. This doubles as the database seed (see
 * prisma/seed.ts) and as the fallback content source when DATABASE_URL is not
 * configured, so the site builds and runs without a database.
 *
 * PLACEHOLDER: tuition amounts and slot capacities are realistic stand-ins.
 * Replace them with the school's real figures via /admin before launch.
 *
 * Class days mirror the school's opening hours (Wednesday, Friday, Saturday).
 */

const slot = (
  programId: string,
  dayOfWeek: number,
  startMinutes: number,
  capacity: number,
  enrolledCount: number
) => ({
  id: `${programId}-${dayOfWeek}-${startMinutes}`,
  programId,
  dayOfWeek,
  startMinutes,
  durationMin: 60,
  capacity,
  enrolledCount,
  isActive: true,
});

const tuition = (
  programId: string,
  name: string,
  amount: number,
  cadence: string,
  sortOrder: number,
  note?: string
) => ({
  id: `${programId}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  programId,
  name,
  amount,
  cadence,
  note: note ?? null,
  sortOrder,
});

export const programs: Program[] = [
  {
    id: "piano",
    slug: "piano",
    name: "Piano",
    category: "Music",
    interest: "music",
    description:
      "From first-touch fundamentals to expressive recital pieces, students build technique, sight-reading, and musicality at their own pace.",
    detail:
      "Piano is where most of our students begin, and it stays with them. Lessons move from posture and hand shape through sight-reading and scales, then into repertoire the student actually wants to play. Every term ends with a low-pressure performance opportunity, because playing for other people is a separate skill from playing well.",
    ageGroup: "Ages 5+",
    minAge: 5,
    skillLevel: "Beginner to Advanced",
    duration: "60 min / session",
    icon: "Piano",
    image: "/images/programs/piano.jpg",
    imageWidth: 468,
    imageHeight: 1040,
    sortOrder: 1,
    isActive: true,
    slots: [
      slot("piano", 3, 900, 1, 0),
      slot("piano", 5, 960, 1, 1),
      slot("piano", 6, 540, 6, 4),
      slot("piano", 6, 660, 6, 6),
    ],
    tuition: [
      tuition("piano", "Private", 4000, "per month", 1, "Eight 60-minute one-on-one sessions"),
      tuition("piano", "Group", 2500, "per month", 2, "Up to six students per class"),
    ],
  },
  {
    id: "voice",
    slug: "voice",
    name: "Voice Lessons",
    category: "Music",
    interest: "music",
    description:
      "Breath control, pitch, tone, and stage presence — developed through warm-ups, repertoire coaching, and performance practice.",
    detail:
      "Voice students learn to treat their instrument carefully: breathing, support, resonance, and range built slowly so nothing is strained. Coaching covers song interpretation and microphone technique, and students are encouraged toward solo spots at recitals when they feel ready.",
    ageGroup: "Ages 7+",
    minAge: 7,
    skillLevel: "Beginner to Advanced",
    duration: "60 min / session",
    icon: "Mic2",
    image: "/images/programs/vocals.jpg",
    imageWidth: 1365,
    imageHeight: 2048,
    sortOrder: 2,
    isActive: true,
    slots: [
      slot("voice", 3, 960, 1, 0),
      slot("voice", 6, 600, 8, 5),
    ],
    tuition: [
      tuition("voice", "Private", 4000, "per month", 1, "Eight 60-minute one-on-one sessions"),
      tuition("voice", "Group", 2500, "per month", 2, "Up to eight students per class"),
    ],
  },
  {
    id: "violin",
    slug: "violin",
    name: "Violin",
    category: "Music",
    interest: "music",
    description:
      "Posture, bowing, and ear training taught through a proven method, building toward confident solo and ensemble playing.",
    detail:
      "Violin rewards patience, so early lessons focus on how the instrument sits, how the bow moves, and how to hear when a note is true. Students progress into ensemble playing, which builds listening skills that solo practice alone cannot teach.",
    ageGroup: "Ages 6+",
    minAge: 6,
    skillLevel: "Beginner to Advanced",
    duration: "60 min / session",
    icon: "Music2",
    image: "/images/programs/violin1.jpg",
    imageWidth: 1875,
    imageHeight: 1247,
    sortOrder: 3,
    isActive: true,
    slots: [
      slot("violin", 5, 900, 1, 0),
      slot("violin", 6, 720, 6, 3),
    ],
    tuition: [
      tuition("violin", "Private", 4200, "per month", 1, "Eight 60-minute one-on-one sessions"),
      tuition("violin", "Group", 2700, "per month", 2, "Up to six students per class"),
    ],
  },
  {
    id: "guitar",
    slug: "guitar",
    name: "Guitar",
    category: "Music",
    interest: "music",
    description:
      "Chords, fingerstyle, and songwriting basics for acoustic and electric guitar, taught through songs students actually love.",
    detail:
      "Guitar lessons start with the songs a student already listens to, then work backward into the technique those songs require. Chord vocabulary, strumming and picking patterns, and enough theory to improvise and write their own material.",
    ageGroup: "Ages 4+",
    minAge: 7,
    skillLevel: "Beginner to Advanced",
    duration: "60 min / session",
    icon: "Guitar",
    image: "/images/programs/guitar-jacob.jpg",
    imageWidth: 2048,
    imageHeight: 1365,
    sortOrder: 4,
    isActive: true,
    slots: [
      slot("guitar", 5, 1020, 1, 0),
      slot("guitar", 6, 780, 8, 6),
    ],
    tuition: [
      tuition("guitar", "Private", 3800, "per month", 1, "Eight 60-minute one-on-one sessions"),
      tuition("guitar", "Group", 2300, "per month", 2, "Up to eight students per class"),
    ],
  },
  {
    id: "ukulele",
    slug: "ukulele",
    name: "Ukulele",
    category: "Music",
    interest: "music",
    description:
      "A joyful, accessible starting point for young musicians — strumming patterns, simple chords, and sing-along favorites.",
    detail:
      "The ukulele is small, forgiving, and quick to reward effort, which makes it the ideal first instrument for our youngest students. Two or three chords produce a real song within the first few lessons, and that early win is what keeps a four-year-old coming back.",
    ageGroup: "Ages 4+",
    minAge: 4,
    skillLevel: "Beginner",
    duration: "60 min / session",
    icon: "Music3",
    image: "/images/programs/ukelele.jpg",
    imageWidth: 1365,
    imageHeight: 2048,
    sortOrder: 5,
    isActive: true,
    slots: [
      slot("ukulele", 3, 840, 8, 3),
      slot("ukulele", 6, 480, 8, 2),
    ],
    tuition: [
      tuition("ukulele", "Group", 2000, "per month", 1, "Eight 45-minute sessions"),
      tuition("ukulele", "Private", 3500, "per month", 2, "Eight 45-minute one-on-one sessions"),
    ],
  },
  {
    id: "music-theory",
    slug: "music-theory",
    name: "Music Theory",
    category: "Music",
    interest: "music",
    description:
      "The grammar behind the music — notation, harmony, and ear training that strengthens every instrument and voice student.",
    detail:
      "Theory is the fastest way to make practice more efficient. Students learn to read fluently, understand why chord progressions work, and identify intervals by ear. Most enroll alongside an instrument, and their progress there noticeably accelerates.",
    ageGroup: "Ages 8+",
    minAge: 8,
    skillLevel: "All Levels",
    duration: "60 min / session",
    icon: "BookOpenText",
    image: null,
    sortOrder: 6,
    isActive: true,
    slots: [slot("music-theory", 5, 840, 10, 4)],
    tuition: [
      tuition("music-theory", "Group", 1800, "per month", 1, "Four 60-minute sessions"),
    ],
  },
  {
    id: "ballet",
    slug: "ballet",
    name: "Ballet",
    category: "Dance & Movement",
    interest: "movement",
    description:
      "Classical technique, posture, and grace built through structured barre and center work in a nurturing studio setting.",
    detail:
      "Ballet builds the postural foundation every other dance style borrows from. Classes follow a traditional structure, barre then center, with attention to alignment and safe progression. Students work toward a recital piece each term.",
    ageGroup: "Ages 4+",
    minAge: 4,
    skillLevel: "Beginner to Advanced",
    duration: "60 min / session",
    icon: "Sparkles",
    image: "/images/programs/ballet.jpg",
    imageWidth: 960,
    imageHeight: 720,
    sortOrder: 7,
    isActive: true,
    slots: [
      slot("ballet", 3, 960, 12, 9),
      slot("ballet", 6, 540, 12, 10),
      slot("ballet", 6, 660, 12, 12),
    ],
    tuition: [
      tuition("ballet", "Group", 2400, "per month", 1, "Eight 60-minute classes"),
    ],
  },
  {
    id: "dance",
    slug: "dance",
    name: "Dance",
    category: "Dance & Movement",
    interest: "movement",
    description:
      "Contemporary, jazz, and production choreography that builds rhythm, coordination, and confident stage presence.",
    detail:
      "Our dance program is where students learn to perform, not just execute steps. Contemporary and jazz vocabulary, formation work, and full production numbers that appear in showcases and competitions.",
    ageGroup: "Ages 5+",
    minAge: 5,
    skillLevel: "All Levels",
    duration: "60 min / session",
    icon: "PersonStanding",
    image: "/images/programs/dance.jpg",
    imageWidth: 1848,
    imageHeight: 1224,
    sortOrder: 8,
    isActive: true,
    slots: [
      slot("dance", 5, 960, 14, 8),
      slot("dance", 6, 780, 14, 11),
    ],
    tuition: [
      tuition("dance", "Group", 2400, "per month", 1, "Eight 60-minute classes"),
    ],
  },
  {
    id: "pasarela",
    slug: "pasarela",
    name: "Pasarela",
    category: "Dance & Movement",
    interest: "movement",
    description:
      "Runway walk, posture, and poise training that builds elegance and self-assurance both on stage and off.",
    detail:
      "Pasarela trains carriage and composure: how to walk, turn, pause, and hold attention. Students frequently tell us the confidence transfers straight into school presentations and interviews.",
    ageGroup: "Ages 6+",
    minAge: 6,
    skillLevel: "Beginner to Advanced",
    duration: "60 min / session",
    icon: "Footprints",
    image: null,
    sortOrder: 9,
    isActive: true,
    slots: [slot("pasarela", 6, 900, 12, 5)],
    tuition: [
      tuition("pasarela", "Group", 2200, "per month", 1, "Four 60-minute classes"),
    ],
  },
  {
    id: "public-speaking",
    slug: "public-speaking",
    name: "Public Speaking",
    category: "Speech & Academics",
    interest: "speech",
    description:
      "Voice projection, storytelling, and confident delivery — skills that carry students far beyond the stage.",
    detail:
      "Students learn to structure a talk, project without shouting, handle nerves, and hold a room. We rehearse in front of small friendly audiences first, then build toward competitions and school events.",
    ageGroup: "Ages 7+",
    minAge: 7,
    skillLevel: "All Levels",
    duration: "60 min / session",
    icon: "Presentation",
    image: null,
    sortOrder: 10,
    isActive: true,
    slots: [slot("public-speaking", 6, 840, 10, 4)],
    tuition: [
      tuition("public-speaking", "Group", 2200, "per month", 1, "Four 60-minute sessions"),
    ],
  },
  {
    id: "academic-tutorials",
    slug: "academic-tutorials",
    name: "Academic Tutorials",
    category: "Speech & Academics",
    interest: "speech",
    description:
      "Focused, personalized tutorial support that complements school learning across core subjects.",
    detail:
      "Tutorials are shaped around what the student is actually struggling with at school this term. Small groups or one-on-one, with progress reported back to parents so nothing is a surprise.",
    ageGroup: "Ages 6+",
    minAge: 6,
    skillLevel: "All Levels",
    duration: "60 min / session",
    icon: "GraduationCap",
    image: null,
    sortOrder: 11,
    isActive: true,
    slots: [
      slot("academic-tutorials", 3, 900, 6, 2),
      slot("academic-tutorials", 5, 900, 6, 3),
    ],
    tuition: [
      tuition("academic-tutorials", "Private", 3600, "per month", 1, "Eight 60-minute sessions"),
      tuition("academic-tutorials", "Group", 2000, "per month", 2, "Up to six students"),
    ],
  },
];

export const programCategories = [
  "All",
  "Music",
  "Dance & Movement",
  "Speech & Academics",
] as const;

export function findProgram(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}
