'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link2, Share2, Target } from 'lucide-react';
import {
  buildValidationScoreTweet,
  getShareableResultsUrl,
  twitterIntentUrl,
} from '@/lib/share-validation-score';

interface ScoreData {
  score?: number;
  grade?: string;
  summary?: string;
  dimensions?: Array<{ name: string; score: number; reasoning: string }>;
  topStrengths?: string[];
  topConcerns?: string[];
  verdict?: string;
}

type ValidationScoreProps = {
  data: ScoreData;
  ideaId: string;
  ideaTitle: string;
};

export default function ValidationScore({ data, ideaId, ideaTitle }: ValidationScoreProps) {
  const score = data?.score ?? 0;

  const handleShareScore = () => {
    const url = twitterIntentUrl(buildValidationScoreTweet(score, ideaTitle));
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    const url = getShareableResultsUrl(ideaId);
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
  };
  const gradeColor = score >= 80 ? 'text-emerald-600 bg-emerald-100' : score >= 60 ? 'text-blue-600 bg-blue-100' : score >= 40 ? 'text-amber-600 bg-amber-100' : 'text-red-600 bg-red-100';
  const barColor = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-blue-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 rounded-lg"><Target className="w-6 h-6 text-indigo-600" /></div>
        <h2 className="font-display text-2xl font-bold">Validation Score</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border min-w-[180px]">
          <span className="font-display text-6xl font-extrabold">{score}</span>
          <span className="text-sm text-muted-foreground mt-1">out of 100</span>
          {data?.grade && <Badge className={`mt-3 text-lg px-4 py-1 ${gradeColor}`}>{data.grade}</Badge>}
        </div>
        <div className="flex-1">
          {data?.summary && <p className="text-lg text-muted-foreground mb-4">{data.summary}</p>}
          {data?.verdict && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <p className="font-semibold text-indigo-900">🎯 Verdict</p>
              <p className="text-sm text-indigo-700 mt-1">{data.verdict}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="outline" size="sm" onClick={handleShareScore}>
          <Share2 className="mr-2 h-4 w-4" />
          Share your score
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleCopyLink}>
          <Link2 className="mr-2 h-4 w-4" />
          Copy link
        </Button>
      </div>

      {data?.dimensions && data.dimensions.length > 0 && (
        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-lg">Score Breakdown</h3>
          {data.dimensions.map((d, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{d.name}</span>
                <span className="font-semibold">{d.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div className={`h-2.5 rounded-full ${barColor} transition-all`} style={{ width: `${d.score}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{d.reasoning}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.topStrengths && data.topStrengths.length > 0 && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <h4 className="font-semibold text-emerald-900 mb-3">💪 Top Strengths</h4>
            <ul className="space-y-2">{data.topStrengths.map((s, i) => (
              <li key={i} className="text-sm text-emerald-700 flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />{s}</li>
            ))}</ul>
          </div>
        )}
        {data?.topConcerns && data.topConcerns.length > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-900 mb-3">⚠️ Top Concerns</h4>
            <ul className="space-y-2">{data.topConcerns.map((c, i) => (
              <li key={i} className="text-sm text-amber-700 flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />{c}</li>
            ))}</ul>
          </div>
        )}
      </div>
    </Card>
  );
}
