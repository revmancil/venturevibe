'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers } from 'lucide-react';

interface MustHave { feature: string; description: string; effort: string; impact: string; reasoning: string; }
interface NiceToHave { feature: string; description: string; effort: string; phase: string; }
interface MvpData {
  mvpVision?: string;
  coreProblem?: string;
  mustHave?: MustHave[];
  niceToHave?: NiceToHave[];
  techStack?: string[];
  estimatedTimeline?: string;
  launchChecklist?: string[];
}

const effortColor: Record<string, string> = { low: 'bg-emerald-100 text-emerald-700', medium: 'bg-amber-100 text-amber-700', high: 'bg-red-100 text-red-700' };

export default function MvpFeatures({ data }: { data: MvpData }) {
  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-violet-100 rounded-lg"><Layers className="w-6 h-6 text-violet-600" /></div>
        <h2 className="font-display text-2xl font-bold">MVP Features</h2>
      </div>

      {data?.mvpVision && <p className="text-lg font-medium mb-2">{data.mvpVision}</p>}
      {data?.coreProblem && <p className="text-sm text-muted-foreground mb-6">Core Problem: {data.coreProblem}</p>}

      {data?.mustHave && data.mustHave.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">🏗️ Must-Have Features</h3>
          <div className="space-y-3">
            {data.mustHave.map((f, i) => (
              <div key={i} className="p-4 bg-violet-50 border border-violet-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{f.feature}</h4>
                  <div className="flex gap-2">
                    <Badge className={`text-xs ${effortColor[f.effort] || effortColor.medium}`}>Effort: {f.effort}</Badge>
                    <Badge variant="secondary" className="text-xs">Impact: {f.impact}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{f.description}</p>
                <p className="text-xs text-violet-600 mt-1">💡 {f.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.niceToHave && data.niceToHave.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">✨ Nice-To-Have (Post-MVP)</h3>
          <div className="space-y-2">
            {data.niceToHave.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg text-sm">
                <div className="flex-1"><span className="font-medium">{f.feature}</span> — <span className="text-muted-foreground">{f.description}</span></div>
                <Badge variant="secondary" className="text-xs ml-2">{f.phase}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.techStack && data.techStack.length > 0 && (
          <div className="p-4 bg-gray-50 border rounded-lg">
            <h4 className="font-semibold mb-2">🛠️ Recommended Tech Stack</h4>
            <div className="flex flex-wrap gap-2">{data.techStack.map((t, i) => <Badge key={i} variant="secondary">{t}</Badge>)}</div>
          </div>
        )}
        <div className="p-4 bg-gray-50 border rounded-lg">
          {data?.estimatedTimeline && (
            <div className="mb-3"><h4 className="font-semibold mb-1">⏱️ Estimated Timeline</h4><p className="text-sm">{data.estimatedTimeline}</p></div>
          )}
          {data?.launchChecklist && data.launchChecklist.length > 0 && (
            <div><h4 className="font-semibold mb-1">✅ Launch Checklist</h4>
              <ul className="space-y-1">{data.launchChecklist.map((item, i) => (
                <li key={i} className="text-sm flex items-center gap-2"><span className="w-3 h-3 rounded border-2 border-gray-300" />{item}</li>
              ))}</ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
