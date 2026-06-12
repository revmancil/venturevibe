import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LANDING_TESTIMONIALS } from "@/lib/landing-testimonials";
import { SOCIAL_PROOF } from "@/lib/social-proof";

export function TestimonialsSection() {
  return (
    <section
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby="testimonials-heading"
    >
      <div className="mb-12 text-center">
        <p className="mb-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-amber-600">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
          {SOCIAL_PROOF.averageRating}★ average rating
        </p>
        <h2 id="testimonials-heading" className="font-display text-4xl font-bold">
          What founders are saying
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {LANDING_TESTIMONIALS.map((item) => (
          <Card
            key={item.id}
            className="border border-border/40 bg-white p-6 shadow-md shadow-black/5"
          >
            <blockquote className="mb-6 text-sm leading-relaxed text-foreground">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <footer className="text-sm text-muted-foreground">
              <cite className="not-italic">
                <span className="font-semibold text-foreground">{item.name}</span>
                {", "}
                {item.ideaName} {item.flag}
              </cite>
            </footer>
          </Card>
        ))}
      </div>
    </section>
  );
}
