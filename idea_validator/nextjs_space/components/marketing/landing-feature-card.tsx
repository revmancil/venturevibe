import { Card } from "@/components/ui/card";
import { LandingScreenshot } from "@/components/features/landing-screenshot";
import type { LandingFeature } from "@/lib/landing-feature-sections";

export function LandingFeatureCard({ slug, color, title, desc }: LandingFeature) {
  return (
    <Card className="overflow-hidden border border-border/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <LandingScreenshot slug={slug} title={title} color={color} />
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </Card>
  );
}
