'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Banknote, CheckCircle2, AlertTriangle, ListChecks } from 'lucide-react';

interface Dimension {
  id: string;
  name: string;
  score: number;
  weight?: number;
  summary?: string;
  signals?: string[];
}

interface FundingReadinessData {
  overallScore?: number;
  readinessLevel?: string;
  dimensions?: Dimension[];
  topStrengths?: string[];
  criticalGaps?: string[];
  meetingPrepChecklist?: string[];
  estimatedMonthsToInvestorReady?: number;
}

function scoreColor(score: number) {
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 55) return 'bg-blue-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

function levelBadge(level?: string) {
  const l = (level || '').toLowerCase();
  if (l.includes('investor ready')) return 'bg-emerald-100 text-emerald-800';
  if (l.includes('approaching')) return 'bg-blue-100 text-blue-800';
  if (l.includes('early')) return 'bg-amber-100 text-amber-800';
  return 'bg-gray-100 text-gray-700';
}

export default function FundingReadinessScore({ data }: { data: FundingReadinessData }) {
  const score = data?.overallScore ?? 0;
  const dimensions = data?.dimensions || [];

  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-100 rounded-lg">
          <Banknote className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">Funding readiness score</h2>
          <p className="text-sm text-muted-foreground">
            How investor-ready your idea looks on traction, market, team, defensibility, and narrative
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border min-w-[180px]">
          <span className="font-display text-6xl font-extrabold">{score}</span>
          <span className="text-sm text-muted-foreground mt-1">readiness / 100</span>
          {data?.readinessLevel && (
            <Badge className={`mt-3 text-sm px-3 py-1 ${levelBadge(data.readinessLevel)}`}>
              {data.readinessLevel}
            </Badge>
          )}
          {data?.estimatedMonthsToInvestorReady != null && (
            <p className="text-xs text-muted-foreground mt-3 text-center">
              ~{data.estimatedMonthsToInvestorReady} months to investor-ready (estimate)
            </p>
          )}
        </div>
        <div className="flex-1 space-y-4">
          {dimensions.map((d) => (
            <div key={d.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{d.name}</span>
                <span className="font-semibold">{d.score}/100{d.weight ? ` · ${d.weight}% weight` : ''}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div
                  className={`h-2.5 rounded-full ${scoreColor(d.score)}`}
                  style={{ width: `${Math.min(100, Math.max(0, d.score))}%` }}
                />
              </div>
              {d.summary && <p className="text-xs text-muted-foreground mb-1">{d.summary}</p>}
              {d.signals && d.signals.length > 0 && (
                <ul className="text-xs text-muted-foreground space-y-0.5 pl-3">
                  {d.signals.map((s, i) => (
                    <li key={i} className="list-disc">{s}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {data?.topStrengths && data.topStrengths.length > 0 && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <h4 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Top strengths
            </h4>
            <ul className="space-y-2">
              {data.topStrengths.map((s, i) => (
                <li key={i} className="text-sm text-emerald-800">{s}</li>
              ))}
            </ul>
          </div>
        )}
        {data?.criticalGaps && data.criticalGaps.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Critical gaps
            </h4>
            <ul className="space-y-2">
              {data.criticalGaps.map((g, i) => (
                <li key={i} className="text-sm text-red-800">{g}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {data?.meetingPrepChecklist && data.meetingPrepChecklist.length > 0 && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
            <ListChecks className="w-4 h-4" /> Before your investor meeting
          </h4>
          <ol className="space-y-2 list-decimal pl-5">
            {data.meetingPrepChecklist.map((item, i) => (
              <li key={i} className="text-sm text-indigo-800">{item}</li>
            ))}
          </ol>
        </div>
      )}
    </Card>
  );
}
