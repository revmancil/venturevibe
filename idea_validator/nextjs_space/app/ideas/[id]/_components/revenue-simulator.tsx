'use client';

import { useCallback, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { DollarSign, RotateCcw, Info, Save, GitCompareArrows, Trash2, X } from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

interface Range { min: number; max: number; step: number }
interface Params {
  pricePerCustomer: number;
  monthlyVisitors: number;
  visitorToSignupRate: number;
  signupToPaidRate: number;
  monthlyChurnRate: number;
  variableCostPerCustomer: number;
  monthlyFixedCosts: number;
}
interface RevenueSimData {
  businessModel?: string;
  baseline?: Params;
  ranges?: Record<string, Range>;
  assumptions?: string[];
  benchmarks?: { industry?: string; typicalConversion?: string; typicalChurn?: string; typicalCAC?: string };
}

interface SavedScenario {
  name: string;
  params: Params;
  color: string;
}

interface Props { data: RevenueSimData }

const fmt = (n: number) => {
  if (!isFinite(n)) return '$0';
  const abs = Math.abs(n);
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${Math.round(n).toLocaleString()}`;
};

function runProjection(p: Params) {
  const newPaidPerMonth = p.monthlyVisitors * p.visitorToSignupRate * p.signupToPaidRate;
  const rows: { month: string; customers: number; mrr: number; revenue: number; costs: number; profit: number; cumulativeProfit: number }[] = [];
  let customers = 0;
  let cumulativeProfit = 0;
  for (let i = 1; i <= 24; i++) {
    customers = customers * (1 - p.monthlyChurnRate) + newPaidPerMonth;
    const mrr = customers * p.pricePerCustomer;
    const revenue = mrr;
    const costs = customers * p.variableCostPerCustomer + p.monthlyFixedCosts;
    const profit = revenue - costs;
    cumulativeProfit += profit;
    rows.push({ month: `M${i}`, customers: Math.round(customers), mrr: Math.round(mrr), revenue: Math.round(revenue), costs: Math.round(costs), profit: Math.round(profit), cumulativeProfit: Math.round(cumulativeProfit) });
  }
  const last = rows[rows.length - 1];
  const month12 = rows[11];
  const breakevenMonth = rows.findIndex(r => r.profit >= 0);
  return { rows, last, month12, breakevenMonth: breakevenMonth >= 0 ? breakevenMonth + 1 : null };
}

const SCENARIO_COLORS = ['#f59e0b', '#06b6d4', '#ec4899'];
const PRESET_NAMES = ['Conservative', 'Base (AI)', 'Aggressive'] as const;

export default function RevenueSimulator({ data }: Props) {
  const b: Params = data?.baseline || {
    pricePerCustomer: 29, monthlyVisitors: 2000, visitorToSignupRate: 0.05,
    signupToPaidRate: 0.10, monthlyChurnRate: 0.05, variableCostPerCustomer: 3, monthlyFixedCosts: 500,
  };
  const ranges = data?.ranges || {};

  // Derive presets from baseline
  const presets: Record<string, Params> = useMemo(() => ({
    'Conservative': {
      pricePerCustomer: Math.round(b.pricePerCustomer * 0.8),
      monthlyVisitors: Math.round(b.monthlyVisitors * 0.5),
      visitorToSignupRate: Math.round(b.visitorToSignupRate * 0.7 * 1000) / 1000,
      signupToPaidRate: Math.round(b.signupToPaidRate * 0.6 * 100) / 100,
      monthlyChurnRate: Math.round(Math.min(b.monthlyChurnRate * 1.5, 0.25) * 1000) / 1000,
      variableCostPerCustomer: Math.round(b.variableCostPerCustomer * 1.2),
      monthlyFixedCosts: Math.round(b.monthlyFixedCosts * 1.3),
    },
    'Base (AI)': { ...b },
    'Aggressive': {
      pricePerCustomer: Math.round(b.pricePerCustomer * 1.3),
      monthlyVisitors: Math.round(b.monthlyVisitors * 2),
      visitorToSignupRate: Math.round(Math.min(b.visitorToSignupRate * 1.4, 0.28) * 1000) / 1000,
      signupToPaidRate: Math.round(Math.min(b.signupToPaidRate * 1.5, 0.45) * 100) / 100,
      monthlyChurnRate: Math.round(b.monthlyChurnRate * 0.6 * 1000) / 1000,
      variableCostPerCustomer: Math.round(b.variableCostPerCustomer * 0.8),
      monthlyFixedCosts: Math.round(b.monthlyFixedCosts * 0.9),
    },
  }), [b]);

  const [params, setParams] = useState<Params>({ ...b });
  const [activePreset, setActivePreset] = useState<string | null>('Base (AI)');
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const setParam = useCallback((key: keyof Params, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
    setActivePreset(null);
  }, []);

  const applyPreset = (name: string) => {
    setParams({ ...presets[name] });
    setActivePreset(name);
  };

  const reset = () => applyPreset('Base (AI)');

  const saveScenario = () => {
    if (savedScenarios.length >= 3) return;
    const color = SCENARIO_COLORS[savedScenarios.length];
    const name = activePreset || `Scenario ${savedScenarios.length + 1}`;
    setSavedScenarios(prev => [...prev, { name, params: { ...params }, color }]);
  };

  const removeScenario = (index: number) => {
    setSavedScenarios(prev => prev.filter((_, i) => i !== index));
  };

  const projection = useMemo(() => runProjection(params), [params]);

  // Build comparison chart data
  const comparisonData = useMemo(() => {
    if (!showCompare || savedScenarios.length === 0) return null;
    const currentProj = runProjection(params);
    const scenarioProjs = savedScenarios.map(s => ({ name: s.name, proj: runProjection(s.params), color: s.color }));
    return currentProj.rows.map((row, i) => {
      const point: Record<string, any> = { month: row.month, 'Current': row.mrr };
      scenarioProjs.forEach(sp => { point[sp.name] = sp.proj.rows[i].mrr; });
      return point;
    });
  }, [showCompare, savedScenarios, params]);

  const r = (k: string, fb: Range): Range => (ranges[k] as Range) || fb;

  const sliders: Array<{ key: keyof Params; label: string; range: Range; format: (n: number) => string }> = [
    { key: 'pricePerCustomer', label: 'Price per customer (monthly)', range: r('pricePerCustomer', { min: 5, max: 500, step: 1 }), format: (n) => `$${n}` },
    { key: 'monthlyVisitors', label: 'Monthly website visitors', range: r('monthlyVisitors', { min: 100, max: 50000, step: 100 }), format: (n) => n.toLocaleString() },
    { key: 'visitorToSignupRate', label: 'Visitor \u2192 signup rate', range: r('visitorToSignupRate', { min: 0.005, max: 0.30, step: 0.005 }), format: (n) => `${(n * 100).toFixed(1)}%` },
    { key: 'signupToPaidRate', label: 'Signup \u2192 paid conversion', range: r('signupToPaidRate', { min: 0.01, max: 0.50, step: 0.01 }), format: (n) => `${(n * 100).toFixed(0)}%` },
    { key: 'monthlyChurnRate', label: 'Monthly churn rate', range: r('monthlyChurnRate', { min: 0.005, max: 0.30, step: 0.005 }), format: (n) => `${(n * 100).toFixed(1)}%` },
    { key: 'variableCostPerCustomer', label: 'Variable cost per customer', range: r('variableCostPerCustomer', { min: 0, max: 100, step: 1 }), format: (n) => `$${n}` },
    { key: 'monthlyFixedCosts', label: 'Monthly fixed costs', range: r('monthlyFixedCosts', { min: 0, max: 50000, step: 100 }), format: (n) => `$${n.toLocaleString()}` },
  ];

  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Revenue Simulator</h2>
            <p className="text-sm text-muted-foreground">Interactive 24-month financial projection</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-1.5" /> Reset
          </Button>
        </div>
      </div>

      {/* Scenario presets */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Scenario Presets</h3>
          <div className="flex items-center gap-2">
            {savedScenarios.length > 0 && (
              <Button
                variant={showCompare ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowCompare(!showCompare)}
                className={showCompare ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}
              >
                <GitCompareArrows className="w-4 h-4 mr-1.5" />
                {showCompare ? 'Hide Compare' : 'Compare'}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={saveScenario} disabled={savedScenarios.length >= 3}>
              <Save className="w-4 h-4 mr-1.5" /> Save Current ({savedScenarios.length}/3)
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_NAMES.map((name) => (
            <Button
              key={name}
              variant={activePreset === name ? 'default' : 'outline'}
              size="sm"
              onClick={() => applyPreset(name)}
              className={activePreset === name
                ? name === 'Conservative' ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : name === 'Aggressive' ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
                : ''}
            >
              {name === 'Conservative' && '\u{1F6E1}\uFE0F '}
              {name === 'Aggressive' && '\u{1F680} '}
              {name === 'Base (AI)' && '\u{1F916} '}
              {name}
            </Button>
          ))}
        </div>
        {/* Saved scenarios chips */}
        {savedScenarios.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {savedScenarios.map((s, i) => (
              <Badge key={i} className="pl-3 pr-1 py-1 gap-1.5 text-xs" style={{ backgroundColor: s.color, color: '#fff' }}>
                {s.name} — MRR: {fmt(runProjection(s.params).month12.mrr)}
                <button onClick={() => removeScenario(i)} className="ml-1 hover:bg-white/20 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
          <p className="text-xs text-muted-foreground mb-1">MRR at Month 12</p>
          <p className="text-2xl font-bold text-green-700">{fmt(projection.month12.mrr)}</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
          <p className="text-xs text-muted-foreground mb-1">ARR at Month 12</p>
          <p className="text-2xl font-bold text-blue-700">{fmt(projection.month12.mrr * 12)}</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100">
          <p className="text-xs text-muted-foreground mb-1">Customers at Month 24</p>
          <p className="text-2xl font-bold text-purple-700">{projection.last.customers.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
          <p className="text-xs text-muted-foreground mb-1">Break-even</p>
          <p className="text-2xl font-bold text-amber-700">{projection.breakevenMonth ? `Month ${projection.breakevenMonth}` : 'Not in 24mo'}</p>
        </div>
      </div>

      {/* Main chart */}
      <div className="mb-8">
        <h3 className="font-semibold mb-3">Revenue & Profit Over Time</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projection.rows}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmt(v as number)} />
              <Tooltip formatter={(v: any) => fmt(Number(v))} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revGrad)" name="Revenue" />
              <Area type="monotone" dataKey="profit" stroke="#6366f1" fill="url(#profGrad)" name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenario comparison chart */}
      {showCompare && comparisonData && (
        <div className="mb-8">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <GitCompareArrows className="w-4 h-4" /> Scenario Comparison — MRR Over Time
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmt(v as number)} />
                <Tooltip formatter={(v: any) => fmt(Number(v))} />
                <Legend />
                <Line type="monotone" dataKey="Current" stroke="#10b981" strokeWidth={2.5} dot={false} />
                {savedScenarios.map((s) => (
                  <Line key={s.name} type="monotone" dataKey={s.name} stroke={s.color} strokeWidth={2} strokeDasharray="6 3" dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Comparison table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-semibold">Scenario</th>
                  <th className="text-right py-2 px-3 font-semibold">MRR (M12)</th>
                  <th className="text-right py-2 px-3 font-semibold">ARR (M12)</th>
                  <th className="text-right py-2 px-3 font-semibold">Customers (M24)</th>
                  <th className="text-right py-2 pl-3 font-semibold">Break-even</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-dashed">
                  <td className="py-2 pr-4 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#10b981' }} />
                    Current
                  </td>
                  <td className="text-right py-2 px-3 font-mono">{fmt(projection.month12.mrr)}</td>
                  <td className="text-right py-2 px-3 font-mono">{fmt(projection.month12.mrr * 12)}</td>
                  <td className="text-right py-2 px-3 font-mono">{projection.last.customers.toLocaleString()}</td>
                  <td className="text-right py-2 pl-3 font-mono">{projection.breakevenMonth ? `Month ${projection.breakevenMonth}` : '—'}</td>
                </tr>
                {savedScenarios.map((s) => {
                  const p = runProjection(s.params);
                  return (
                    <tr key={s.name} className="border-b border-dashed">
                      <td className="py-2 pr-4 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: s.color }} />
                        {s.name}
                      </td>
                      <td className="text-right py-2 px-3 font-mono">{fmt(p.month12.mrr)}</td>
                      <td className="text-right py-2 px-3 font-mono">{fmt(p.month12.mrr * 12)}</td>
                      <td className="text-right py-2 px-3 font-mono">{p.last.customers.toLocaleString()}</td>
                      <td className="text-right py-2 pl-3 font-mono">{p.breakevenMonth ? `Month ${p.breakevenMonth}` : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mb-6">
        {sliders.map((s) => (
          <div key={s.key}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">{s.label}</label>
              <span className="text-sm font-mono font-semibold text-green-700">{s.format(params[s.key])}</span>
            </div>
            <Slider
              value={[params[s.key]]}
              min={s.range.min}
              max={s.range.max}
              step={s.range.step}
              onValueChange={(v) => setParam(s.key, v[0])}
            />
          </div>
        ))}
      </div>

      {/* Benchmarks & assumptions */}
      {(data?.benchmarks || data?.assumptions) && (
        <div className="mt-6 p-5 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-start gap-2 mb-3">
            <Info className="w-4 h-4 text-slate-500 mt-0.5" />
            <h4 className="font-semibold text-sm">AI Assumptions & Industry Benchmarks</h4>
          </div>
          {data.benchmarks && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
              {data.benchmarks.industry && <p><span className="font-semibold text-foreground">Industry:</span> {data.benchmarks.industry}</p>}
              {data.benchmarks.typicalConversion && <p><span className="font-semibold text-foreground">Typical conversion:</span> {data.benchmarks.typicalConversion}</p>}
              {data.benchmarks.typicalChurn && <p><span className="font-semibold text-foreground">Typical churn:</span> {data.benchmarks.typicalChurn}</p>}
              {data.benchmarks.typicalCAC && <p><span className="font-semibold text-foreground">Typical CAC:</span> {data.benchmarks.typicalCAC}</p>}
            </div>
          )}
          {data.assumptions && data.assumptions.length > 0 && (
            <ul className="space-y-1 text-xs text-muted-foreground">
              {data.assumptions.map((a, i) => <li key={i}>\u2022 {a}</li>)}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}
