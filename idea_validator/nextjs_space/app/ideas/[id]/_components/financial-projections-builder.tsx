"use client";

import { useMemo, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import { TrendingUp, Flame, Target } from "lucide-react";

interface Range { min: number; max: number; step: number }
interface Baseline {
  startingCustomers: number;
  monthlyCustomerGrowthRate: number;
  arpa: number;
  cogsPercent: number;
  monthlyFixedOpex: number;
  monthlyMarketingSpend: number;
  startingCash: number;
}
interface FinancialProjectionsData {
  horizonYears?: number;
  baseline?: Baseline;
  ranges?: Record<string, Range>;
  assumptions?: string[];
  investorNotes?: string;
}

const fmt = (n: number) => {
  if (!isFinite(n)) return "$0";
  const abs = Math.abs(n);
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${Math.round(n).toLocaleString()}`;
};

function runModel(b: Baseline, months: number) {
  let customers = b.startingCustomers;
  let cash = b.startingCash;
  const monthly: { month: number; revenue: number; cogs: number; opex: number; burn: number; cash: number; customers: number }[] = [];
  let breakEvenMonth: number | null = null;

  for (let m = 1; m <= months; m++) {
    customers = customers * (1 + b.monthlyCustomerGrowthRate);
    const revenue = customers * b.arpa;
    const cogs = revenue * b.cogsPercent;
    const opex = b.monthlyFixedOpex + b.monthlyMarketingSpend;
    const burn = opex + cogs - revenue;
    cash -= burn;
    if (breakEvenMonth === null && revenue >= opex + cogs) breakEvenMonth = m;
    monthly.push({ month: m, revenue, cogs, opex, burn, cash, customers: Math.round(customers) });
  }

  const yearly: { year: string; revenue: number; burn: number; ebitda: number; endingCash: number }[] = [];
  for (let y = 0; y < months / 12; y++) {
    const slice = monthly.slice(y * 12, (y + 1) * 12);
    const revenue = slice.reduce((s, r) => s + r.revenue, 0);
    const costs = slice.reduce((s, r) => s + r.cogs + r.opex, 0);
    yearly.push({
      year: `Y${y + 1}`,
      revenue: Math.round(revenue),
      burn: Math.round(Math.max(0, costs - revenue)),
      ebitda: Math.round(revenue - costs),
      endingCash: Math.round(slice[slice.length - 1]?.cash ?? 0),
    });
  }

  const recentBurn = monthly.slice(-3).map((r) => Math.max(0, r.burn));
  const avgBurn = recentBurn.reduce((s, v) => s + v, 0) / Math.max(recentBurn.length, 1);
  const runwayMonths = avgBurn > 0 && cash > 0 ? Math.floor(cash / avgBurn) : cash > 0 ? null : 0;

  return { monthly, yearly, breakEvenMonth, runwayMonths, endingCash: cash };
}

export default function FinancialProjectionsBuilder({ data }: { data: FinancialProjectionsData }) {
  const years = data.horizonYears ?? 5;
  const months = years * 12;
  const defaultBaseline: Baseline = {
    startingCustomers: 0,
    monthlyCustomerGrowthRate: 0.05,
    arpa: 49,
    cogsPercent: 0.25,
    monthlyFixedOpex: 12000,
    monthlyMarketingSpend: 3000,
    startingCash: 50000,
  };
  const b0 = { ...defaultBaseline, ...data.baseline };
  const ranges = data.ranges || {};

  const [params, setParams] = useState<Baseline>(b0);
  const set = useCallback((key: keyof Baseline, v: number) => {
    setParams((p) => ({ ...p, [key]: v }));
  }, []);

  const model = useMemo(() => runModel(params, months), [params, months]);

  const sliders: { key: keyof Baseline; label: string; format: (v: number) => string }[] = [
    { key: "monthlyCustomerGrowthRate", label: "Monthly customer growth", format: (v) => `${(v * 100).toFixed(1)}%` },
    { key: "arpa", label: "ARPA / month", format: (v) => fmt(v) },
    { key: "cogsPercent", label: "COGS % of revenue", format: (v) => `${(v * 100).toFixed(0)}%` },
    { key: "monthlyFixedOpex", label: "Monthly fixed OpEx", format: (v) => fmt(v) },
    { key: "monthlyMarketingSpend", label: "Monthly marketing", format: (v) => fmt(v) },
    { key: "startingCash", label: "Starting cash", format: (v) => fmt(v) },
  ];

  const lastBurn = model.monthly[model.monthly.length - 1]?.burn ?? 0;

  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">Financial projections ({years}-year)</h2>
          <p className="text-sm text-muted-foreground">Revenue, burn rate, cash runway, and break-even — adjust assumptions for investor meetings</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-xs text-muted-foreground">Y{years} revenue</p>
          <p className="text-xl font-bold">{fmt(model.yearly[model.yearly.length - 1]?.revenue ?? 0)}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><Flame className="w-3 h-3" /> Monthly burn (latest)</p>
          <p className="text-xl font-bold">{fmt(lastBurn)}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-xs text-muted-foreground">Cash runway</p>
          <p className="text-xl font-bold">
            {model.runwayMonths === null ? "Profitable / N/A" : model.runwayMonths === 0 ? "Out of cash" : `~${model.runwayMonths} mo`}
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><Target className="w-3 h-3" /> Break-even</p>
          <p className="text-xl font-bold">{model.breakEvenMonth ? `Month ${model.breakEvenMonth}` : "Not in horizon"}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-5">
          <h3 className="font-semibold text-sm">Editable assumptions</h3>
          {sliders.map(({ key, label, format }) => {
            const r = ranges[key] || { min: 0, max: Math.max(params[key] * 2, 1), step: 1 };
            return (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{label}</span>
                  <span className="font-mono text-muted-foreground">{format(params[key])}</span>
                </div>
                <Slider
                  value={[params[key]]}
                  min={r.min}
                  max={r.max}
                  step={r.step}
                  onValueChange={([v]) => set(key, v)}
                />
              </div>
            );
          })}
        </div>
        <div className="h-64">
          <h3 className="font-semibold text-sm mb-2">Cash balance</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={model.monthly.filter((_, i) => i % 3 === 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickFormatter={(m) => `M${m}`} />
              <YAxis tickFormatter={(v) => fmt(v)} width={56} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Line type="monotone" dataKey="cash" stroke="#6366f1" strokeWidth={2} dot={false} name="Cash" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="h-56 mb-6">
        <h3 className="font-semibold text-sm mb-2">Annual revenue vs net burn</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={model.yearly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(v) => fmt(v)} width={56} />
            <Tooltip formatter={(v: number) => fmt(v)} />
            <Legend />
            <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
            <Bar dataKey="burn" fill="#f43f5e" name="Net burn" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {data.assumptions && data.assumptions.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-sm mb-2">Key assumptions</h3>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            {data.assumptions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}
      {data.investorNotes && (
        <p className="text-sm border-l-4 border-indigo-400 pl-3 text-muted-foreground">{data.investorNotes}</p>
      )}
    </Card>
  );
}
