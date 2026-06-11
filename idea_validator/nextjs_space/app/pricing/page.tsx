'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowLeft, Loader2, Crown, Sparkles } from 'lucide-react';
import { VentureVibeLogo } from '@/components/brand/venturevibe-logo';
import { toast } from 'sonner';
import { PLANS } from '@/lib/plans';
import { AI_TOOL_COUNT_LABEL } from '@/lib/marketing';
import { FREE_TRIAL_TOOLS, signupTrialUrl } from '@/lib/pricing-trials';

export default function PricingPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    setCheckoutError(null);

    if (status === 'loading') {
      toast.message('Checking your session…');
      return;
    }

    if (!session) {
      window.location.href = '/auth/signup';
      return;
    }

    setLoading(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message = data.error || `Checkout failed (${res.status})`;
        setCheckoutError(message);
        toast.error(message);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      const message = data.error || 'Failed to start checkout';
      setCheckoutError(message);
      toast.error(message);
    } catch {
      const message = 'Something went wrong. Try again.';
      setCheckoutError(message);
      toast.error(message);
    } finally {
      setLoading(null);
    }
  };

  const planEntries = Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <VentureVibeLogo size="md" href="/" />
          <div className="flex gap-3">
            {session ? (
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline">Sign in</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-violet-500 to-emerald-500">Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <Badge className="bg-purple-100 text-purple-700 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Simple pricing
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Choose your validation power
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include {AI_TOOL_COUNT_LABEL.toLowerCase()} for validation, investor prep, and pitching.
          </p>
        </div>

        {checkoutError && (
          <div
            role="alert"
            className="max-w-2xl mx-auto mb-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {checkoutError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {planEntries.map(([key, plan]) => {
            const isPopular = key === 'pro';
            return (
              <Card
                key={key}
                className={`relative p-8 flex flex-col ${
                  isPopular
                    ? 'border-2 border-purple-500 shadow-xl shadow-purple-100 scale-105'
                    : 'border border-border/50'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4">
                      <Crown className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-display text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {key === 'free'
                      ? 'Perfect to get started'
                      : key === 'pro'
                      ? 'For serious entrepreneurs'
                      : 'For teams & agencies'}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => {
                    const isSeparator = feature.toLowerCase().startsWith('everything in');
                    return (
                      <li key={i} className={`flex items-start gap-2 text-sm ${isSeparator ? 'pt-1 pb-1' : ''}`}>
                        {isSeparator ? (
                          <span className="font-semibold text-purple-600">{feature}</span>
                        ) : (
                          <>
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </>
                        )}
                      </li>
                    );
                  })}
                  {key === 'free' &&
                    FREE_TRIAL_TOOLS.map((tool) => (
                      <li key={tool.id} className="text-sm">
                        <div className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span>{tool.label}</span>
                        </div>
                        <Link
                          href={signupTrialUrl(tool.id)}
                          className="ml-6 mt-0.5 inline-block text-xs font-medium text-primary hover:underline"
                        >
                          Try once free →
                        </Link>
                      </li>
                    ))}
                </ul>

                {key === 'free' ? (
                  <Link href={session ? '/dashboard' : '/auth/signup'}>
                    <Button variant="outline" className="w-full">
                      {session ? 'Go to Dashboard' : 'Get Started Free'}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => handleSubscribe(key)}
                    disabled={loading === key}
                    className={`w-full ${
                      isPopular
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                        : 'bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-blue-600 hover:to-purple-600'
                    }`}
                  >
                    {loading === key ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
