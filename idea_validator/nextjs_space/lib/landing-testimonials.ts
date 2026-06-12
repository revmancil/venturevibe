export type LandingTestimonial = {
  id: string;
  quote: string;
  name: string;
  ideaName: string;
  flag: string;
};

/** Placeholder testimonials — replace with real customer quotes when available. */
export const LANDING_TESTIMONIALS: LandingTestimonial[] = [
  {
    id: "time-saved",
    quote:
      "I had a first investor call in 10 days instead of 3 weeks. The validation score gave me a clear story for why the market was real.",
    name: "Maya Chen",
    ideaName: "ShelfStack",
    flag: "🇺🇸",
  },
  {
    id: "research",
    quote:
      "We were about to pay a consultancy $4K for market sizing. VentureVibe gave us a tighter read overnight — and we killed a bad idea before spending on ads.",
    name: "James Okonkwo",
    ideaName: "FleetRoute",
    flag: "🇺🇸",
  },
  {
    id: "pitch-deck",
    quote:
      "The pitch deck export wasn't generic fluff — it pulled from our actual competitor and financial sections. My co-founder said it was the first deck that felt investor-ready.",
    name: "Sophie Tremblay",
    ideaName: "CampusBite",
    flag: "🇨🇦",
  },
];
