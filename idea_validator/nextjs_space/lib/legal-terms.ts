import { LEGAL_CONTACT_EMAIL, type LegalSection } from "./legal";

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "agreement",
    title: "1. Agreement to these terms",
    paragraphs: [
      "These Terms of Service (\"Terms\") govern your access to and use of the VentureVibe website, applications, and related services (collectively, the \"Service\") operated by VentureVibe (\"we,\" \"us,\" or \"our\").",
      "By creating an account, subscribing, or otherwise using the Service, you agree to these Terms and our Privacy Policy. If you do not agree, do not use the Service.",
    ],
  },
  {
    id: "service",
    title: "2. The Service",
    paragraphs: [
      "VentureVibe provides software tools that help founders and teams explore, document, and present business ideas using artificial intelligence and related automation, including validation analyses, financial modeling helpers, and pitch materials.",
      "The Service is intended for informational and planning purposes only. We do not guarantee outcomes, funding, market success, legal clearance of names or trademarks, or accuracy of AI-generated content.",
    ],
  },
  {
    id: "accounts",
    title: "3. Accounts and security",
    paragraphs: [
      "You must provide accurate registration information and keep your credentials confidential. You are responsible for activity under your account.",
      "You must be at least 18 years old (or the age of majority in your jurisdiction) to use the Service.",
      "We may suspend or terminate accounts that violate these Terms, abuse the Service, or pose security or legal risk.",
    ],
  },
  {
    id: "subscriptions",
    title: "4. Subscriptions and billing",
    paragraphs: [
      "Paid plans are billed through Stripe. By subscribing, you authorize us and Stripe to charge your payment method on a recurring basis until you cancel.",
      "Fees are shown at checkout. Taxes may apply. Plan limits (such as monthly validation counts) are described on our pricing page and may change with notice.",
      "You may cancel through the billing portal where available. Cancellation stops future charges; access typically continues through the end of the paid period unless otherwise stated.",
      "Refunds are handled according to our published refund policy or applicable law. Chargebacks without contacting us first may result in account suspension.",
    ],
  },
  {
    id: "ai-content",
    title: "5. AI-generated content",
    paragraphs: [
      "Outputs from the Service—including surveys, market estimates, competitor summaries, financial projections, name suggestions, and pitch content—are generated automatically and may be incomplete, outdated, or incorrect.",
      "You are solely responsible for reviewing outputs before relying on them or sharing them with investors, customers, or regulators. The Service does not provide legal, tax, investment, or professional advice.",
      "You retain responsibility for business ideas and materials you submit. You grant us a limited license to host, process, and display your content solely to operate and improve the Service.",
    ],
  },
  {
    id: "acceptable-use",
    title: "6. Acceptable use",
    list: [
      "Do not use the Service for unlawful, harmful, or fraudulent purposes.",
      "Do not attempt to reverse engineer, scrape, overload, or circumvent usage limits or security controls.",
      "Do not submit content that infringes others' rights or contains malware or illegal material.",
      "Do not misrepresent AI-generated materials as guaranteed facts or professional advice.",
    ],
    paragraphs: ["We may investigate violations and cooperate with law enforcement where required."],
  },
  {
    id: "ip",
    title: "7. Intellectual property",
    paragraphs: [
      "We own the Service, branding, software, and underlying technology, except for your content and third-party materials. These Terms do not transfer ownership of our intellectual property to you.",
      "Subject to these Terms and your plan, we grant you a limited, non-exclusive, non-transferable license to use the Service for your internal business purposes.",
    ],
  },
  {
    id: "privacy",
    title: "8. Privacy",
    paragraphs: [
      "Our Privacy Policy explains how we collect, use, and share personal information. It is incorporated into these Terms by reference.",
    ],
  },
  {
    id: "termination",
    title: "9. Termination",
    paragraphs: [
      "You may stop using the Service at any time. We may suspend or terminate access for breach of these Terms, non-payment, or discontinuation of the Service.",
      "Upon termination, your right to use the Service ends. Provisions that by nature should survive (including disclaimers, limitations of liability, and dispute terms) will survive.",
    ],
  },
  {
    id: "disclaimers",
    title: "10. Disclaimers and limitation of liability",
    paragraphs: [
      "THE SERVICE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.",
      "TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.",
      "OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE SERVICE WILL NOT EXCEED THE GREATER OF (A) AMOUNTS YOU PAID US IN THE TWELVE (12) MONTHS BEFORE THE CLAIM OR (B) ONE HUNDRED U.S. DOLLARS (USD $100).",
      "Some jurisdictions do not allow certain limitations; in those cases, our liability is limited to the fullest extent permitted by law.",
    ],
  },
  {
    id: "indemnity",
    title: "11. Indemnification",
    paragraphs: [
      "You agree to defend, indemnify, and hold harmless VentureVibe and its operators from claims, damages, and expenses (including reasonable attorneys' fees) arising from your content, your use of the Service, or your violation of these Terms or applicable law.",
    ],
  },
  {
    id: "changes",
    title: "12. Changes",
    paragraphs: [
      "We may update these Terms from time to time. We will post the revised Terms with an updated \"Last updated\" date. Material changes may also be notified by email or in-product notice where appropriate.",
      "Continued use after changes become effective constitutes acceptance of the revised Terms.",
    ],
  },
  {
    id: "law",
    title: "13. Governing law and disputes",
    paragraphs: [
      "These Terms are governed by the laws of the United States and the State of Delaware, without regard to conflict-of-law rules, except where mandatory local law applies.",
      "Except where prohibited, disputes will be resolved in the state or federal courts located in Delaware, and you consent to their jurisdiction.",
    ],
  },
  {
    id: "contact",
    title: "14. Contact",
    paragraphs: [
      `Questions about these Terms: ${LEGAL_CONTACT_EMAIL}.`,
    ],
  },
];
