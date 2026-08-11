/** Single source of truth for school identity, contact channels, and site URL. */

export const site = {
  name: "St. Claire School of Music and Performing Arts",
  shortName: "St. Claire",
  tagline: "Music & Performing Arts",
  description:
    "Piano, voice, violin, guitar, ballet, dance and public speaking lessons for children, teens and adults in Minglanilla, Cebu.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.stclairemusicarts.ph",
  locale: "en_PH",
  address: {
    locality: "Minglanilla",
    region: "Cebu",
    country: "PH",
    full: "Ward 1 Poblacion, Minglanilla, Cebu, Philippines",
  },
  phone: "+63 905 341 6378",
  phoneHref: "+63 905 341 6378",
  email: "saintclairemusic@yahoo.com",
  messengerHandle: process.env.NEXT_PUBLIC_MESSENGER_HANDLE ?? "StClaireSchoolOfPerformingArtsAndCentreOfLearning",
  facebookUrl:
    "https://www.facebook.com/StClaireSchoolOfPerformingArtsAndCentreOfLearning",
  /** Stated in the UI so parents know when to expect a reply. */
  responseWindow: "within one business day",
  hours: [
    { day: "Wednesday", time: "8:00 AM – 5:00 PM" },
    { day: "Friday", time: "8:00 AM – 5:00 PM" },
    { day: "Saturday", time: "8:00 AM – 5:00 PM" },
  ],
} as const;
