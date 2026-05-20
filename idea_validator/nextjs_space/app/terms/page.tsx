import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { LegalSection } from "@/components/legal/legal-section";
import { LEGAL_CONTACT_EMAIL } from "@/lib/legal";
import { TERMS_SECTIONS } from "@/lib/legal-terms";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for VentureVibe — AI-powered startup idea validation.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service">
      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
        Please read these terms carefully. For privacy practices, see our{" "}
        <Link href="/privacy" className="font-medium text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
      {TERMS_SECTIONS.map((section) => (
        <LegalSection key={section.id} section={section} />
      ))}
      <p className="text-sm text-muted-foreground">
        Contact:{" "}
        <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="text-primary hover:underline">
          {LEGAL_CONTACT_EMAIL}
        </a>
      </p>
    </LegalPageLayout>
  );
}
