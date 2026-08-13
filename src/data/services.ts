import type { ServiceItem } from "@/types";

export const services: ServiceItem[] = [
  {
    id: "private-lessons",
    name: "Private Lessons",
    description: "One-on-one instruction paced entirely around your child's growth.",
    icon: "UserRound",
  },
  {
    id: "group-lessons",
    name: "Group Lessons",
    description: "Small, sociable classes that build teamwork and friendly motivation.",
    icon: "Users",
  },
  {
    id: "performance-coaching",
    name: "Performance Coaching",
    description: "Stage presence, expression, and composure built through guided rehearsal.",
    icon: "Theater",
  },
  {
    id: "talent-development",
    name: "Talent Development",
    description: "Individualized plans that nurture each student's unique strengths.",
    icon: "Sprout",
  },
  {
    id: "summer-workshops",
    name: "Summer Workshops",
    description: "Immersive, seasonal intensives for accelerated learning and fun.",
    icon: "Sun",
  },
  {
    id: "recital-prep",
    name: "Recital Preparation",
    description: "Focused coaching that readies students to shine on the big day.",
    icon: "Star",
  },
  {
    id: "exam-prep",
    name: "Exam Preparation",
    description: "Structured guidance for graded music and arts examinations.",
    icon: "ClipboardCheck",
  },
];
