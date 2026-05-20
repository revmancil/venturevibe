import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { LegalSection } from "@/components/legal/legal-section";
import { LEGAL_CONTACT_EMAIL } from "@/lib/legal";
import { PRIVACY_SECTIONS } from "@/lib/legal-privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for VentureVibe — how we collect and use your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
        This Policy describes how VentureVibe handles personal information. Use of the Service is also
        governed by our{" "}
        <Link href="/terms" className="font-medium text-primary hover:underline">
          Terms of Service
        </Link>
        .
      </p>
      {PRIVACY_SECTIONS.map((section) => (
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
