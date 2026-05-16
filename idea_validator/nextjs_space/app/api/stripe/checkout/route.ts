export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getStripe } from '@/lib/stripe';
import { getUserSubscription } from '@/lib/subscription';
import { prisma } from '@/lib/prisma';

const PRICE_IDS: Record<string, { envKey: string; value: string }> = {
  pro: { envKey: 'STRIPE_PRO_PRICE_ID', value: process.env.STRIPE_PRO_PRICE_ID?.trim() || '' },
  business: {
    envKey: 'STRIPE_BUSINESS_PRICE_ID',
    value: process.env.STRIPE_BUSINESS_PRICE_ID?.trim() || '',
  },
};

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY?.trim()) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Set STRIPE_SECRET_KEY on Vercel.' },
        { status: 503 }
      );
    }

    const stripe = getStripe();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await request.json();
    const priceConfig = PRICE_IDS[plan as string];

    if (!priceConfig) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    if (!priceConfig.value) {
      return NextResponse.json(
        {
          error: `Stripe price not configured. Set ${priceConfig.envKey} on Vercel (from Stripe Dashboard → Products → Price ID).`,
        },
        { status: 503 }
      );
    }

    const subscription = await getUserSubscription(session.user.id);
    const origin =
      request.headers.get('origin') ||
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

    let customerId = subscription.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email || undefined,
        name: session.user.name || undefined,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;
      await prisma.subscription.update({
        where: { userId: session.user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: priceConfig.value,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?upgraded=true`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        userId: session.user.id,
        plan,
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: 'Stripe did not return a checkout URL. Check your Stripe price IDs.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
