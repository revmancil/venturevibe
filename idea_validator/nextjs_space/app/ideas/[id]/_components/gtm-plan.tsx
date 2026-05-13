'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket } from 'lucide-react';

interface Task { task: string; priority: string; channel: string; }
interface Phase { name: string; goal: string; tasks: Task[]; milestone: string; }
interface Channel { name: string; priority: string; reasoning: string; }
interface GtmData {
  phases?: Phase[];
  channels?: Channel[];
  first100Customers?: string;
  keyMetrics?: string[];
}

const priorityColor: Record<string, string> = { high: 'bg-red-100 text-red-700', medium: 'bg-amber-100 text-amber-700', low: 'bg-gray-100 text-gray-700' };
const phaseColors = ['bg-blue-50 border-blue-200', 'bg-purple-50 border-purple-200', 'bg-emerald-50 border-emerald-200'];

export default function GtmPlan({ data }: { data: GtmData }) {
  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-100 rounded-lg"><Rocket className="w-6 h-6 text-orange-600" /></div>
        <h2 className="font-display text-2xl font-bold">Go-To-Market Plan</h2>
      </div>

      {data?.phases && data.phases.length > 0 && (
        <div className="space-y-6 mb-8">
          {data.phases.map((phase, pi) => (
            <div key={pi} className={`p-6 rounded-lg border ${phaseColors[pi] || phaseColors[0]}`}>
              <h3 className="font-semibold text-lg mb-1">{phase.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">🎯 {phase.goal}</p>
              <div className="space-y-2 mb-4">
                {phase.tasks?.map((t, ti) => (
                  <div key={ti} className="flex items-center justify-between bg-white/80 p-3 rounded-lg text-sm">
                    <span className="flex-1">{t.task}</span>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge className={`text-xs ${priorityColor[t.priority] || priorityColor.medium}`}>{t.priority}</Badge>
                      <span className="text-xs text-muted-foreground">{t.channel}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium">📌 Milestone: {phase.milestone}</p>
            </div>
          ))}
        </div>
      )}

      {data?.channels && data.channels.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Marketing Channels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.channels.map((ch, i) => (
              <div key={i} className="p-3 bg-gray-50 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{ch.name}</span>
                  <Badge variant="secondary" className="text-xs capitalize">{ch.priority}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{ch.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.first100Customers && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg mb-6">
          <p className="font-semibold text-orange-900">🎯 First 100 Customers Strategy</p>
          <p className="text-sm text-orange-700 mt-1">{data.first100Customers}</p>
        </div>
      )}

      {data?.keyMetrics && data.keyMetrics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium mr-2">Key Metrics:</span>
          {data.keyMetrics.map((m, i) => <Badge key={i} variant="secondary" className="text-xs">{m}</Badge>)}
        </div>
      )}
    </Card>
  );
}
