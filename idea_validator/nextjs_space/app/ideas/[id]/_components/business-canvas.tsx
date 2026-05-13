'use client';

import { Card } from '@/components/ui/card';
import { LayoutGrid } from 'lucide-react';

interface Block { items: string[]; notes?: string; }
interface CanvasData {
  blocks?: {
    keyPartners?: Block; keyActivities?: Block; keyResources?: Block;
    valuePropositions?: Block; customerRelationships?: Block; channels?: Block;
    customerSegments?: Block; costStructure?: Block; revenueStreams?: Block;
  };
  summary?: string;
}

const blockConfig = [
  { key: 'keyPartners', label: 'Key Partners', emoji: '🤝', span: 'md:col-span-1 md:row-span-2' },
  { key: 'keyActivities', label: 'Key Activities', emoji: '⚙️', span: 'md:col-span-1' },
  { key: 'valuePropositions', label: 'Value Propositions', emoji: '💎', span: 'md:col-span-1 md:row-span-2' },
  { key: 'customerRelationships', label: 'Customer Relationships', emoji: '💬', span: 'md:col-span-1' },
  { key: 'customerSegments', label: 'Customer Segments', emoji: '👥', span: 'md:col-span-1 md:row-span-2' },
  { key: 'keyResources', label: 'Key Resources', emoji: '🏗️', span: 'md:col-span-1' },
  { key: 'channels', label: 'Channels', emoji: '📢', span: 'md:col-span-1' },
  { key: 'costStructure', label: 'Cost Structure', emoji: '💰', span: 'md:col-span-2' },
  { key: 'revenueStreams', label: 'Revenue Streams', emoji: '💵', span: 'md:col-span-3' },
] as const;

const bgColors = ['bg-blue-50', 'bg-purple-50', 'bg-emerald-50', 'bg-pink-50', 'bg-amber-50', 'bg-cyan-50', 'bg-indigo-50', 'bg-red-50', 'bg-green-50'];

export default function BusinessCanvas({ data }: { data: CanvasData }) {
  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-100 rounded-lg"><LayoutGrid className="w-6 h-6 text-cyan-600" /></div>
        <h2 className="font-display text-2xl font-bold">Business Model Canvas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        {blockConfig.map((bc, i) => {
          const block = data?.blocks?.[bc.key as keyof typeof data.blocks];
          return (
            <div key={bc.key} className={`p-4 ${bgColors[i]} border rounded-lg ${bc.span}`}>
              <h4 className="font-semibold text-sm mb-2">{bc.emoji} {bc.label}</h4>
              <ul className="space-y-1">
                {block?.items?.map((item: string, ii: number) => (
                  <li key={ii} className="text-xs flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0" />{item}
                  </li>
                ))}
              </ul>
              {block?.notes && <p className="text-xs text-muted-foreground mt-2 italic">{block.notes}</p>}
            </div>
          );
        })}
      </div>

      {data?.summary && (
        <div className="p-4 bg-gray-50 border rounded-lg">
          <p className="font-semibold mb-1">📋 Business Model Summary</p>
          <p className="text-sm text-muted-foreground">{data.summary}</p>
        </div>
      )}
    </Card>
  );
}
