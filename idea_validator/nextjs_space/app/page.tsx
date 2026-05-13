import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle, Zap, BarChart3, Lightbulb, Target, Shield, DollarSign, Rocket,
  Layers, Users, LayoutGrid, AlertTriangle, Sparkles, Mic, Presentation,
  MessageCircle, FileText, Radio, GitCompareArrows, ArrowRight, TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Feel the Pulse of Your Next Big Idea",
  description:
    "VentureVibe helps entrepreneurs validate startup ideas in 48 hours using 16 AI-powered tools: market sizing, competitor analysis, SWOT, pricing, MVP, pitch deck, and revenue simulator. Start free.",
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
        text: "VentureVibe uses 16 AI-powered tools — including micro-surveys, competitor analysis, market sizing (TAM/SAM/SOM), SWOT, pricing strategy, MVP planning, customer personas, and pitch deck generation — to deliver a comprehensive validation report in 48 hours.",
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

const coreFeatures = [
  { icon: CheckCircle, color: "blue", title: "Micro-Surveys", desc: "AI-generated survey questions tailored to validate your idea" },
  { icon: BarChart3, color: "purple", title: "Competitor Analysis", desc: "Automatic research of key competitors and market positioning" },
  { icon: Zap, color: "emerald", title: "Market Sizing", desc: "Estimated TAM, SAM, SOM and growth projections" },
];

const deepFeatures = [
  { icon: Target, color: "rose", title: "Validation Score", desc: "0-100 score with detailed breakdown across 5 dimensions" },
  { icon: Shield, color: "indigo", title: "SWOT Analysis", desc: "Strengths, weaknesses, opportunities, and threats" },
  { icon: DollarSign, color: "emerald", title: "Pricing Strategy", desc: "Recommended pricing models, tiers, and revenue projections" },
  { icon: Rocket, color: "orange", title: "Go-To-Market Plan", desc: "Channels, phases, and tactics to launch effectively" },
  { icon: Layers, color: "blue", title: "MVP Features", desc: "Prioritized feature list to ship your minimum viable product" },
  { icon: Users, color: "purple", title: "Customer Personas", desc: "Detailed profiles of your ideal customers" },
  { icon: LayoutGrid, color: "cyan", title: "Business Model Canvas", desc: "Complete 9-block business model breakdown" },
  { icon: AlertTriangle, color: "amber", title: "Risk Assessment", desc: "Identify and mitigate key risks before they bite" },
];

const proFeatures = [
  { icon: Sparkles, color: "pink", title: "Idea Refinement", desc: "AI suggestions to sharpen and improve your idea" },
  { icon: Mic, color: "violet", title: "Elevator Pitches", desc: "Multiple pitch versions for different audiences" },
  { icon: Presentation, color: "indigo", title: "Pitch Deck", desc: "10-slide investor pitch deck with PDF export" },
  { icon: MessageCircle, color: "emerald", title: "AI Idea Coach", desc: "Chat with an AI mentor that knows your idea inside-out" },
  { icon: FileText, color: "blue", title: "Full PDF Report", desc: "Download a comprehensive PDF of all your validation data" },
  { icon: DollarSign, color: "emerald", title: "Revenue Simulator", desc: "Interactive 24-month projections with Conservative/Base/Aggressive presets" },
  { icon: Radio, color: "rose", title: "Live Market Signals", desc: "Real-time trends, search interest, funding activity with history timeline" },
  { icon: GitCompareArrows, color: "cyan", title: "Scenario Compare", desc: "Save & compare up to 3 financial scenarios side-by-side" },
];

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
  amber: { bg: "bg-amber-100", text: "text-amber-600" },
  rose: { bg: "bg-rose-100", text: "text-rose-600" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600" },
  orange: { bg: "bg-orange-100", text: "text-orange-600" },
  cyan: { bg: "bg-cyan-100", text: "text-cyan-600" },
  pink: { bg: "bg-pink-100", text: "text-pink-600" },
  violet: { bg: "bg-violet-100", text: "text-violet-600" },
};

function FeatureCard({ icon: Icon, color, title, desc }: any) {
  const c = colorMap[color] || colorMap.blue;
  return (
    <Card className="p-6 border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className={`p-3 w-fit ${c.bg} rounded-lg mb-4`}>
        <Icon className={`w-6 h-6 ${c.text}`} />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
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
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">VentureVibe</span>
            </div>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold mb-8">
              <Zap className="w-4 h-4" />
              16 AI-powered tools · Results in minutes
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-8 leading-[1.1]">
              Feel the pulse of your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-500">
                next big idea
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Every venture starts with a vibe. VentureVibe turns that spark into hard data — market sizing, competitor intel, SWOT, pricing models, and an investor-ready pitch deck, all powered by AI.
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

          {/* Social proof strip */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["bg-violet-400", "bg-emerald-400", "bg-blue-400", "bg-pink-400"].map((bg, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-white`} />
                ))}
              </div>
              <span className="font-medium">500+ founders trust VentureVibe</span>
            </div>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
              <span className="font-medium ml-1">4.8/5 average rating</span>
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
            <p className="text-muted-foreground max-w-2xl mx-auto">Eight comprehensive analyses that reveal the full picture of your opportunity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deepFeatures.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </section>

        {/* Pitch & Refine */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">Pitch &amp; Refine</div>
            <h2 className="font-display text-4xl font-bold mb-3">From idea to investor-ready</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Tools to polish your idea, talk about it confidently, and pitch it like a pro.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proFeatures.map((f) => <FeatureCard key={f.title} {...f} />)}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                <span className="font-semibold">VentureVibe</span>
              </div>
              <p className="text-sm text-muted-foreground">© 2026 VentureVibe. Feel the pulse of your next big idea.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
