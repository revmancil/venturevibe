/** Canonical site URL when request headers are unavailable (e.g. build time). */
export function getFallbackSiteUrl(): string {
  const raw =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    process.env.SITE_URL ||
    "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}
