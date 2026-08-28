export type ProgramCategory = "Music" | "Dance & Movement" | "Speech & Academics";

/** Coarse interest bucket used by the recommendation engine. */
export type Interest = "music" | "movement" | "speech";

export interface ClassSlot {
  id: string;
  programId: string;
  dayOfWeek: number;
  startMinutes: number;
  durationMin: number;
  capacity: number;
  enrolledCount: number;
  isActive: boolean;
}

export interface TuitionTier {
  id: string;
  programId: string;
  name: string;
  amount: number;
  cadence: string;
  note?: string | null;
  sortOrder: number;
}

export interface Program {
  id: string;
  slug: string;
  name: string;
  category: ProgramCategory;
  description: string;
  detail?: string | null;
  ageGroup: string;
  minAge: number;
  skillLevel: string;
  duration: string;
  icon: string;
  interest: Interest;
  image?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
  sortOrder: number;
  isActive: boolean;
  slots?: ClassSlot[];
  tuition?: TuitionTier[];
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface TimelineStep {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export type HistoryMilestone = {
  id: string;
  year: string;
  title: string;
  description: string;
};

export type GalleryCategory =
  | "Classes"
  | "Recitals"
  | "Student Performances"
  | "Competitions"
  | "Facilities"
  | "Events"
  | "Graduation"
  | "Behind the Scenes";

export interface GalleryImage {
  id: string;
  src: string;
  category: GalleryCategory;
  caption: string;
  width: number;
  height: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: "Parent" | "Student";
  program: string;
  quote: string;
  rating: number;
  avatarSeed: string;
}

export type FaqCategory =
  | "Enrollment"
  | "Schedules"
  | "Lesson Duration"
  | "Age Requirements"
  | "Payments"
  | "Recitals"
  | "Private Lessons";

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}
