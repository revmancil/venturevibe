import { prisma } from './prisma';
import { PLANS, PlanKey } from './plans';
import { DEMO_PLAN, ensureDemoSubscription, isDemoUser } from './demo-subscription';

export async function getUserSubscription(userId: string) {
  let subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    const plan = (await isDemoUser(userId)) ? DEMO_PLAN : 'free';
    subscription = await prisma.subscription.create({
      data: {
        userId,
        plan,
        status: 'active',
        validationsUsedThisMonth: 0,
        validationResetDate: new Date(),
      },
    });
  }

  if (await isDemoUser(userId)) {
    if (subscription.plan !== DEMO_PLAN || subscription.status !== 'active') {
      await ensureDemoSubscription(userId);
      subscription = await prisma.subscription.findUnique({
        where: { userId },
      });
    }
  }

  if (!subscription) {
    throw new Error('Subscription not found');
  }

  // Check if we need to reset the monthly counter
  const now = new Date();
  const resetDate = new Date(subscription.validationResetDate);
  if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
    subscription = await prisma.subscription.update({
      where: { userId },
      data: {
        validationsUsedThisMonth: 0,
        validationResetDate: now,
      },
    });
  }

  return subscription;
}

export async function canUserValidate(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const subscription = await getUserSubscription(userId);
  const plan = PLANS[subscription.plan as PlanKey] || PLANS.free;

  // TODO: Free tier should enforce 1 lifetime validation (not monthly reset) in Prisma/query logic.
  // TODO: Enforce per-tool access via planToolAccess from lib/toolGroups.ts in validation API routes.

  if (plan.validationsPerMonth === -1) {
    return { allowed: true };
  }

  if (subscription.validationsUsedThisMonth >= plan.validationsPerMonth) {
    return {
      allowed: false,
      reason: `You've used all ${plan.validationsPerMonth} validations for this month on the ${plan.name} plan. Upgrade to get more validations.`,
    };
  }

  return { allowed: true };
}

export async function incrementValidationCount(userId: string) {
  await getUserSubscription(userId); // ensure reset logic runs first
  await prisma.subscription.update({
    where: { userId },
    data: {
      validationsUsedThisMonth: { increment: 1 },
    },
  });
}
