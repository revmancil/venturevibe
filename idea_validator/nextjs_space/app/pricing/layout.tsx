import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Free, Pro & Business Plans",
  description:
    "Simple, transparent pricing for VentureVibe. Start free with 2 validations/month, upgrade to Pro ($29/mo) for 15 validations, or Business ($79/mo) for unlimited AI-powered business idea validations.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "VentureVibe Pricing — Free, Pro & Business",
    description: "Free tier available. Pro at $29/mo, Business at $79/mo. Validate unlimited business ideas with AI.",
    url: "/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
