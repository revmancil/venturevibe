'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';

interface Tier { name: string; price: string; target: string; features: string[]; }
interface CompPrice { competitor: string; price: string; comparison: string; }
interface PricingData {
  recommendedModel?: string;
  modelReasoning?: string;
  tiers?: Tier[];
  revenueProjection?: { year1?: string; year2?: string; year3?: string; assumptions?: string };
  competitorPricing?: CompPrice[];
  keyInsights?: string[];
}

export default function PricingStrategy({ data }: { data: PricingData }) {
  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-lg"><DollarSign className="w-6 h-6 text-green-600" /></div>
        <h2 className="font-display text-2xl font-bold">Pricing Strategy</h2>
      </div>

      {data?.recommendedModel && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-green-900">Recommended Model:</span>
            <Badge className="bg-green-600 text-white capitalize">{data.recommendedModel}</Badge>
          </div>
          <p className="text-sm text-green-700">{data.modelReasoning}</p>
        </div>
      )}

      {data?.tiers && data.tiers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {data.tiers.map((tier, i) => (
            <div key={i} className={`p-5 rounded-lg border ${i === 1 ? 'border-green-400 bg-green-50 ring-2 ring-green-200' : 'border-border bg-white'}`}>
              <h4 className="font-semibold text-lg">{tier.name}</h4>
              <p className="font-display text-3xl font-bold mt-2">{tier.price}</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">{tier.target}</p>
              <ul className="space-y-1.5">
                {tier.features?.map((f, fi) => (
                  <li key={fi} className="text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data?.revenueProjection && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {(['year1', 'year2', 'year3'] as const).map((yr, i) => (
            <div key={yr} className="p-4 bg-gray-50 border rounded-lg text-center">
              <p className="text-xs text-muted-foreground">Year {i + 1}</p>
              <p className="font-display text-2xl font-bold">{data.revenueProjection?.[yr] || 'N/A'}</p>
            </div>
          ))}
          {data.revenueProjection.assumptions && <p className="col-span-3 text-xs text-muted-foreground italic">{data.revenueProjection.assumptions}</p>}
        </div>
      )}

      {data?.competitorPricing && data.competitorPricing.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Competitor Pricing</h3>
          <div className="space-y-2">
            {data.competitorPricing.map((cp, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg text-sm">
                <span className="font-medium">{cp.competitor}</span>
                <span className="font-semibold">{cp.price}</span>
                <span className="text-muted-foreground max-w-[40%] text-xs">{cp.comparison}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.keyInsights && data.keyInsights.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Key Insights</h4>
          <ul className="space-y-1">{data.keyInsights.map((ins, i) => (
            <li key={i} className="text-sm text-blue-700 flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />{ins}</li>
          ))}</ul>
        </div>
      )}
    </Card>
  );
}
