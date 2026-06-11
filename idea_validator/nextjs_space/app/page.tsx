import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LandingScreenshot } from "@/components/features/landing-screenshot";
import { Zap, ArrowRight } from "lucide-react";
import { VentureVibeLogo } from "@/components/brand/venturevibe-logo";
import { AI_TOOL_COUNT, AI_TOOL_COUNT_LABEL, AI_TOOLS_SUMMARY } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Feel the Pulse of Your Next Big Idea",
  description:
    `VentureVibe helps entrepreneurs validate startup ideas in 48 hours using ${AI_TOOL_COUNT} AI-powered tools: ${AI_TOOLS_SUMMARY}. Start free.`,
  alternates: { canonical: "/" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does VentureVibe validate business ideas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `VentureVibe uses ${AI_TOOL_COUNT} AI-powered tools — including ${AI_TOOLS_SUMMARY} — to deliver a comprehensive validation report in 48 hours.`,
      },
    },
    {
      "@type": "Question",
      name: "Is there a free plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The Free plan includes 2 idea validations per month with core features. Pro ($29/mo) unlocks 15 validations and advanced tools. Business ($79/mo) offers unlimited validations.",
      },
    },
    {
      "@type": "Question",
      name: "How long does a validation take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most validation reports are generated within minutes, with comprehensive AI analysis ready for review in under 48 hours.",
      },
    },
    {
      "@type": "Question",
      name: "Can I export my validation report?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can export a full PDF report with all analyses and a separate investor-ready pitch deck PDF.",
      },
    },
  ],
};

/** Slug = filename under public/landing/screenshots/ (e.g. micro-surveys.png). Omit file until you add it — placeholder shows. */
const coreFeatures = [
  { slug: "micro-surveys", color: "blue", title: "Micro-Surveys", desc: "AI-generated survey questions tailored to validate your idea" },
  { slug: "competitor-analysis", color: "purple", title: "Competitor Analysis", desc: "Automatic research of key competitors and market positioning" },
  { slug: "market-sizing", color: "emerald", title: "Market Sizing", desc: "Estimated TAM, SAM, SOM and growth projections" },
];

const deepFeatures = [
  { slug: "validation-score", color: "rose", title: "Validation Score", desc: "0-100 score with detailed breakdown across 5 dimensions" },
  { slug: "swot-analysis", color: "indigo", title: "SWOT Analysis", desc: "Strengths, weaknesses, opportunities, and threats" },
  { slug: "pricing-strategy", color: "emerald", title: "Pricing Strategy", desc: "Recommended pricing models, tiers, and revenue projections" },
  { slug: "gtm-plan", color: "orange", title: "Go-To-Market Plan", desc: "Channels, phases, and tactics to launch effectively" },
  { slug: "mvp-features", color: "blue", title: "MVP Features", desc: "Prioritized feature list to ship your minimum viable product" },
  { slug: "customer-personas", color: "purple", title: "Customer Personas", desc: "Detailed profiles of your ideal customers" },
  { slug: "business-canvas", color: "cyan", title: "Business Model Canvas", desc: "Complete 9-block business model breakdown" },
  { slug: "risk-assessment", color: "amber", title: "Risk Assessment", desc: "Identify and mitigate key risks before they bite" },
];

const investorPrepFeatures = [
  { slug: "financial-projections", color: "indigo", title: "Financial Projections", desc: "3–5 year revenue, burn rate, runway & break-even with editable assumptions" },
  { slug: "name-checker", color: "violet", title: "Name & Domain Checker", desc: "Brandable startup names with live domain availability screening" },
  { slug: "funding-readiness", color: "amber", title: "Funding Readiness Score", desc: "Investor-ready assessment across traction, market, team & defensibility" },
  { slug: "positioning-map", color: "cyan", title: "Competitive Positioning Map", desc: "Visual 2×2 map placing your startup vs competitors on key dimensions" },
];

const pitchFeatures = [
  { slug: "idea-refinement", color: "pink", title: "Idea Refinement", desc: "AI suggestions to sharpen and improve your idea" },
  { slug: "elevator-pitches", color: "violet", title: "Elevator Pitches", desc: "Multiple pitch versions for different audiences" },
  { slug: "pitch-deck", color: "indigo", title: "Pitch Deck", desc: "10-slide investor pitch deck with PDF export" },
  { slug: "idea-coach", color: "emerald", title: "AI Idea Coach", desc: "Chat with an AI mentor that knows your idea inside-out" },
  { slug: "pdf-report", color: "blue", title: "Full PDF Report", desc: "Download a comprehensive PDF of all your validation data" },
  { slug: "revenue-simulator", color: "emerald", title: "Revenue Simulator", desc: "24-month projections with sliders, preset scenario compare, and save up to 3 custom scenarios" },
  { slug: "market-signals", color: "rose", title: "Live Market Signals", desc: "Real-time trends, search interest, funding activity with history timeline" },
];

function FeatureCard({ slug, color, title, desc }: { slug: string; color: string; title: string; desc: string }) {
  return (
    <Card className="overflow-hidden border border-border/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <LandingScreenshot slug={slug} title={title} color={color} />
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </Card>
  );
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border/40 bg-white/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <VentureVibeLogo size="md" priority />
            <div className="flex gap-3">
              <Link href="/pricing"><Button variant="ghost">Pricing</Button></Link>
              <Link href="/auth/login"><Button variant="outline">Sign in</Button></Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-600 hover:to-emerald-600">Get started</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <VentureVibeLogo size="hero" href={null} priority className="drop-shadow-md" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold mb-8">
              <Zap className="w-4 h-4" />
              {AI_TOOL_COUNT_LABEL} · Results in minutes
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-8 leading-[1.2] sm:leading-[1.18] lg:leading-[1.15]">
              Know if your idea is worth building —
              <span className="block pb-1.5 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-500">
                in 48 hours.
              </span>
            </h1>
            <p className="mt-3 text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              VentureVibe runs {AI_TOOL_COUNT} AI-powered validation checks — market sizing, competitor intel, financial projections, and an investor-ready pitch deck — so you don&apos;t waste months on the wrong idea.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="text-base px-8 py-6 bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-600 hover:to-emerald-600 shadow-lg shadow-violet-500/25">
                  Start validating — it&apos;s free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-base px-8 py-6">View pricing</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Core Validation */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">Core Validation</div>
            <h2 className="font-display text-4xl font-bold mb-3">Start with the essentials</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The fundamentals every founder needs before going further.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreFeatures.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </section>

        {/* Deep Analysis */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4">Deep Analysis</div>
            <h2 className="font-display text-4xl font-bold mb-3">Go deeper than the surface</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Eight deep-dive analyses that reveal the full picture of your opportunity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deepFeatures.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </section>

        {/* Investor Prep */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">Investor Prep</div>
            <h2 className="font-display text-4xl font-bold mb-3">Walk into meetings prepared</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Four tools founders reach for before investor conversations — financials, naming, readiness, and competitive position.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investorPrepFeatures.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </section>

        {/* Pitch & Refine */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">Pitch &amp; Refine</div>
            <h2 className="font-display text-4xl font-bold mb-3">From idea to investor-ready</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Tools to polish your idea, talk about it confidently, and pitch it like a pro.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pitchFeatures.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 my-12 bg-gradient-to-br from-violet-50 to-emerald-50 rounded-2xl text-center">
          <h2 className="font-display text-4xl font-bold mb-6">Ready to feel the vibe?</h2>
          <p className="text-lg text-muted-foreground mb-8">Start free with 2 validations per month, or upgrade for unlimited power.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-600 hover:to-emerald-600">Start free</Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">View pricing</Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <VentureVibeLogo size="md" href={null} />
              <p className="text-center text-sm text-muted-foreground sm:text-right">
                © 2026 VentureVibe. Feel the pulse of your next big idea.{" "}
                <Link href="/terms" className="hover:underline">
                  Terms
                </Link>
                {" · "}
                <Link href="/privacy" className="hover:underline">
                  Privacy
                </Link>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
