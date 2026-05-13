'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Pitch {
  type: string;
  label: string;
  pitch: string;
}
interface ElevatorPitchData {
  pitches?: Pitch[];
  tipsForDelivery?: string[];
}

const typeEmoji: Record<string, string> = {
  'one-liner': '💥',
  elevator: '🚶',
  investor: '💼',
  storytelling: '📖',
  tweet: '🐦',
};

export default function ElevatorPitchDisplay({ data }: { data: ElevatorPitchData }) {
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-sky-100 rounded-lg"><Mic className="w-6 h-6 text-sky-600" /></div>
        <h2 className="font-display text-2xl font-bold">Elevator Pitches</h2>
      </div>

      {data?.pitches && data.pitches.length > 0 && (
        <div className="space-y-4 mb-6">
          {data.pitches.map((p, i) => (
            <div key={i} className="p-5 bg-sky-50 border border-sky-200 rounded-lg group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{typeEmoji[p.type] || '💬'}</span>
                  <Badge variant="secondary" className="text-xs">{p.label}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleCopy(p.pitch, i)}
                >
                  {copied === i ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{p.pitch}</p>
            </div>
          ))}
        </div>
      )}

      {data?.tipsForDelivery && data.tipsForDelivery.length > 0 && (
        <div className="p-4 bg-gray-50 border rounded-lg">
          <h4 className="font-semibold mb-2">🎯 Tips for Delivery</h4>
          <ul className="space-y-1">
            {data.tipsForDelivery.map((tip, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />{tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
