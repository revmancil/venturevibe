/** Ensure NextAuth can resolve the app URL (critical on Vercel and non-default ports). */
export function ensureAuthEnv(): void {
  if (!process.env.NEXTAUTH_URL) {
    if (process.env.VERCEL_URL) {
      process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
    }
  }

  if (!process.env.NEXTAUTH_SECRET && process.env.AUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = process.env.AUTH_SECRET;
  }
}

export function getAuthSecret(): string | undefined {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  return secret?.trim() ? secret : undefined;
}

export function getAuthBaseUrl(): string {
  const raw =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    process.env.SITE_URL ||
    "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}
