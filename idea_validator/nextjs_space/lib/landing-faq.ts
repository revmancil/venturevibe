import { AI_TOOL_COUNT } from "./marketing";

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
      "VentureVibe pulls from real market data sources and uses structured prompts designed to ground outputs in verifiable categories. All projections are estimates — treat them as directional, not definitive.",
  },
  {
    id: "vs-chatgpt",
    question: "How is this different from just asking ChatGPT?",
    answer: `ChatGPT gives you a conversation. VentureVibe gives you a structured validation report across ${AI_TOOL_COUNT} dimensions with consistent methodology every time.`,
  },
  {
    id: "idea-types",
    question: "Can I validate any type of business idea?",
    answer:
      "Yes — product, service, SaaS, marketplace, or physical goods. The tools adapt to your idea category.",
  },
  {
    id: "idea-privacy",
    question: "What happens to my idea data?",
    answer: "Your ideas are private to your account and never used to train AI models.",
  },
  {
    id: "free-tier",
    question: "Do I need a credit card to start?",
    answer: "No. The free tier requires only an email address.",
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
