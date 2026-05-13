'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface Persona {
  name: string; age?: string; occupation?: string; income?: string; location?: string;
  bio?: string; goals?: string[]; painPoints?: string[]; motivations?: string[];
  objections?: string[]; channels?: string[]; quote?: string;
}
interface PersonasData {
  personas?: Persona[];
  commonThemes?: string[];
  acquisitionStrategy?: string;
}

const avatarColors = ['bg-pink-100 text-pink-600', 'bg-cyan-100 text-cyan-600', 'bg-amber-100 text-amber-600'];

export default function CustomerPersonas({ data }: { data: PersonasData }) {
  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-pink-100 rounded-lg"><Users className="w-6 h-6 text-pink-600" /></div>
        <h2 className="font-display text-2xl font-bold">Customer Personas</h2>
      </div>

      {data?.personas && data.personas.length > 0 && (
        <div className="space-y-6 mb-8">
          {data.personas.map((p, i) => (
            <div key={i} className="p-6 bg-gray-50 border rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${avatarColors[i % avatarColors.length]}`}>
                  {p.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{p.name}</h4>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {p.occupation && <span>{p.occupation}</span>}
                    {p.age && <span>• {p.age}</span>}
                    {p.location && <span>• {p.location}</span>}
                    {p.income && <span>• {p.income}</span>}
                  </div>
                </div>
              </div>

              {p.bio && <p className="text-sm text-muted-foreground mb-4">{p.bio}</p>}

              {p.quote && (
                <blockquote className="border-l-4 border-pink-300 pl-4 italic text-sm text-muted-foreground mb-4">
                  "{p.quote}"
                </blockquote>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {p.goals && p.goals.length > 0 && (
                  <div><p className="text-xs font-semibold text-emerald-700 mb-1">🎯 Goals</p>
                    <ul className="space-y-1">{p.goals.map((g, gi) => <li key={gi} className="text-xs text-emerald-600">{g}</li>)}</ul>
                  </div>
                )}
                {p.painPoints && p.painPoints.length > 0 && (
                  <div><p className="text-xs font-semibold text-red-700 mb-1">😩 Pain Points</p>
                    <ul className="space-y-1">{p.painPoints.map((pp, pi) => <li key={pi} className="text-xs text-red-600">{pp}</li>)}</ul>
                  </div>
                )}
                {p.channels && p.channels.length > 0 && (
                  <div><p className="text-xs font-semibold text-blue-700 mb-1">📍 Where to Find Them</p>
                    <div className="flex flex-wrap gap-1">{p.channels.map((ch, ci) => <Badge key={ci} variant="secondary" className="text-xs">{ch}</Badge>)}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {data?.acquisitionStrategy && (
        <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
          <p className="font-semibold text-pink-900">🎯 Acquisition Strategy</p>
          <p className="text-sm text-pink-700 mt-1">{data.acquisitionStrategy}</p>
        </div>
      )}
    </Card>
  );
}
