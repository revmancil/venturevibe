import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";
import { AI_TOOL_COUNT, AI_TOOLS_SUMMARY } from "@/lib/marketing";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VentureVibe — Feel the Pulse of Your Next Big Idea",
    template: "%s | VentureVibe",
  },
  description:
    `Validate your startup or business idea in 48 hours with ${AI_TOOL_COUNT} AI-powered tools: ${AI_TOOLS_SUMMARY}.`,
  keywords: [
    "business idea validation",
    "startup validation",
    "AI market research",
    "competitor analysis",
    "market sizing tool",
    "SWOT analysis AI",
    "MVP planning",
    "pitch deck generator",
    "revenue simulator",
    "financial projections startup",
    "funding readiness score",
    "startup name generator",
    "domain availability checker",
    "competitive positioning map",
    "go to market plan",
    "customer personas",
    "business model canvas",
    "VentureVibe",
  ],
  authors: [{ name: "VentureVibe" }],
  creator: "VentureVibe",
  publisher: "VentureVibe",
  applicationName: "VentureVibe",
  category: "Business",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "VentureVibe",
    title: "VentureVibe — Feel the Pulse of Your Next Big Idea",
    description:
      `${AI_TOOL_COUNT} AI-powered tools to validate startup ideas: ${AI_TOOLS_SUMMARY}.`,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VentureVibe — AI Business Idea Validation Platform",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "VentureVibe — Feel the Pulse of Your Next Big Idea",
    description:
      `${AI_TOOL_COUNT} AI-powered tools to validate startup ideas fast: market sizing, financial projections, funding readiness, pitch deck, and more.`,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: "VentureVibe",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      description:
        "AI-powered business idea validation platform that helps entrepreneurs validate startup ideas in 48 hours.",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: siteUrl,
      name: "VentureVibe",
      publisher: { "@id": `${siteUrl}#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      name: "VentureVibe",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        `Validate business ideas in 48 hours with ${AI_TOOL_COUNT} AI-powered tools including ${AI_TOOLS_SUMMARY}.`,
      offers: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          name: "Pro",
          price: "29",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          name: "Business",
          price: "79",
          priceCurrency: "USD",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "127",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${jetbrains.variable}`}>
      <head>
        {process.env.ABACUS_APPLLM_SCRIPT === "true" ? (
          <script async src="https://apps.abacus.ai/chatllm/appllm-lib.js" />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
