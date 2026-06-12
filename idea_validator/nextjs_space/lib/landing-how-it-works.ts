export type HowItWorksStep = {
  step: number;
  title: string;
  description: [string, string];
  screenshotSlug: string;
  screenshotTitle: string;
  screenshotColor: string;
};

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: 1,
    title: "Describe Your Idea",
    description: [
      "Tell us your concept, target audience, and the problem you solve in a simple submission form.",
      "VentureVibe captures everything it needs to run a structured validation tailored to your idea category.",
    ],
    screenshotSlug: "micro-surveys",
    screenshotTitle: "Idea submission",
    screenshotColor: "blue",
  },
  {
    step: 2,
    title: "Run Your Validation",
    description: [
      "Launch AI-powered analyses across market sizing, competitors, SWOT, and more with one click.",
      "Each tool uses consistent methodology so you get comparable, actionable outputs every time.",
    ],
    screenshotSlug: "validation-score",
    screenshotTitle: "Validation analyses",
    screenshotColor: "rose",
  },
  {
    step: 3,
    title: "Review Your Full Report",
    description: [
      "See your 0–100 validation score, dimensional breakdowns, and deep-dive sections in one saved dashboard.",
      "Revisit, refresh, or export your full PDF report whenever you need it.",
    ],
    screenshotSlug: "pdf-report",
    screenshotTitle: "Full validation report",
    screenshotColor: "blue",
  },
  {
    step: 4,
    title: "Walk Into Meetings Prepared",
    description: [
      "Generate financial projections, pitch decks, and funding readiness scores from the same idea data.",
      "Walk into investor and partner conversations with materials that match your validation story.",
    ],
    screenshotSlug: "pitch-deck",
    screenshotTitle: "Investor-ready materials",
    screenshotColor: "indigo",
  },
];
