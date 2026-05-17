import { prisma } from "./prisma";
import { DEMO_TEST_EMAIL } from "./demo-auth";

/** Full-access plan for the public demo account (no Stripe required). */
export const DEMO_PLAN = "business" as const;

export function isDemoEmail(email: string): boolean {
  return email.trim().toLowerCase() === DEMO_TEST_EMAIL.toLowerCase();
}

export async function isDemoUser(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  return user ? isDemoEmail(user.email) : false;
}

/** Ensures demo@venturevibe.app always has Business-tier access for showcases. */
export async function ensureDemoSubscription(userId: string): Promise<void> {
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan: DEMO_PLAN,
      status: "active",
      validationsUsedThisMonth: 0,
      validationResetDate: new Date(),
    },
    update: {
      plan: DEMO_PLAN,
      status: "active",
      cancelAtPeriodEnd: false,
    },
  });
}
