import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/** Stripe config check — visit /api/stripe/health */
export async function GET() {
  const secret = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
  const pro = Boolean(process.env.STRIPE_PRO_PRICE_ID?.trim());
  const business = Boolean(process.env.STRIPE_BUSINESS_PRICE_ID?.trim());
  const publishable = Boolean(process.env.STRIPE_PUBLISHABLE_KEY?.trim());
  const webhook = Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim());

  return NextResponse.json({
    stripeSecretKey: secret,
    stripeProPriceId: pro,
    stripeBusinessPriceId: business,
    stripePublishableKey: publishable,
    stripeWebhookSecret: webhook,
    checkoutReady: secret && pro && business,
  });
}
