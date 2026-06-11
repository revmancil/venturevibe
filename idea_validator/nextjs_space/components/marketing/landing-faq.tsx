"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { LANDING_FAQ_ITEMS } from "@/lib/landing-faq";

export function LandingFaq() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h2 className="font-display mb-3 text-4xl font-bold">Frequently asked questions</h2>
        <p className="text-muted-foreground">Straight answers before you start validating.</p>
      </div>
      <Card className="mx-auto max-w-3xl border border-border/50 px-4 sm:px-6">
        <Accordion type="single" collapsible className="w-full">
          {LANDING_FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-border/50">
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </section>
  );
}
