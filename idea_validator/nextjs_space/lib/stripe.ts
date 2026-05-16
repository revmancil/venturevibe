import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/** Lazy Stripe client so `next build` does not require STRIPE_SECRET_KEY at compile time. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, { typescript: true });
  }
  return stripeClient;
}

export { PLANS, type PlanKey } from "./plans";
