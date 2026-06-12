import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { VentureVibeLogo } from "@/components/brand/venturevibe-logo";
import { LandingFaq } from "@/components/marketing/landing-faq";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { WhatsIncludedSection } from "@/components/marketing/whats-included-section";
import { AI_TOOL_COUNT, AI_TOOL_COUNT_LABEL } from "@/lib/marketing";
import { getLandingFaqJsonLd } from "@/lib/landing-faq";
import { SITE_META_DESCRIPTION } from "@/lib/site-meta";
import { FREE_VALIDATION_COPY } from "@/lib/free-tier-copy";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";

export const metadata: Metadata = {
  title: "Feel the Pulse of Your Next Big Idea",
  description: SITE_META_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    description: SITE_META_DESCRIPTION,
  },
  twitter: {
    description: SITE_META_DESCRIPTION,
  },
};

const faqJsonLd = getLandingFaqJsonLd();

const founderPersonas = [
  {
    emoji: "🌙",
    title: "The Side Hustler",
    outcome: "Test 2 ideas a month before risking your savings.",
    useCase: "Validate while keeping your day job.",
  },
  {
    emoji: "🚀",
    title: "The Serial Founder",
    outcome: "Cut your pre-launch research from 3 weeks to 48 hours.",
    useCase: "Run fast validation before committing a team.",
  },
  {
    emoji: "🏢",
    title: "The Agency",
    outcome: "Deliver validation reports as a client deliverable.",
    useCase: "White-label-ready PDF reports included.",
  },
];

function PersonaCard({
  emoji,
  title,
  outcome,
  useCase,
}: {
  emoji: string;
  title: string;
  outcome: string;
  useCase: string;
}) {
  return (
    <Card className="flex h-full flex-col border border-border/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 text-3xl" aria-hidden>
        {emoji}
      </div>
      <h3 className="mb-3 text-lg font-bold">{title}</h3>
      <p className="mb-3 text-sm font-medium leading-relaxed text-foreground">&ldquo;{outcome}&rdquo;</p>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground/80">Use case:</span> &ldquo;{useCase}&rdquo;
      </p>
      <Link
        href="/auth/signup"
        className="mt-auto text-sm font-medium text-primary hover:underline"
      >
        See how it works →
      </Link>
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
                  Validate your first idea free →
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-base px-8 py-6">View pricing</Button>
              </Link>
            </div>
            <SocialProofBar className="mt-12" />
          </div>
        </section>

        <HowItWorksSection />

        <TestimonialsSection />

        <WhatsIncludedSection />

        {/* Founder personas */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-3">Built for founders who move fast</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {founderPersonas.map((persona) => (
              <PersonaCard key={persona.title} {...persona} />
            ))}
          </div>
        </section>

        <LandingFaq />

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 my-12 bg-gradient-to-br from-violet-50 to-emerald-50 rounded-2xl text-center">
          <h2 className="font-display text-4xl font-bold mb-6">Ready to feel the vibe?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start with {FREE_VALIDATION_COPY} Or upgrade for more power.
          </p>
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
