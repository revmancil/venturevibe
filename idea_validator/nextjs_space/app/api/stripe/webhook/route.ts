export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && plan && session.subscription) {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          ) as any;

          await prisma.subscription.update({
            where: { userId },
            data: {
              stripeSubscriptionId: stripeSubscription.id,
              stripePriceId: stripeSubscription.items?.data?.[0]?.price?.id,
              plan,
              status: 'active',
              currentPeriodStart: stripeSubscription.current_period_start
                ? new Date(stripeSubscription.current_period_start * 1000)
                : null,
              currentPeriodEnd: stripeSubscription.current_period_end
                ? new Date(stripeSubscription.current_period_end * 1000)
                : null,
            },
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const existing = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (existing) {
          await prisma.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              status: subscription.status === 'active' ? 'active' : subscription.status,
              currentPeriodStart: subscription.current_period_start
                ? new Date(subscription.current_period_start * 1000)
                : null,
              currentPeriodEnd: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000)
                : null,
              cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const existing = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (existing) {
          await prisma.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              plan: 'free',
              status: 'active',
              stripeSubscriptionId: null,
              stripePriceId: null,
              currentPeriodStart: null,
              currentPeriodEnd: null,
              cancelAtPeriodEnd: false,
            },
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const subId = invoice.subscription;
        if (subId) {
          const existing = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: typeof subId === 'string' ? subId : subId.id },
          });
          if (existing) {
            await prisma.subscription.update({
              where: { stripeSubscriptionId: existing.stripeSubscriptionId! },
              data: { status: 'past_due' },
            });
          }
        }
        break;
      }
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
