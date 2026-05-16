/**
 * Credentials for the Prisma-seeded demo user (`npx prisma db seed`).
 * Demo user is auto-created on login when dev, NEXT_PUBLIC_SHOW_DEMO_LOGIN, or ALLOW_DEMO_LOGIN is set.
 */
export const DEMO_TEST_EMAIL = "demo@venturevibe.app";
export const DEMO_TEST_PASSWORD = "DemoPass2026!";

export function isDemoLoginEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_SHOW_DEMO_LOGIN === "true" ||
    process.env.ALLOW_DEMO_LOGIN === "true"
  );
}
