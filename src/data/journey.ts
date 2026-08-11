import type { StatItem, TimelineStep, HistoryMilestone } from "@/types";

export const stats: StatItem[] = [
  { id: "years", value: 10, suffix: "+", label: "Years of Excellence" },
  { id: "students", value: 500, suffix: "+", label: "Students Trained" },
  { id: "recitals", value: 10, suffix: "+", label: "Recitals Held" },
  { id: "satisfaction", value: 95, suffix: "%", label: "Parent Satisfaction" },
];

export const studentJourney: TimelineStep[] = [
  
  {
    id: "learn",
    label: "Learn",
    description: "Structured lessons build fundamentals with a teacher who believes in them.",
    icon: "BookOpen",
  },
  {
    id: "practice",
    label: "Practice",
    description: "Guided practice routines turn steady effort into real progress.",
    icon: "Repeat",
  },
  {
    id: "perform",
    label: "Perform",
    description: "Recitals and showcases give every student a moment in the spotlight.",
    icon: "Mic2",
  },
  {
    id: "grow",
    label: "Grow",
    description: "Confidence, discipline, and creativity carry over into everyday life.",
    icon: "TrendingUp",
  },
  {
    id: "shine",
    label: "Shine",
    description: "Talent, fully realized — ready for the next stage, on and off the platform.",
    icon: "Star",
  },
];

export const history: HistoryMilestone[] = [
  {
    year: "2014",
    title: "A Small Studio, A Big Dream",
    description:
      "St. Claire opens its doors in Minglanilla with a handful of piano and voice students and one simple belief: every child has a talent worth discovering.",
  },
  {
    year: "2017",
    title: "Expanding the Stage",
    description:
      "Violin, guitar, and ballet join the roster as enrollment grows, along with the school's first full-scale student recital.",
  },
  {
    year: "2019",
    title: "A Home for the Performing Arts",
    description:
      "The school moves into a larger facility with dedicated studios for music, dance, and drama, built for focused, joyful learning.",
  },
  {
    year: "2022",
    title: "Milestones on Stage",
    description:
      "St. Claire students begin competing and performing at regional showcases, bringing home recognition and renewed pride.",
  },
  {
    year: "Today",
    title: "500+ Students Strong",
    description:
      "A thriving community of students, families, and teachers, still guided by the same mission that opened our doors.",
  },
];
