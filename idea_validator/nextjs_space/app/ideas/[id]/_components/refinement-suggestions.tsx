'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface Suggestion {
  type: string;
  title: string;
  description: string;
  expectedImpact: string;
  effort: string;
  example: string;
}
interface RefinementData {
  currentAssessment?: string;
  suggestions?: Suggestion[];
  recommendedNext?: string;
}

const typeColor: Record<string, string> = {
  improve: 'bg-blue-100 text-blue-700',
  pivot: 'bg-purple-100 text-purple-700',
  expand: 'bg-emerald-100 text-emerald-700',
  narrow: 'bg-amber-100 text-amber-700',
  reposition: 'bg-pink-100 text-pink-700',
};

const effortColor: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

export default function RefinementSuggestions({ data }: { data: RefinementData }) {
  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-100 rounded-lg"><Sparkles className="w-6 h-6 text-yellow-600" /></div>
        <h2 className="font-display text-2xl font-bold">Idea Refinement Suggestions</h2>
      </div>

      {data?.currentAssessment && (
        <div className="p-4 bg-gray-50 border rounded-lg mb-6">
          <p className="text-sm text-muted-foreground">{data.currentAssessment}</p>
        </div>
      )}

      {data?.suggestions && data.suggestions.length > 0 && (
        <div className="space-y-4 mb-6">
          {data.suggestions.map((s, i) => (
            <div key={i} className="p-5 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`text-xs capitalize ${typeColor[s.type] || typeColor.improve}`}>{s.type}</Badge>
                <Badge className={`text-xs ${effortColor[s.effort] || effortColor.medium}`}>Effort: {s.effort}</Badge>
              </div>
              <h4 className="font-semibold text-lg mb-2">{s.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">🎯 Expected Impact</p>
                  <p className="text-sm text-emerald-600">{s.expectedImpact}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-xs font-semibold text-blue-700 mb-1">💡 Example</p>
                  <p className="text-sm text-blue-600">{s.example}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {data?.recommendedNext && (
        <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
          <p className="font-semibold text-yellow-900">🚀 Recommended Next Step</p>
          <p className="text-sm text-yellow-700 mt-1">{data.recommendedNext}</p>
        </div>
      )}
    </Card>
  );
}
