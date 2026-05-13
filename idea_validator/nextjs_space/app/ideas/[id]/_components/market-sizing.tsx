'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface MarketData {
  tam?: number | string;
  tamLabel?: string;
  sam?: number | string;
  samLabel?: string;
  som?: number | string;
  somLabel?: string;
  growth?: number | string;
  growthLabel?: string;
  insights?: string[];
  marketTrends?: Array<{ year: string; market_size: number }>;
  addressableMarket?: string;
}

interface MarketSizingProps {
  data: MarketData;
}

export default function MarketSizing({ data }: MarketSizingProps) {
  const formatCurrency = (value: any) => {
    if (typeof value === 'string') return value;
    const num = Number(value);
    if (isNaN(num)) return '$0';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  const chartData = data?.marketTrends || [];

  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-100 rounded-lg">
          <TrendingUp className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="font-display text-2xl font-bold">Market Sizing</h2>
      </div>

      <p className="text-muted-foreground mb-8">Total addressable market (TAM), serviceable addressable market (SAM), and market growth projections.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-xs font-semibold text-emerald-700 mb-2">TAM (Total Market)</p>
          <p className="font-display text-3xl font-bold text-emerald-900">{formatCurrency(data?.tam) || data?.tamLabel || 'TBD'}</p>
          <p className="text-xs text-emerald-600 mt-2">Total market opportunity</p>
        </div>

        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs font-semibold text-blue-700 mb-2">SAM (Your Market)</p>
          <p className="font-display text-3xl font-bold text-blue-900">{formatCurrency(data?.sam) || data?.samLabel || 'TBD'}</p>
          <p className="text-xs text-blue-600 mt-2">Addressable market</p>
        </div>

        <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-xs font-semibold text-purple-700 mb-2">SOM (Target)</p>
          <p className="font-display text-3xl font-bold text-purple-900">{formatCurrency(data?.som) || data?.somLabel || 'TBD'}</p>
          <p className="text-xs text-purple-600 mt-2">Initial target market</p>
        </div>

        <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs font-semibold text-amber-700 mb-2">Growth</p>
          <p className="font-display text-3xl font-bold text-amber-900">{data?.growth || data?.growthLabel || 'TBD'}</p>
          <p className="text-xs text-amber-600 mt-2">Annual growth rate</p>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="mb-8 p-6 bg-gray-50 border border-border rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Market Growth Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="market_size"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: '#06b6d4', r: 4 }}
                name="Market Size"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {data?.insights && data.insights.length > 0 && (
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-lg mb-4 text-blue-900">Key Market Insights</h3>
          <ul className="space-y-3">
            {data.insights.map((insight: string, idx: number) => (
              <li key={idx} className="flex gap-3 text-blue-700">
                <span className="text-xl leading-none mt-0.5">📊</span>
                <span className="text-sm">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
