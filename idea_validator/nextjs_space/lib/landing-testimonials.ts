export type LandingTestimonial = {
  id: string;
  quote: string;
  name: string;
  ideaName: string;
  flag: string;
};

export const LANDING_TESTIMONIALS: LandingTestimonial[] = [
  {
    id: "time-saved",
    quote: "[Quote about time saved or investor outcome]",
    name: "Name",
    ideaName: "Idea Name",
    flag: "🇺🇸",
  },
  {
    id: "research",
    quote: "[Quote about replacing expensive research]",
    name: "Name",
    ideaName: "Idea Name",
    flag: "🇬🇧",
  },
  {
    id: "pitch-deck",
    quote: "[Quote about pitch deck outcome]",
    name: "Name",
    ideaName: "Idea Name",
    flag: "🇨🇦",
  },
];
