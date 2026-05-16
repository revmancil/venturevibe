'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, AlertCircle } from 'lucide-react';

type DomainStatus = 'available' | 'taken' | 'unknown';

interface NameEntry {
  name: string;
  tagline?: string;
  domainRoot?: string;
  trademarkRisk?: string;
  trademarkNote?: string;
  whyItWorks?: string;
  domains?: Record<string, DomainStatus>;
}

interface NameCheckerData {
  names?: NameEntry[];
  namingTips?: string[];
  disclaimer?: string;
  domainsCheckedAt?: string;
}

const domainBadge = (status: DomainStatus | undefined) => {
  if (status === 'available') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (status === 'taken') return 'bg-red-100 text-red-800 border-red-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
};

const tmColor = (risk?: string) => {
  const r = (risk || '').toLowerCase();
  if (r === 'low') return 'bg-emerald-100 text-emerald-800';
  if (r === 'medium') return 'bg-amber-100 text-amber-800';
  if (r === 'high') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-700';
};

export default function NameDomainChecker({ data }: { data: NameCheckerData }) {
  const names = data?.names || [];
  const tlds = ['com', 'io', 'co', 'app', 'ai'];

  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-violet-100 rounded-lg">
          <Globe className="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">Startup name & domain checker</h2>
          <p className="text-sm text-muted-foreground">
            Brandable name ideas with live DNS screening — confirm availability with a registrar before buying
          </p>
        </div>
      </div>

      {data?.domainsCheckedAt && (
        <p className="text-xs text-muted-foreground mb-4">
          Domains checked {new Date(data.domainsCheckedAt).toLocaleString()}
        </p>
      )}

      <div className="space-y-4">
        {names.map((entry, i) => (
          <div key={i} className="rounded-xl border border-border/60 p-5 bg-white/60">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="font-display text-xl font-bold">{entry.name}</h3>
                {entry.tagline && <p className="text-sm text-muted-foreground mt-0.5">{entry.tagline}</p>}
              </div>
              {entry.trademarkRisk && (
                <Badge className={tmColor(entry.trademarkRisk)}>
                  TM risk: {entry.trademarkRisk}
                </Badge>
              )}
            </div>
            {entry.whyItWorks && (
              <p className="text-sm text-muted-foreground mb-3">{entry.whyItWorks}</p>
            )}
            {entry.trademarkNote && (
              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded px-2 py-1 mb-3 inline-block">
                {entry.trademarkNote}
              </p>
            )}
            {entry.domains && Object.keys(entry.domains).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tlds.map((tld) => {
                  const status = entry.domains?.[tld];
                  const root = entry.domainRoot || entry.name.toLowerCase().replace(/\s+/g, '');
                  return (
                    <span
                      key={tld}
                      className={`text-xs font-mono px-2 py-1 rounded border ${domainBadge(status)}`}
                      title={status === 'available' ? 'No DNS A record — may still be registered' : status === 'taken' ? 'DNS resolves — likely registered' : 'Could not verify'}
                    >
                      {root}.{tld} · {status || 'unknown'}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {data?.namingTips && data.namingTips.length > 0 && (
        <div className="mt-6 p-4 bg-violet-50 border border-violet-100 rounded-lg">
          <h4 className="font-semibold text-violet-900 mb-2">Naming tips</h4>
          <ul className="space-y-1 text-sm text-violet-800">
            {data.namingTips.map((t, i) => (
              <li key={i}>• {t}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex gap-2 text-xs text-muted-foreground">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>{data?.disclaimer || 'Domain and trademark checks are preliminary screening only—not legal advice. Always verify with a registrar and trademark attorney.'}</p>
      </div>
    </Card>
  );
}
