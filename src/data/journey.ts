import type { HistoryMilestone, StatItem, TimelineStep } from "@/types";

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
    id: "dream-takes-root",
    year: "2011",
    title: "A Dream Takes Root",
    description:
      "St. Claire begins with a simple dream: to create a place where talents are nurtured, hearts are inspired, and every learner grows in skill, character, and faith.",
  },
  {
    id: "guided-to-a-name",
    year: "2011",
    title: "Guided to a Name",
    description:
      "Originally registered as Rhyscabz Music School, the school’s name was changed after the family prayed for guidance. On Saint Clare’s Feast Day, her name came to them unexpectedly—a moment they received as a beautiful sign of divine providence.",
  },
  {
    id: "doors-open",
    year: "2011",
    title: "Our Doors Open",
    description:
      "St. Claire School of Music and Performing Arts officially opens at Gee Ann Je Arcade in Calajoan, Minglanilla, Cebu, beginning its mission of nurturing young talents through music and the performing arts.",
  },
  {
    id: "new-home",
    year: "2016",
    title: "A New Home",
    description:
      "As the school community grows, St. Claire moves to its present home on the second floor of Rose Pharmacy in Ward 1, Poblacion, Minglanilla—across from the town plaza and along the main road.",
  },
  {
    id: "today",
    year: "Today",
    title: "Learn. Create. Shine.",
    description:
      "Now St. Claire School of Performing Arts and Centre of Learning, we continue to nurture talent, character, and faith—guided by the same spirit of trust and gratitude that began our journey.",
  },
];
