export type LandingFeature = {
  slug: string;
  color: string;
  title: string;
  desc: string;
};

export type LandingFeatureSection = {
  id: string;
  badge: string;
  badgeClassName: string;
  title: string;
  subtitle: string;
  gridClassName: string;
  features: LandingFeature[];
};

export const coreFeatures: LandingFeature[] = [
  { slug: "micro-surveys", color: "blue", title: "Micro-Surveys", desc: "AI-generated survey questions tailored to validate your idea" },
  { slug: "competitor-analysis", color: "purple", title: "Competitor Analysis", desc: "Automatic research of key competitors and market positioning" },
  { slug: "market-sizing", color: "emerald", title: "Market Sizing", desc: "Estimated TAM, SAM, SOM and growth projections" },
];

export const deepFeatures: LandingFeature[] = [
  { slug: "validation-score", color: "rose", title: "Validation Score", desc: "0-100 score with detailed breakdown across 5 dimensions" },
  { slug: "swot-analysis", color: "indigo", title: "SWOT Analysis", desc: "Strengths, weaknesses, opportunities, and threats" },
  { slug: "pricing-strategy", color: "emerald", title: "Pricing Strategy", desc: "Recommended pricing models, tiers, and revenue projections" },
  { slug: "gtm-plan", color: "orange", title: "Go-To-Market Plan", desc: "Channels, phases, and tactics to launch effectively" },
  { slug: "mvp-features", color: "blue", title: "MVP Features", desc: "Prioritized feature list to ship your minimum viable product" },
  { slug: "customer-personas", color: "purple", title: "Customer Personas", desc: "Detailed profiles of your ideal customers" },
  { slug: "business-canvas", color: "cyan", title: "Business Model Canvas", desc: "Complete 9-block business model breakdown" },
  { slug: "risk-assessment", color: "amber", title: "Risk Assessment", desc: "Identify and mitigate key risks before they bite" },
];

export const investorPrepFeatures: LandingFeature[] = [
  { slug: "financial-projections", color: "indigo", title: "Financial Projections", desc: "3–5 year revenue, burn rate, runway & break-even with editable assumptions" },
  { slug: "name-checker", color: "violet", title: "Name & Domain Checker", desc: "Brandable startup names with live domain availability screening" },
  { slug: "funding-readiness", color: "amber", title: "Funding Readiness Score", desc: "Investor-ready assessment across traction, market, team & defensibility" },
  { slug: "positioning-map", color: "cyan", title: "Competitive Positioning Map", desc: "Visual 2×2 map placing your startup vs competitors on key dimensions" },
];

export const pitchFeatures: LandingFeature[] = [
  { slug: "idea-refinement", color: "pink", title: "Idea Refinement", desc: "AI suggestions to sharpen and improve your idea" },
  { slug: "elevator-pitches", color: "violet", title: "Elevator Pitches", desc: "Multiple pitch versions for different audiences" },
  { slug: "pitch-deck", color: "indigo", title: "Pitch Deck", desc: "10-slide investor pitch deck with PDF export" },
  { slug: "idea-coach", color: "emerald", title: "AI Idea Coach", desc: "Chat with an AI mentor that knows your idea inside-out" },
  { slug: "pdf-report", color: "blue", title: "Full PDF Report", desc: "Download a comprehensive PDF of all your validation data" },
  { slug: "revenue-simulator", color: "emerald", title: "Revenue Simulator", desc: "24-month projections with sliders, preset scenario compare, and save up to 3 custom scenarios" },
  { slug: "market-signals", color: "rose", title: "Live Market Signals", desc: "Real-time trends, search interest, funding activity with history timeline" },
];

export const LANDING_FEATURE_SECTIONS: LandingFeatureSection[] = [
  {
    id: "core",
    badge: "Core Validation",
    badgeClassName: "bg-blue-100 text-blue-700",
    title: "Start with the essentials",
    subtitle: "The fundamentals every founder needs before going further.",
    gridClassName: "grid grid-cols-1 md:grid-cols-3 gap-6",
    features: coreFeatures,
  },
  {
    id: "deep",
    badge: "Deep Analysis",
    badgeClassName: "bg-purple-100 text-purple-700",
    title: "Go deeper than the surface",
    subtitle: "Eight deep-dive analyses that reveal the full picture of your opportunity.",
    gridClassName: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
    features: deepFeatures,
  },
  {
    id: "investor",
    badge: "Investor Prep",
    badgeClassName: "bg-amber-100 text-amber-800",
    title: "Walk into meetings prepared",
    subtitle: "Four tools founders reach for before investor conversations — financials, naming, readiness, and competitive position.",
    gridClassName: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
    features: investorPrepFeatures,
  },
  {
    id: "pitch",
    badge: "Pitch & Refine",
    badgeClassName: "bg-emerald-100 text-emerald-700",
    title: "From idea to investor-ready",
    subtitle: "Tools to polish your idea, talk about it confidently, and pitch it like a pro.",
    gridClassName: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
    features: pitchFeatures,
  },
];
