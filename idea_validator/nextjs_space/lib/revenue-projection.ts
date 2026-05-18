export interface Params {
  pricePerCustomer: number;
  monthlyVisitors: number;
  visitorToSignupRate: number;
  signupToPaidRate: number;
  monthlyChurnRate: number;
  variableCostPerCustomer: number;
  monthlyFixedCosts: number;
}

export const PRESET_NAMES = ['Conservative', 'Base (AI)', 'Aggressive'] as const;
export type PresetName = (typeof PRESET_NAMES)[number];

export const PRESET_COLORS: Record<(typeof PRESET_NAMES)[number], string> = {
  Conservative: '#f59e0b',
  'Base (AI)': '#10b981',
  Aggressive: '#ec4899',
};

export function fmt(n: number) {
  if (!isFinite(n)) return '$0';
  const abs = Math.abs(n);
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

export function runProjection(p: Params) {
  const newPaidPerMonth = p.monthlyVisitors * p.visitorToSignupRate * p.signupToPaidRate;
  const rows: {
    month: string;
    customers: number;
    mrr: number;
    revenue: number;
    costs: number;
    profit: number;
    cumulativeProfit: number;
  }[] = [];
  let customers = 0;
  let cumulativeProfit = 0;
  for (let i = 1; i <= 24; i++) {
    customers = customers * (1 - p.monthlyChurnRate) + newPaidPerMonth;
    const mrr = customers * p.pricePerCustomer;
    const revenue = mrr;
    const costs = customers * p.variableCostPerCustomer + p.monthlyFixedCosts;
    const profit = revenue - costs;
    cumulativeProfit += profit;
    rows.push({
      month: `M${i}`,
      customers: Math.round(customers),
      mrr: Math.round(mrr),
      revenue: Math.round(revenue),
      costs: Math.round(costs),
      profit: Math.round(profit),
      cumulativeProfit: Math.round(cumulativeProfit),
    });
  }
  const last = rows[rows.length - 1];
  const month12 = rows[11];
  const breakevenMonth = rows.findIndex((r) => r.profit >= 0);
  return {
    rows,
    last,
    month12,
    breakevenMonth: breakevenMonth >= 0 ? breakevenMonth + 1 : null,
  };
}

export function buildPresets(b: Params): Record<(typeof PRESET_NAMES)[number], Params> {
  return {
    Conservative: {
      pricePerCustomer: Math.round(b.pricePerCustomer * 0.8),
      monthlyVisitors: Math.round(b.monthlyVisitors * 0.5),
      visitorToSignupRate: Math.round(b.visitorToSignupRate * 0.7 * 1000) / 1000,
      signupToPaidRate: Math.round(b.signupToPaidRate * 0.6 * 100) / 100,
      monthlyChurnRate: Math.round(Math.min(b.monthlyChurnRate * 1.5, 0.25) * 1000) / 1000,
      variableCostPerCustomer: Math.round(b.variableCostPerCustomer * 1.2),
      monthlyFixedCosts: Math.round(b.monthlyFixedCosts * 1.3),
    },
    'Base (AI)': { ...b },
    Aggressive: {
      pricePerCustomer: Math.round(b.pricePerCustomer * 1.3),
      monthlyVisitors: Math.round(b.monthlyVisitors * 2),
      visitorToSignupRate: Math.round(Math.min(b.visitorToSignupRate * 1.4, 0.28) * 1000) / 1000,
      signupToPaidRate: Math.round(Math.min(b.signupToPaidRate * 1.5, 0.45) * 100) / 100,
      monthlyChurnRate: Math.round(b.monthlyChurnRate * 0.6 * 1000) / 1000,
      variableCostPerCustomer: Math.round(b.variableCostPerCustomer * 0.8),
      monthlyFixedCosts: Math.round(b.monthlyFixedCosts * 0.9),
    },
  };
}

export const DEFAULT_BASELINE: Params = {
  pricePerCustomer: 29,
  monthlyVisitors: 2000,
  visitorToSignupRate: 0.05,
  signupToPaidRate: 0.1,
  monthlyChurnRate: 0.05,
  variableCostPerCustomer: 3,
  monthlyFixedCosts: 500,
};
