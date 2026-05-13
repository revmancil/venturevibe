import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const host = headers().get("x-forwarded-host") || headers().get("host");
  const proto = headers().get("x-forwarded-proto") || "https";
  const baseUrl = host
    ? `${proto}://${host}`
    : process.env.NEXTAUTH_URL || "https://mc3-idea-validator.abacusai.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/ideas/", "/auth/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
