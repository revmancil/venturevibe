/** Production canonical origin (metadata, sitemap, auth callbacks on Vercel prod). */
export const PRODUCTION_SITE_URL = "https://www.venturevibe.pro";

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function isLocalhostUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

function isVercelAppUrl(url: string): boolean {
  return /\.vercel\.app/i.test(url);
}

/**
 * Canonical public URL for metadata, sitemap, emails, Stripe redirects, and NextAuth.
 * On Vercel production, always prefers the custom domain over *.vercel.app.
 */
export function getSiteUrl(): string {
  const siteUrl = process.env.SITE_URL?.trim();
  const nextAuthUrl = process.env.NEXTAUTH_URL?.trim();
  const isVercelProduction = process.env.VERCEL_ENV === "production";

  for (const candidate of [siteUrl, nextAuthUrl]) {
    if (!candidate || isLocalhostUrl(candidate)) continue;
    if (isVercelProduction && isVercelAppUrl(candidate)) continue;
    return normalizeSiteUrl(candidate);
  }

  if (isVercelProduction) {
    return PRODUCTION_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (nextAuthUrl) return normalizeSiteUrl(nextAuthUrl);
  if (siteUrl) return normalizeSiteUrl(siteUrl);

  return "http://localhost:3000";
}

/** @deprecated Use getSiteUrl() */
export function getFallbackSiteUrl(): string {
  return getSiteUrl();
}
