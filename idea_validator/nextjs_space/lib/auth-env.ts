function isLocalhostUrl(url: string | undefined): boolean {
  if (!url) return false;
  return /localhost|127\.0\.0\.1/i.test(url);
}

/** On Vercel, ignore localhost NEXTAUTH_URL from a copied local .env. */
export function resolveNextAuthUrl(): string | undefined {
  const configured = process.env.NEXTAUTH_URL?.trim();
  const onVercel = process.env.VERCEL === "1";

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
  const raw =
    resolveNextAuthUrl() ||
    process.env.SITE_URL ||
    "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}
