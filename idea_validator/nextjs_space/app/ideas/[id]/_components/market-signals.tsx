'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Radio, TrendingUp, TrendingDown, Minus, Calendar, Search, Newspaper, Banknote, Lightbulb, AlertOctagon, CheckSquare, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Trend { title: string; direction: 'up' | 'down' | 'flat'; magnitude?: string; explanation?: string }
interface Move { actor: string; event: string; timeframe?: string; implication?: string }
interface HistoryEntry { date: string; trendScore: number; overallTrend: string; summary?: string }
interface MarketSignalsData {
  snapshotDate?: string;
  overallTrend?: 'heating-up' | 'steady' | 'cooling-down' | string;
  trendScore?: number;
  summary?: string;
  keyTrends?: Trend[];
  searchInterest?: { verdict?: string; keywords?: string[]; notes?: string };
  recentMoves?: Move[];
  fundingActivity?: { level?: string; notable?: string[]; implication?: string };
  opportunities?: string[];
  risks?: string[];
  actionItems?: string[];
}

interface Props {
  data: MarketSignalsData;
  history?: HistoryEntry[];
}

export default function MarketSignals({ data, history }: Props) {
  if (!data) return null;

  const trendColor =
    data.overallTrend === 'heating-up' ? 'from-green-500 to-emerald-500' :
    data.overallTrend === 'cooling-down' ? 'from-red-500 to-orange-500' :
    'from-blue-500 to-indigo-500';

  const TrendIcon = ({ d }: { d: string }) =>
    d === 'up' ? <ArrowUp className="w-4 h-4 text-green-600" /> :
    d === 'down' ? <ArrowDown className="w-4 h-4 text-red-600" /> :
    <Minus className="w-4 h-4 text-slate-500" />;

  const hasHistory = history && history.length > 1;

  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-100 rounded-lg">
            <Radio className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Live Market Signals</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Snapshot: {data.snapshotDate || 'today'}
            </p>
          </div>
        </div>
        {data.overallTrend && (
          <Badge className={`bg-gradient-to-r ${trendColor} text-white capitalize px-3 py-1.5`}>
            {data.overallTrend.replace('-', ' ')}
            {typeof data.trendScore === 'number' && <span className="ml-2 font-mono">{data.trendScore}/100</span>}
          </Badge>
        )}
      </div>

      {data.summary && (
        <div className="p-4 rounded-lg bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 mb-6">
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Signal History Timeline */}
      {hasHistory && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Trend Score Over Time
          </h3>
          <div className="h-48 w-full mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as HistoryEntry;
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border text-xs">
                        <p className="font-semibold">{d.date}</p>
                        <p className="text-rose-600 font-mono">Score: {d.trendScore}/100</p>
                        <p className="capitalize text-muted-foreground">{d.overallTrend?.replace('-', ' ')}</p>
                        {d.summary && <p className="mt-1 text-muted-foreground max-w-[200px]">{d.summary}</p>}
                      </div>
                    );
                  }}
                />
                <Line type="monotone" dataKey="trendScore" stroke="#e11d48" strokeWidth={2.5} dot={{ fill: '#e11d48', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((h, i) => {
              const bg = h.overallTrend === 'heating-up' ? 'bg-green-100 text-green-800' : h.overallTrend === 'cooling-down' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
              return (
                <Badge key={i} variant="outline" className={`text-[10px] ${bg}`}>
                  {h.date}: {h.trendScore}/100
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Key trends */}
      {data.keyTrends && data.keyTrends.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Key Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.keyTrends.map((t, i) => (
              <div key={i} className="p-4 rounded-lg border border-border/50 bg-white">
                <div className="flex items-start justify-between mb-1.5 gap-2">
                  <h4 className="font-semibold text-sm leading-tight">{t.title}</h4>
                  <div className="flex items-center gap-1 shrink-0">
                    <TrendIcon d={t.direction} />
                    {t.magnitude && <span className="text-xs text-muted-foreground capitalize">{t.magnitude}</span>}
                  </div>
                </div>
                {t.explanation && <p className="text-xs text-muted-foreground">{t.explanation}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Search interest */}
        {data.searchInterest && (
          <div className="p-5 rounded-lg border border-border/50 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold flex items-center gap-2"><Search className="w-4 h-4 text-blue-600" /> Search Interest</h4>
              {data.searchInterest.verdict && (
                <Badge variant="outline" className="capitalize text-xs">{data.searchInterest.verdict}</Badge>
              )}
            </div>
            {data.searchInterest.keywords && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {data.searchInterest.keywords.map((k, i) => (
                  <Badge key={i} variant="secondary" className="text-xs font-mono">{k}</Badge>
                ))}
              </div>
            )}
            {data.searchInterest.notes && <p className="text-xs text-muted-foreground">{data.searchInterest.notes}</p>}
          </div>
        )}

        {/* Funding */}
        {data.fundingActivity && (
          <div className="p-5 rounded-lg border border-border/50 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold flex items-center gap-2"><Banknote className="w-4 h-4 text-emerald-600" /> Funding Activity</h4>
              {data.fundingActivity.level && (
                <Badge variant="outline" className="capitalize text-xs">{data.fundingActivity.level}</Badge>
              )}
            </div>
            {data.fundingActivity.notable && data.fundingActivity.notable.length > 0 && (
              <ul className="space-y-1 mb-2">
                {data.fundingActivity.notable.map((n, i) => <li key={i} className="text-xs text-muted-foreground">\u2022 {n}</li>)}
              </ul>
            )}
            {data.fundingActivity.implication && <p className="text-xs italic text-muted-foreground mt-2">{data.fundingActivity.implication}</p>}
          </div>
        )}
      </div>

      {/* Recent moves */}
      {data.recentMoves && data.recentMoves.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Newspaper className="w-4 h-4" /> Recent Market Moves</h3>
          <div className="space-y-2">
            {data.recentMoves.map((m, i) => (
              <div key={i} className="p-3 rounded-lg border-l-4 border-rose-400 bg-slate-50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{m.actor}</span>
                  {m.timeframe && <Badge variant="outline" className="text-[10px]">{m.timeframe}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{m.event}</p>
                {m.implication && <p className="text-xs italic text-rose-700 mt-1">\u2192 {m.implication}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunities & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {data.opportunities && data.opportunities.length > 0 && (
          <div className="p-5 rounded-lg bg-green-50 border border-green-200">
            <h4 className="font-semibold flex items-center gap-2 mb-3 text-green-800"><Lightbulb className="w-4 h-4" /> Opportunities</h4>
            <ul className="space-y-2">
              {data.opportunities.map((o, i) => <li key={i} className="text-sm text-green-900">\u2022 {o}</li>)}
            </ul>
          </div>
        )}
        {data.risks && data.risks.length > 0 && (
          <div className="p-5 rounded-lg bg-red-50 border border-red-200">
            <h4 className="font-semibold flex items-center gap-2 mb-3 text-red-800"><AlertOctagon className="w-4 h-4" /> Risks to Monitor</h4>
            <ul className="space-y-2">
              {data.risks.map((r, i) => <li key={i} className="text-sm text-red-900">\u2022 {r}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Action items */}
      {data.actionItems && data.actionItems.length > 0 && (
        <div className="p-5 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200">
          <h4 className="font-semibold flex items-center gap-2 mb-3 text-indigo-900"><CheckSquare className="w-4 h-4" /> Recommended Actions This Week</h4>
          <ol className="space-y-2 list-decimal list-inside">
            {data.actionItems.map((a, i) => <li key={i} className="text-sm text-indigo-900">{a}</li>)}
          </ol>
        </div>
      )}
    </Card>
  );
}
