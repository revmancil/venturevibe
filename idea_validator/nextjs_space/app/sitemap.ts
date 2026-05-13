import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const host = headers().get("x-forwarded-host") || headers().get("host");
  const proto = headers().get("x-forwarded-proto") || "https";
  const baseUrl = host
    ? `${proto}://${host}`
    : process.env.NEXTAUTH_URL || "https://mc3-idea-validator.abacusai.app";

  const now = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
