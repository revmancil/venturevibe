import { getSiteUrl } from "./site-url";

function isLocalhostUrl(url: string | undefined): boolean {
  if (!url) return false;
  return /localhost|127\.0\.0\.1/i.test(url);
}

/** Resolve NEXTAUTH_URL; on Vercel production, use the canonical custom domain. */
export function resolveNextAuthUrl(): string | undefined {
  const configured = process.env.NEXTAUTH_URL?.trim();
  const onVercel = process.env.VERCEL === "1";

  if (process.env.VERCEL_ENV === "production") {
    return getSiteUrl();
  }

  if (onVercel && isLocalhostUrl(configured) && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (configured) return configured;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return undefined;
}

/** Ensure NextAuth can resolve the app URL (critical on Vercel and non-default ports). */
export function ensureAuthEnv(): void {
  const resolved = resolveNextAuthUrl();
  if (resolved) {
    process.env.NEXTAUTH_URL = resolved;
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
  return getSiteUrl();
}
