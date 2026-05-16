'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map } from 'lucide-react';

interface Point {
  name: string;
  x: number;
  y: number;
  note?: string;
}

interface PositioningMapData {
  xAxis?: { label: string; lowLabel: string; highLabel: string };
  yAxis?: { label: string; lowLabel: string; highLabel: string };
  startup?: Point;
  competitors?: Point[];
  whiteSpace?: string;
  quadrantInsights?: Record<string, string>;
  strategicRecommendation?: string;
}

function Dot({ point, highlight }: { point: Point; highlight?: boolean }) {
  const left = `${Math.min(96, Math.max(4, point.x * 100))}%`;
  const bottom = `${Math.min(96, Math.max(4, point.y * 100))}%`;
  return (
    <div
      className="absolute -translate-x-1/2 translate-y-1/2 group"
      style={{ left, bottom }}
      title={point.note}
    >
      <div
        className={`w-3 h-3 rounded-full border-2 shadow-sm ${
          highlight ? 'bg-indigo-600 border-white ring-2 ring-indigo-300' : 'bg-slate-500 border-white'
        }`}
      />
      <span
        className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium mt-1 px-1 rounded ${
          highlight ? 'text-indigo-700 bg-indigo-50' : 'text-slate-600 bg-white/90'
        }`}
        style={{ top: '100%' }}
      >
        {point.name}
      </span>
    </div>
  );
}

export default function CompetitivePositioningMap({ data }: { data: PositioningMapData }) {
  const x = data?.xAxis;
  const y = data?.yAxis;
  const startup = data?.startup;
  const competitors = data?.competitors || [];

  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-100 rounded-lg">
          <Map className="w-6 h-6 text-cyan-600" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">Competitive positioning map</h2>
          <p className="text-sm text-muted-foreground">
            2×2 view of where you sit vs competitors on the dimensions investors care about
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-square max-w-lg mx-auto border-2 border-dashed border-border rounded-xl bg-gradient-to-tr from-slate-50 to-white overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="border-r border-b border-border/40" />
              <div className="border-b border-border/40" />
              <div className="border-r border-border/40" />
              <div />
            </div>
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />

            <span className="absolute left-2 top-2 text-[10px] text-muted-foreground font-medium">
              {y?.highLabel || 'High'} ↑
            </span>
            <span className="absolute left-2 bottom-2 text-[10px] text-muted-foreground">
              {y?.lowLabel || 'Low'}
            </span>
            <span className="absolute right-2 bottom-2 text-[10px] text-muted-foreground">
              {x?.highLabel || 'High'} →
            </span>
            <span className="absolute left-2 bottom-8 text-[10px] text-muted-foreground -rotate-0">
              ← {x?.lowLabel || 'Low'}
            </span>

            <p className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-semibold text-muted-foreground">
              {x?.label || 'X axis'}
            </p>
            <p
              className="absolute left-1 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground -rotate-90 origin-left"
              style={{ writingMode: 'vertical-rl' }}
            >
              {y?.label || 'Y axis'}
            </p>

            {competitors.map((c, i) => (
              <Dot key={i} point={c} />
            ))}
            {startup && <Dot point={startup} highlight />}
          </div>
          {startup && (
            <p className="text-center text-sm mt-3">
              <Badge className="bg-indigo-100 text-indigo-800">You: {startup.name}</Badge>
            </p>
          )}
        </div>

        <div className="space-y-4 text-sm">
          {data?.whiteSpace && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
              <h4 className="font-semibold text-emerald-900 mb-1">White space</h4>
              <p className="text-emerald-800">{data.whiteSpace}</p>
            </div>
          )}
          {data?.strategicRecommendation && (
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
              <h4 className="font-semibold text-indigo-900 mb-1">Strategy</h4>
              <p className="text-indigo-800">{data.strategicRecommendation}</p>
            </div>
          )}
          {competitors.some((c) => c.note) && (
            <div>
              <h4 className="font-semibold mb-2">Competitor notes</h4>
              <ul className="space-y-2 text-muted-foreground">
                {competitors.filter((c) => c.note).map((c, i) => (
                  <li key={i}><span className="font-medium text-foreground">{c.name}:</span> {c.note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {data?.quadrantInsights && Object.keys(data.quadrantInsights).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
          {Object.entries(data.quadrantInsights).map(([key, insight]) => (
            <div key={key} className="p-3 rounded-lg border border-border/50 bg-muted/30 text-sm">
              <p className="font-semibold capitalize mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
              <p className="text-muted-foreground">{insight}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
