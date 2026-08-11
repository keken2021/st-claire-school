import type { FaqItem, Program } from "@/types";
import { site } from "./site";
import { DAY_NAMES, formatMinutes } from "./schedule";

/** schema.org MusicSchool describing the business itself. */
export function musicSchoolSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MusicSchool",
    name: site.name,
    description: site.description,
    url: site.url,
    image: `${site.url}/logo.png`,
    telephone: site.phone,
    email: site.email,
    sameAs: [site.facebookUrl],
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: site.hours.map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${entry.day}`,
      opens: "08:00",
      closes: "17:00",
    })),
  };
}

/** schema.org Course for one program, including its recurring class times. */
export function courseSchema(program: Program) {
  const slots = (program.slots ?? []).filter((slot) => slot.isActive);
  const tuition = (program.tuition ?? [])[0];

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.name,
    description: program.description,
    url: `${site.url}/programs/${program.slug}`,
    provider: {
      "@type": "MusicSchool",
      name: site.name,
      url: site.url,
    },
    typicalAgeRange: `${program.minAge}-`,
    educationalLevel: program.skillLevel,
    ...(slots.length > 0 && {
      hasCourseInstance: slots.map((slot) => ({
        "@type": "CourseInstance",
        courseMode: "onsite",
        courseSchedule: {
          "@type": "Schedule",
          repeatFrequency: "P1W",
          byDay: `https://schema.org/${DAY_NAMES[slot.dayOfWeek]}`,
          startTime: to24Hour(slot.startMinutes),
          duration: `PT${slot.durationMin}M`,
        },
        location: {
          "@type": "Place",
          name: site.name,
          address: {
            "@type": "PostalAddress",
            addressLocality: site.address.locality,
            addressRegion: site.address.region,
            addressCountry: site.address.country,
          },
        },
      })),
    }),
    ...(tuition && {
      offers: {
        "@type": "Offer",
        price: tuition.amount,
        priceCurrency: "PHP",
        category: tuition.name,
      },
    }),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: `${site.url}${entry.path}`,
    })),
  };
}

function to24Hour(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export { formatMinutes };
