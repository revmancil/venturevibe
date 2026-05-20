import { LEGAL_CONTACT_EMAIL, type LegalSection } from "./legal";

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "intro",
    title: "1. Introduction",
    paragraphs: [
      "VentureVibe (\"we,\" \"us,\" or \"our\") respects your privacy. This Privacy Policy describes how we collect, use, disclose, and protect personal information when you use our website and services (the \"Service\").",
      "By using the Service, you agree to this Policy. If you do not agree, please do not use the Service.",
    ],
  },
  {
    id: "collect",
    title: "2. Information we collect",
    paragraphs: ["We may collect the following categories of information:"],
    list: [
      "Account information: name, email address, and password (stored in hashed form).",
      "Business content: idea titles, descriptions, validation inputs, and AI-generated reports you create in the Service.",
      "Usage data: pages viewed, features used, validation counts, and similar analytics.",
      "Payment information: processed by Stripe; we receive subscription status and limited billing metadata, not full card numbers.",
      "Technical data: IP address, browser type, device information, and cookies used for authentication and security.",
      "Communications: messages you send to support or feedback channels.",
    ],
  },
  {
    id: "use",
    title: "3. How we use information",
    list: [
      "Provide, maintain, and secure the Service.",
      "Authenticate users and manage subscriptions.",
      "Generate AI-powered analyses you request.",
      "Enforce usage limits, prevent abuse, and comply with law.",
      "Send service-related emails (e.g., account, billing, security).",
      "Improve the Service through aggregated or de-identified analytics.",
    ],
    paragraphs: [
      "We do not sell your personal information. We do not use your private idea content to train public third-party AI models unless we clearly disclose that practice and you opt in.",
    ],
  },
  {
    id: "ai",
    title: "4. AI processing",
    paragraphs: [
      "To run validation tools, we send relevant portions of your idea and prompts to AI providers (such as OpenAI-compatible APIs configured for the Service). Those providers process data according to their terms and our agreements with them.",
      "AI outputs are stored in your account so you can review and export them. Do not submit sensitive personal data you are not authorized to share.",
    ],
  },
  {
    id: "sharing",
    title: "5. When we share information",
    paragraphs: ["We may share information with:"],
    list: [
      "Service providers that help us operate the Service (hosting, database, email, payments, analytics), under contractual confidentiality obligations.",
      "Stripe, for payment processing.",
      "Law enforcement or regulators when required by law or to protect rights and safety.",
      "A successor entity in connection with a merger, acquisition, or asset sale, subject to this Policy.",
    ],
  },
  {
    id: "cookies",
    title: "6. Cookies and sessions",
    paragraphs: [
      "We use cookies and similar technologies for login sessions (NextAuth), security, and preferences. You can control cookies through browser settings, but some features may not work if cookies are disabled.",
    ],
  },
  {
    id: "retention",
    title: "7. Data retention",
    paragraphs: [
      "We retain account and idea data while your account is active. You may delete ideas from the dashboard where that feature is available.",
      "After account closure, we may retain certain records for billing, security, and legal compliance, then delete or de-identify data when no longer needed.",
    ],
  },
  {
    id: "security",
    title: "8. Security",
    paragraphs: [
      "We use industry-standard measures such as encryption in transit (HTTPS), hashed passwords, and access controls. No method of transmission or storage is 100% secure.",
      `Notify us promptly at ${LEGAL_CONTACT_EMAIL} if you believe your account has been compromised.`,
    ],
  },
  {
    id: "rights",
    title: "9. Your rights and choices",
    paragraphs: [
      "Depending on your location, you may have rights to access, correct, delete, or export personal information, or to object to certain processing.",
      `To exercise rights, contact ${LEGAL_CONTACT_EMAIL}. We may verify your request. California residents may have additional rights under the CCPA/CPRA; EU/UK users may have rights under GDPR where applicable.`,
    ],
  },
  {
    id: "children",
    title: "10. Children",
    paragraphs: [
      "The Service is not directed to children under 18. We do not knowingly collect personal information from children. Contact us if you believe we have collected such information.",
    ],
  },
  {
    id: "international",
    title: "11. International users",
    paragraphs: [
      "We may process and store information in the United States and other countries where our providers operate. By using the Service, you consent to transfer and processing in those locations.",
    ],
  },
  {
    id: "changes",
    title: "12. Changes to this Policy",
    paragraphs: [
      "We may update this Policy from time to time. We will post the revised Policy with an updated date and, where appropriate, provide additional notice for material changes.",
    ],
  },
  {
    id: "contact",
    title: "13. Contact us",
    paragraphs: [
      `Privacy questions or requests: ${LEGAL_CONTACT_EMAIL}.`,
    ],
  },
];
