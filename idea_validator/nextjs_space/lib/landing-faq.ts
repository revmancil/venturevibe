export type LandingFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const LANDING_FAQ_ITEMS: LandingFaqItem[] = [
  {
    id: "ai-data-accuracy",
    question: "Is the AI data accurate or just made up?",
    answer:
      "VentureVibe pulls live market signals from real-time sources including Google Trends, Crunchbase funding data, and web search. AI analysis layers on top of that data — we show you the sources so you can verify the inputs yourself.",
  },
  {
    id: "vs-chatgpt",
    question: "How is this different from just asking ChatGPT?",
    answer:
      "ChatGPT gives you a generic answer with no structure, no real-time data, and no shareable output. VentureVibe runs 22 structured checks, ties outputs to live market data, and produces a PDF report you can hand to an investor or co-founder.",
  },
  {
    id: "idea-types",
    question: "Can I validate any type of business idea?",
    answer:
      "Yes — SaaS, physical product, service business, marketplace, or app. The validation framework adapts to your idea type automatically.",
  },
  {
    id: "idea-privacy",
    question: "What happens to my idea data?",
    answer:
      "Your ideas are private by default. We do not use your idea data to train AI models or share it with third parties. Full details in our Privacy Policy.",
  },
  {
    id: "free-tier",
    question: "Do I need a credit card to start?",
    answer: "No. The free plan requires only an email address.",
  },
];

export function getLandingFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: LANDING_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
