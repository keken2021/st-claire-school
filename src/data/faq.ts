import type { FaqItem } from "@/types";

/**
 * FAQ copy is stable editorial content rather than operational data, so it lives
 * in the codebase and is rendered into FAQPage structured data.
 */
export const faqs: FaqItem[] = [
  {
    id: "f1",
    category: "Enrollment",
    question: "How do I enroll my child at St. Claire?",
    answer:
      "Message us on Messenger, call, or visit the school to schedule a session. Our team will help you choose the right program and walk you through enrollment on the spot.",
  },
  {
    id: "f2",
    category: "Enrollment",
    question: "Is there an entrance audition required?",
    answer:
      "No audition is needed to enroll. We welcome complete beginners as warmly as students with prior experience — every journey starts somewhere.",
  },
  {
    id: "f3",
    category: "Schedules",
    question: "What days and times are lessons available?",
    answer:
      "Classes run on Wednesdays, Fridays, and Saturdays between 8:00 AM and 5:00 PM. Each program page lists its current class times and whether a slot is available — message us to reserve a place.",
  },
  {
    id: "f4",
    category: "Schedules",
    question: "What happens if we need to reschedule a lesson?",
    answer:
      "We understand life happens. Lessons can be rescheduled with at least 24 hours' notice, subject to instructor availability that week. Message us and we'll sort it out.",
  },
  {
    id: "f5",
    category: "Lesson Duration",
    question: "How long is each lesson?",
    answer:
      "All lessons and programs run for 60 minutes per session.",
  },
  {
    id: "f6",
    category: "Age Requirements",
    question: "What is the minimum age to start lessons?",
    answer:
      "There’s no strict age requirement. We welcome students of different ages and skill levels, and tailor lessons to each child’s age, ability, and learning pace",
  },
  {
    id: "f7",
    category: "Age Requirements",
    question: "Do you offer classes for teens and adults?",
    answer:
      "Yes. While many of our students are children, teens and adults are very welcome across all of our music, dance, and speech programs.",
  },
  {
    id: "f8",
    category: "Payments",
    question: "How does tuition and payment work?",
    answer:
      "Tuition is billed monthly per program, with separate private and group rates. Each program page lists its current rates, and our staff can confirm the full breakdown during enrollment.",
  },
  {
    id: "f9",
    category: "Payments",
    question: "What payment methods do you accept?",
    answer:
      "We accept cash, bank transfer, and popular e-wallets for your convenience. Receipts are issued for every payment.",
  },
  {
    id: "f10",
    category: "Recitals",
    question: "How often do students get to perform?",
    answer:
      "We hold recitals and showcases multiple times a year, giving every student regular, low-pressure opportunities to build real stage experience.",
  },
  {
    id: "f11",
    category: "Recitals",
    question: "Is recital participation required?",
    answer:
      "Participation is encouraged but never forced. We work closely with students who feel nervous, so stepping on stage always feels like their own choice.",
  },
  {
    id: "f12",
    category: "Private Lessons",
    question: "What's the difference between private and group lessons?",
    answer:
      "Private lessons offer one-on-one, fully personalized instruction, while group lessons build camaraderie and are a great fit for younger or more social learners.",
  },
  {
    id: "f13",
    category: "Private Lessons",
    question: "Can we switch from group to private lessons later?",
    answer:
      "Absolutely. Many families start in group settings and transition to private lessons as a student's interest and commitment grow.",
  },
];

export const faqCategories = [
  "All",
  "Enrollment",
  "Schedules",
  "Lesson Duration",
  "Age Requirements",
  "Payments",
  "Recitals",
  "Private Lessons",
] as const;
