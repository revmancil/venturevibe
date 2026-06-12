"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LANDING_FEATURE_SECTIONS } from "@/lib/landing-feature-sections";
import { LandingFeatureCard } from "@/components/marketing/landing-feature-card";

function FeatureSectionGrids() {
  return (
    <div className="space-y-16">
      {LANDING_FEATURE_SECTIONS.map((section) => (
        <div key={section.id}>
          <div className="mb-8 text-center md:text-left">
            <div
              className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${section.badgeClassName}`}
            >
              {section.badge}
            </div>
            <h3 className="font-display mb-2 text-2xl font-bold sm:text-3xl">{section.title}</h3>
            <p className="max-w-2xl text-muted-foreground">{section.subtitle}</p>
          </div>
          <div className={section.gridClassName}>
            {section.features.map((feature) => (
              <LandingFeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function WhatsIncludedSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Mobile: collapsed by default */}
      <div className="md:hidden">
        <Accordion type="single" collapsible>
          <AccordionItem value="whats-included" className="border-border/50">
            <AccordionTrigger className="font-display text-xl font-bold hover:no-underline">
              What&apos;s included
            </AccordionTrigger>
            <AccordionContent>
              <FeatureSectionGrids />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Desktop: always expanded */}
      <div className="hidden md:block">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-bold">What&apos;s included</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Every tool in the VentureVibe validation suite, organized by stage.
          </p>
        </div>
        <FeatureSectionGrids />
      </div>
    </section>
  );
}
