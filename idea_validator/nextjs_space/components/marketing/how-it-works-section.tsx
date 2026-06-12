import { BarChart3, FileText, Lightbulb, Rocket } from "lucide-react";
import { LandingScreenshot } from "@/components/features/landing-screenshot";
import { HOW_IT_WORKS_STEPS } from "@/lib/landing-how-it-works";
import { cn } from "@/lib/utils";

const stepIcons = [Lightbulb, BarChart3, FileText, Rocket] as const;

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-14 text-center">
        <h2 className="font-display mb-3 text-4xl font-bold">How It Works</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          From first idea to investor-ready materials in four clear steps.
        </p>
      </div>

      <ol className="space-y-16 sm:space-y-20">
        {HOW_IT_WORKS_STEPS.map((step, index) => {
          const Icon = stepIcons[index];
          const imageFirst = index % 2 === 1;

          return (
            <li key={step.step} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div className={cn(imageFirst && "lg:order-2")}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                    {step.step}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-emerald-100">
                    <Icon className="h-5 w-5 text-violet-700" aria-hidden />
                  </div>
                </div>
                <h3 className="font-display mb-3 text-2xl font-bold sm:text-3xl">{step.title}</h3>
                <p className="mb-2 leading-relaxed text-muted-foreground">{step.description[0]}</p>
                <p className="leading-relaxed text-muted-foreground">{step.description[1]}</p>
              </div>

              <div
                className={cn(
                  "overflow-hidden rounded-2xl border border-border/50 bg-white/60 p-3 shadow-sm [&_button]:mb-0",
                  imageFirst && "lg:order-1"
                )}
              >
                <LandingScreenshot
                  slug={step.screenshotSlug}
                  title={step.screenshotTitle}
                  color={step.screenshotColor}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
