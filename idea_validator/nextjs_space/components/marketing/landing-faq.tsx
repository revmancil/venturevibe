import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LANDING_FAQ_ITEMS } from "@/lib/landing-faq";
import { cn } from "@/lib/utils";

export function LandingFaq() {
  return (
    <section
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby="landing-faq-heading"
    >
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h2 id="landing-faq-heading" className="font-display mb-3 text-4xl font-bold">
          Frequently asked questions
        </h2>
        <p className="text-muted-foreground">Straight answers before you start validating.</p>
      </div>

      <Card
        className="mx-auto max-w-3xl border border-border/50 px-4 sm:px-6"
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <div className="w-full">
          {LANDING_FAQ_ITEMS.map((item) => (
            <details
              key={item.id}
              className="group border-b border-border/50 last:border-b-0"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <summary
                className={cn(
                  "flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-semibold",
                  "hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
                  "[&::-webkit-details-marker]:hidden"
                )}
                itemProp="name"
              >
                {item.question}
                <ChevronDown
                  className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div
                className="pb-4 leading-relaxed text-muted-foreground"
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p itemProp="text">
                  {item.id === "idea-privacy" ? (
                    <>
                      Your ideas are private by default. We do not use your idea data to train AI
                      models or share it with third parties. Full details in our{" "}
                      <Link href="/privacy" className="font-medium text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </>
                  ) : (
                    item.answer
                  )}
                </p>
              </div>
            </details>
          ))}
        </div>
      </Card>
    </section>
  );
}
