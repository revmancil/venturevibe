'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Presentation, Download, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Slide {
  slideNumber: number;
  title: string;
  type: string;
  content: string;
  bulletPoints?: string[];
  notes?: string;
}
interface DeckData {
  slides?: Slide[];
  companyName?: string;
}

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  title: { bg: 'bg-indigo-600', text: 'text-white', border: 'border-indigo-700' },
  problem: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-700' },
  solution: { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-700' },
  market: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-700' },
  business_model: { bg: 'bg-violet-600', text: 'text-white', border: 'border-violet-700' },
  competition: { bg: 'bg-amber-600', text: 'text-white', border: 'border-amber-700' },
  gtm: { bg: 'bg-orange-600', text: 'text-white', border: 'border-orange-700' },
  traction: { bg: 'bg-cyan-600', text: 'text-white', border: 'border-cyan-700' },
  financials: { bg: 'bg-indigo-700', text: 'text-white', border: 'border-indigo-800' },
  ask: { bg: 'bg-pink-600', text: 'text-white', border: 'border-pink-700' },
};

export default function PitchDeckViewer({ data, ideaId }: { data: DeckData; ideaId: string }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const slides = data?.slides || [];

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/validation/pitch-deck/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to download');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data?.companyName || 'Pitch_Deck'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Pitch deck downloaded!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  if (!slides.length) return null;
  const slide = slides[currentSlide];
  const colors = typeColors[slide?.type] || typeColors.title;

  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-fuchsia-100 rounded-lg"><Presentation className="w-6 h-6 text-fuchsia-600" /></div>
          <h2 className="font-display text-2xl font-bold">Pitch Deck</h2>
        </div>
        <Button onClick={handleDownload} disabled={downloading} size="sm" className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white">
          {downloading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating PDF...</> : <><Download className="w-4 h-4 mr-2" />Download PDF</>}
        </Button>
      </div>

      {/* Slide viewer */}
      <div className={`rounded-xl overflow-hidden ${colors.bg} ${colors.border} border-2 mb-4`}>
        <div className="aspect-[16/9] p-8 md:p-12 flex flex-col justify-center">
          {slide?.type === 'title' ? (
            <div className="text-center">
              <h3 className={`font-display text-3xl md:text-5xl font-extrabold ${colors.text} mb-4`}>{data?.companyName || slide?.title}</h3>
              <p className={`text-lg md:text-xl ${colors.text} opacity-90`}>{slide?.content}</p>
            </div>
          ) : (
            <>
              <div className={`text-xs font-semibold ${colors.text} opacity-60 tracking-widest uppercase mb-2`}>Slide {slide?.slideNumber}</div>
              <h3 className={`font-display text-2xl md:text-4xl font-bold ${colors.text} mb-4`}>{slide?.title}</h3>
              <p className={`text-sm md:text-base ${colors.text} opacity-85 mb-4`}>{slide?.content}</p>
              {slide?.bulletPoints && slide.bulletPoints.length > 0 && (
                <ul className="space-y-2">
                  {slide.bulletPoints.map((bp, i) => (
                    <li key={i} className={`${colors.text} opacity-90 text-sm md:text-base flex items-start gap-2`}>
                      <span className="mt-1">&#9656;</span>{bp}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0}>
          <ChevronLeft className="w-4 h-4 mr-1" />Previous
        </Button>
        <div className="flex items-center gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentSlide ? 'bg-fuchsia-500' : 'bg-gray-300 hover:bg-gray-400'}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))} disabled={currentSlide === slides.length - 1}>
          Next<ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Slide thumbnails */}
      <div className="mt-6 grid grid-cols-5 md:grid-cols-10 gap-2">
        {slides.map((s, i) => {
          const tc = typeColors[s.type] || typeColors.title;
          return (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`aspect-[16/9] rounded-md text-[8px] font-semibold ${tc.bg} ${tc.text} flex items-center justify-center p-1 transition-all ${i === currentSlide ? 'ring-2 ring-fuchsia-400 ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
            >
              {s.slideNumber}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
