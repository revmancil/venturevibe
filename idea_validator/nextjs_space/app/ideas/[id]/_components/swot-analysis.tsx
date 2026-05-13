'use client';

import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface SwotItem { title: string; description: string; }
interface SwotData {
  strengths?: SwotItem[];
  weaknesses?: SwotItem[];
  opportunities?: SwotItem[];
  threats?: SwotItem[];
  strategicInsight?: string;
}

const quadrants = [
  { key: 'strengths' as const, label: 'Strengths', emoji: '💪', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', title: 'text-emerald-900' },
  { key: 'weaknesses' as const, label: 'Weaknesses', emoji: '⚠️', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', title: 'text-red-900' },
  { key: 'opportunities' as const, label: 'Opportunities', emoji: '🚀', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', title: 'text-blue-900' },
  { key: 'threats' as const, label: 'Threats', emoji: '🔥', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', title: 'text-amber-900' },
];

export default function SwotAnalysis({ data }: { data: SwotData }) {
  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-teal-100 rounded-lg"><Shield className="w-6 h-6 text-teal-600" /></div>
        <h2 className="font-display text-2xl font-bold">SWOT Analysis</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {quadrants.map((q) => (
          <div key={q.key} className={`p-5 ${q.bg} border ${q.border} rounded-lg`}>
            <h4 className={`font-semibold text-lg mb-3 ${q.title}`}>{q.emoji} {q.label}</h4>
            <ul className="space-y-3">
              {(data?.[q.key] || []).map((item: SwotItem, i: number) => (
                <li key={i}>
                  <p className={`font-medium text-sm ${q.title}`}>{item.title}</p>
                  <p className={`text-xs mt-0.5 ${q.text}`}>{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {data?.strategicInsight && (
        <div className="p-4 bg-gray-50 border rounded-lg">
          <p className="font-semibold mb-1">🧭 Strategic Insight</p>
          <p className="text-sm text-muted-foreground">{data.strategicInsight}</p>
        </div>
      )}
    </Card>
  );
}
