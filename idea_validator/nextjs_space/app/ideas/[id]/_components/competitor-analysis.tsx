'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';

interface Competitor {
  name?: string;
  description?: string;
  features?: string[];
  positioning?: string;
  strengths?: string[];
  weaknesses?: string[];
}

interface CompetitorData {
  competitors?: Competitor[];
  marketInsights?: string;
  competitiveAdvantages?: string[];
}

interface CompetitorAnalysisProps {
  data: CompetitorData;
}

export default function CompetitorAnalysis({ data }: CompetitorAnalysisProps) {
  const competitors = data?.competitors || [];

  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-lg">
          <BarChart3 className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="font-display text-2xl font-bold">Competitor Analysis</h2>
      </div>

      <p className="text-muted-foreground mb-6">Market competitors and competitive landscape analysis for your idea.</p>

      {competitors?.length > 0 ? (
        <>
          <div className="space-y-6 mb-8">
            {competitors.map((comp: Competitor, idx: number) => (
              <div key={idx} className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="mb-4">
                  <h4 className="font-semibold text-xl mb-2">{comp.name || `Competitor ${idx + 1}`}</h4>
                  {comp.description && <p className="text-sm text-muted-foreground">{comp.description}</p>}
                </div>

                {comp.positioning && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Market Positioning</p>
                    <p className="text-sm">{comp.positioning}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {comp.features && comp.features.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Key Features</p>
                      <ul className="space-y-1">
                        {comp.features.slice(0, 3).map((feat: string, fIdx: number) => (
                          <li key={fIdx} className="text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {comp.strengths && comp.strengths.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-green-700 mb-2">Strengths</p>
                      <ul className="space-y-1">
                        {comp.strengths.slice(0, 3).map((str: string, sIdx: number) => (
                          <li key={sIdx} className="text-sm text-green-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                            {str}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {comp.weaknesses && comp.weaknesses.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-red-700 mb-2">Weaknesses (Your Opportunity)</p>
                    <ul className="space-y-1">
                      {comp.weaknesses.slice(0, 2).map((weak: string, wIdx: number) => (
                        <li key={wIdx} className="text-sm text-red-700 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          {weak}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {data?.competitiveAdvantages && data.competitiveAdvantages.length > 0 && (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
              <h4 className="font-semibold text-lg mb-4 text-emerald-900">Your Competitive Advantages</h4>
              <ul className="space-y-2">
                {data.competitiveAdvantages.map((adv: string, idx: number) => (
                  <li key={idx} className="text-sm text-emerald-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    {adv}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="text-muted-foreground italic">Competitor analysis will be generated when you click "Analyze Competitors"</p>
      )}
    </Card>
  );
}
