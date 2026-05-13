'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface Risk { risk: string; impact: string; likelihood: string; mitigation: string; }
interface Category { category: string; level: string; risks: Risk[]; }
interface RiskData {
  overallRiskLevel?: string;
  riskScore?: number;
  categories?: Category[];
  topRisks?: string[];
  mitigationPlan?: string;
}

const levelColor: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
  critical: 'bg-red-200 text-red-800',
};

export default function RiskAssessment({ data }: { data: RiskData }) {
  const score = data?.riskScore ?? 0;
  const riskBarColor = score <= 30 ? 'bg-emerald-500' : score <= 60 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-100 rounded-lg"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
        <h2 className="font-display text-2xl font-bold">Risk Assessment</h2>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <div className="text-center">
          <p className="font-display text-4xl font-bold">{score}</p>
          <p className="text-xs text-muted-foreground">Risk Score</p>
        </div>
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className={`h-3 rounded-full ${riskBarColor} transition-all`} style={{ width: `${score}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Low Risk</span><span>High Risk</span>
          </div>
        </div>
        {data?.overallRiskLevel && <Badge className={`text-sm capitalize ${levelColor[data.overallRiskLevel] || levelColor.medium}`}>{data.overallRiskLevel}</Badge>}
      </div>

      {data?.categories && data.categories.length > 0 && (
        <div className="space-y-6 mb-8">
          {data.categories.map((cat, ci) => (
            <div key={ci} className="p-5 bg-gray-50 border rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <h4 className="font-semibold text-lg">{cat.category}</h4>
                <Badge className={`text-xs capitalize ${levelColor[cat.level] || levelColor.medium}`}>{cat.level}</Badge>
              </div>
              <div className="space-y-3">
                {cat.risks?.map((r, ri) => (
                  <div key={ri} className="bg-white p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{r.risk}</span>
                      <div className="flex gap-1">
                        <Badge variant="secondary" className="text-xs">Impact: {r.impact}</Badge>
                        <Badge variant="secondary" className="text-xs">Likely: {r.likelihood}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-700">🛡️ Mitigation: {r.mitigation}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {data?.topRisks && data.topRisks.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <h4 className="font-semibold text-red-900 mb-2">🚨 Top Risks to Watch</h4>
          <ul className="space-y-1">{data.topRisks.map((r, i) => (
            <li key={i} className="text-sm text-red-700 flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />{r}</li>
          ))}</ul>
        </div>
      )}

      {data?.mitigationPlan && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="font-semibold text-emerald-900">🛡️ Overall Mitigation Strategy</p>
          <p className="text-sm text-emerald-700 mt-1">{data.mitigationPlan}</p>
        </div>
      )}
    </Card>
  );
}
