export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserSubscription } from '@/lib/subscription';
import { PLANS, PlanKey } from '@/lib/plans';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await getUserSubscription(session.user.id);
    const plan = PLANS[subscription.plan as PlanKey] || PLANS.free;

    return NextResponse.json({
      plan: subscription.plan,
      planName: plan.name,
      status: subscription.status,
      validationsUsed: subscription.validationsUsedThisMonth,
      validationsLimit: plan.validationsPerMonth,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      currentPeriodEnd: subscription.currentPeriodEnd,
      hasStripeSubscription: !!subscription.stripeSubscriptionId,
    });
  } catch (error: any) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}
