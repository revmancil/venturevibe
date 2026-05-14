'use client';

import { useState, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Presentation, Download, Loader2, ChevronLeft, ChevronRight,
  Save, RefreshCw, Plus, Trash2, ArrowUp, ArrowDown,
  Palette, Upload, Eye, EyeOff, FileText, StickyNote,
  Pencil, Check, X, ImageIcon,
} from 'lucide-react';
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
  theme?: string;
  logoUrl?: string;
}

const THEMES: Record<string, { name: string; preview: string[]; description: string }> = {
  default: { name: 'Vibrant', preview: ['#4F46E5', '#DC2626', '#059669', '#7C3AED'], description: 'Bold, colorful slides' },
  corporate: { name: 'Corporate', preview: ['#1E3A5F', '#2C3E50', '#34495E', '#1B2631'], description: 'Professional navy tones' },
  startup: { name: 'Startup Bold', preview: ['#7C3AED', '#EF4444', '#10B981', '#F59E0B'], description: 'Bright and energetic' },
  dark: { name: 'Dark Mode', preview: ['#111827', '#1F2937', '#111827', '#1F2937'], description: 'Sleek dark background' },
  minimal: { name: 'Minimal', preview: ['#FFFFFF', '#F9FAFB', '#FFFFFF', '#F9FAFB'], description: 'Clean white with color accents' },
};

const slideTypeOptions = [
  'title', 'problem', 'solution', 'market', 'business_model',
  'competition', 'gtm', 'traction', 'financials', 'ask', 'custom',
];

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
  custom: { bg: 'bg-gray-600', text: 'text-white', border: 'border-gray-700' },
};

export default function PitchDeckViewer({ data, ideaId }: { data: DeckData; ideaId: string }) {
  const [deck, setDeck] = useState<DeckData>(() => ({ ...data }));
  const [currentSlide, setCurrentSlide] = useState(0);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slides = deck?.slides || [];
  const theme = deck?.theme || 'default';
  const slide = slides[currentSlide];
  const colors = typeColors[slide?.type] || typeColors.title;

  const updateDeck = useCallback((updater: (d: DeckData) => DeckData) => {
    setDeck(prev => updater(prev));
    setHasUnsaved(true);
  }, []);

  const updateSlideField = (field: string, value: any) => {
    updateDeck(d => {
      const newSlides = [...(d.slides || [])];
      newSlides[currentSlide] = { ...newSlides[currentSlide], [field]: value };
      return { ...d, slides: newSlides };
    });
  };

  const updateBulletPoint = (index: number, value: string) => {
    updateDeck(d => {
      const newSlides = [...(d.slides || [])];
      const bp = [...(newSlides[currentSlide].bulletPoints || [])];
      bp[index] = value;
      newSlides[currentSlide] = { ...newSlides[currentSlide], bulletPoints: bp };
      return { ...d, slides: newSlides };
    });
  };

  const addBulletPoint = () => {
    updateDeck(d => {
      const newSlides = [...(d.slides || [])];
      const bp = [...(newSlides[currentSlide].bulletPoints || []), 'New point'];
      newSlides[currentSlide] = { ...newSlides[currentSlide], bulletPoints: bp };
      return { ...d, slides: newSlides };
    });
  };

  const removeBulletPoint = (index: number) => {
    updateDeck(d => {
      const newSlides = [...(d.slides || [])];
      const bp = [...(newSlides[currentSlide].bulletPoints || [])];
      bp.splice(index, 1);
      newSlides[currentSlide] = { ...newSlides[currentSlide], bulletPoints: bp };
      return { ...d, slides: newSlides };
    });
  };

  // Reorder slides
  const moveSlide = (direction: 'up' | 'down') => {
    const target = direction === 'up' ? currentSlide - 1 : currentSlide + 1;
    if (target < 0 || target >= slides.length) return;
    updateDeck(d => {
      const newSlides = [...(d.slides || [])];
      [newSlides[currentSlide], newSlides[target]] = [newSlides[target], newSlides[currentSlide]];
      // Renumber
      newSlides.forEach((s, i) => { s.slideNumber = i + 1; });
      return { ...d, slides: newSlides };
    });
    setCurrentSlide(target);
  };

  // Add new slide
  const addSlide = () => {
    updateDeck(d => {
      const newSlides = [...(d.slides || [])];
      const newSlide: Slide = {
        slideNumber: newSlides.length + 1,
        title: 'New Slide',
        type: 'custom',
        content: 'Add your content here',
        bulletPoints: ['Key point 1'],
        notes: '',
      };
      newSlides.splice(currentSlide + 1, 0, newSlide);
      newSlides.forEach((s, i) => { s.slideNumber = i + 1; });
      return { ...d, slides: newSlides };
    });
    setCurrentSlide(currentSlide + 1);
  };

  // Delete slide
  const deleteSlide = () => {
    if (slides.length <= 1) { toast.error('Cannot delete the only slide'); return; }
    updateDeck(d => {
      const newSlides = [...(d.slides || [])];
      newSlides.splice(currentSlide, 1);
      newSlides.forEach((s, i) => { s.slideNumber = i + 1; });
      return { ...d, slides: newSlides };
    });
    setCurrentSlide(Math.min(currentSlide, slides.length - 2));
  };

  // Save edits to DB
  const saveDeck = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/validation/pitch-deck/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId, deck }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setHasUnsaved(false);
      toast.success('Pitch deck saved!');
    } catch { toast.error('Failed to save changes'); }
    finally { setSaving(false); }
  };

  // Regenerate single slide
  const regenerateSlide = async () => {
    setRegenerating(true);
    try {
      const res = await fetch('/api/validation/pitch-deck/regenerate-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaId,
          slideNumber: slide.slideNumber,
          slideType: slide.type,
          slideTitle: slide.title,
        }),
      });
      if (!res.ok) throw new Error('Failed to regenerate');
      const { slide: newSlide } = await res.json();
      updateDeck(d => {
        const newSlides = [...(d.slides || [])];
        newSlides[currentSlide] = { ...newSlide, slideNumber: currentSlide + 1 };
        return { ...d, slides: newSlides };
      });
      toast.success('Slide regenerated with fresh AI content!');
    } catch { toast.error('Failed to regenerate slide'); }
    finally { setRegenerating(false); }
  };

  // Theme change
  const setTheme = (t: string) => {
    updateDeck(d => ({ ...d, theme: t }));
    setShowThemePicker(false);
  };

  // Logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Logo must be under 5MB'); return; }
    setUploadingLogo(true);
    try {
      const presignedRes = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type, isPublic: true }),
      });
      if (!presignedRes.ok) throw new Error('Failed to get upload URL');
      const { uploadUrl, publicUrl } = await presignedRes.json();
      if (!publicUrl) throw new Error('Could not determine public URL for logo');

      // Check signed headers
      const url = new URL(uploadUrl);
      const signedHeaders = url.searchParams.get('X-Amz-SignedHeaders') || '';
      const headers: Record<string, string> = { 'Content-Type': file.type };
      if (signedHeaders.includes('content-disposition')) {
        headers['Content-Disposition'] = 'attachment';
      }

      const uploadRes = await fetch(uploadUrl, { method: 'PUT', headers, body: file });
      if (!uploadRes.ok) throw new Error('Upload failed');

      updateDeck(d => ({ ...d, logoUrl: publicUrl }));
      toast.success('Logo uploaded!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload logo');
    }
    finally { setUploadingLogo(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const removeLogo = () => {
    updateDeck(d => ({ ...d, logoUrl: undefined }));
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    if (hasUnsaved) { await saveDeck(); }
    setDownloading('pdf');
    try {
      const res = await fetch('/api/validation/pitch-deck/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId, theme, includeNotes: showNotes, logoUrl: deck.logoUrl }),
      });
      if (!res.ok) throw new Error('Failed to generate PDF');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${deck?.companyName || 'Pitch_Deck'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded!');
    } catch (err: any) { toast.error(err.message || 'Failed to download PDF'); }
    finally { setDownloading(null); }
  };

  // Download PPTX (server-side generation)
  const handleDownloadPPTX = async () => {
    if (hasUnsaved) { await saveDeck(); }
    setDownloading('pptx');
    try {
      const res = await fetch('/api/validation/pitch-deck/pptx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaId,
          theme,
          includeNotes: showNotes,
          logoUrl: deck.logoUrl || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to generate PowerPoint');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${deck.companyName || 'Pitch_Deck'}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PowerPoint downloaded!');
    } catch (err: any) {
      console.error('PPTX error:', err);
      toast.error('Failed to generate PowerPoint');
    } finally { setDownloading(null); }
  };

  if (!slides.length) return null;

  return (
    <Card className="p-6 md:p-8 border border-border/50 mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-fuchsia-100 rounded-lg"><Presentation className="w-6 h-6 text-fuchsia-600" /></div>
          <div>
            <h2 className="font-display text-2xl font-bold">Pitch Deck Editor</h2>
            <p className="text-sm text-muted-foreground">{slides.length} slides · {THEMES[theme]?.name || 'Vibrant'} theme</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasUnsaved && (
            <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">Unsaved changes</Badge>
          )}
          <Button onClick={saveDeck} disabled={saving || !hasUnsaved} size="sm" variant="outline">
            {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            Save
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg border">
        <Button size="sm" variant={showThemePicker ? 'default' : 'outline'} onClick={() => setShowThemePicker(!showThemePicker)}>
          <Palette className="w-4 h-4 mr-1" />Theme
        </Button>
        <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadingLogo}>
          {uploadingLogo ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
          {deck.logoUrl ? 'Change Logo' : 'Upload Logo'}
        </Button>
        {deck.logoUrl && (
          <Button size="sm" variant="ghost" className="text-red-500" onClick={removeLogo}>
            <X className="w-4 h-4 mr-1" />Remove Logo
          </Button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        <div className="h-6 w-px bg-border mx-1" />
        <Button size="sm" variant="outline" onClick={() => setShowNotes(!showNotes)}>
          {showNotes ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
          Notes
        </Button>
        <div className="h-6 w-px bg-border mx-1" />
        <Button size="sm" variant="outline" onClick={() => moveSlide('up')} disabled={currentSlide === 0}>
          <ArrowUp className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => moveSlide('down')} disabled={currentSlide === slides.length - 1}>
          <ArrowDown className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={addSlide}>
          <Plus className="w-4 h-4 mr-1" />Add Slide
        </Button>
        <Button size="sm" variant="ghost" className="text-red-500" onClick={deleteSlide} disabled={slides.length <= 1}>
          <Trash2 className="w-4 h-4 mr-1" />Delete
        </Button>
        <div className="h-6 w-px bg-border mx-1" />
        <Button size="sm" variant="outline" onClick={regenerateSlide} disabled={regenerating}>
          {regenerating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-1" />}
          Regenerate Slide
        </Button>
      </div>

      {/* Theme Picker */}
      {showThemePicker && (
        <div className="mb-4 grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(THEMES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                theme === key ? 'border-fuchsia-500 ring-2 ring-fuchsia-200' : 'border-border hover:border-fuchsia-300'
              }`}
            >
              <div className="flex gap-1 mb-2">
                {t.preview.map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded" style={{ backgroundColor: c, border: c === '#FFFFFF' ? '1px solid #E5E7EB' : undefined }} />
                ))}
              </div>
              <div className="font-semibold text-sm">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.description}</div>
            </button>
          ))}
        </div>
      )}

      {/* Logo Preview */}
      {deck.logoUrl && (
        <div className="mb-4 flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
          <img src={deck.logoUrl} alt="Company logo" className="h-8 max-w-[120px] object-contain" />
          <span className="text-xs text-muted-foreground">Logo will appear on all slides</span>
        </div>
      )}

      {/* Slide Viewer */}
      <div className={`rounded-xl overflow-hidden ${colors.bg} ${colors.border} border-2 mb-4`}>
        <div className="aspect-[16/9] p-6 md:p-10 flex flex-col justify-center relative">
          {slide?.type === 'title' ? (
            <div className="text-center">
              {editingField === 'companyName' ? (
                <div className="inline-flex items-center gap-2 mb-4">
                  <Input
                    value={deck.companyName || ''}
                    onChange={e => updateDeck(d => ({ ...d, companyName: e.target.value }))}
                    className="text-2xl md:text-4xl font-extrabold text-center bg-white/20 border-white/40 text-white placeholder:text-white/50"
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && setEditingField(null)}
                  />
                  <Button size="sm" variant="ghost" className="text-white" onClick={() => setEditingField(null)}><Check className="w-4 h-4" /></Button>
                </div>
              ) : (
                <h3
                  className={`font-display text-2xl md:text-4xl font-extrabold ${colors.text} mb-4 cursor-pointer hover:opacity-80 group inline-block`}
                  onClick={() => setEditingField('companyName')}
                >
                  {deck.companyName || slide.title}
                  <Pencil className="w-4 h-4 inline ml-2 opacity-0 group-hover:opacity-50" />
                </h3>
              )}
              {editingField === 'content' ? (
                <div className="max-w-xl mx-auto">
                  <Textarea
                    value={slide.content}
                    onChange={e => updateSlideField('content', e.target.value)}
                    className="bg-white/20 border-white/40 text-white placeholder:text-white/50 text-center"
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && setEditingField(null)}
                  />
                  <Button size="sm" variant="ghost" className="text-white mt-1" onClick={() => setEditingField(null)}><Check className="w-4 h-4" /></Button>
                </div>
              ) : (
                <p
                  className={`text-base md:text-lg ${colors.text} opacity-90 cursor-pointer hover:opacity-70 group`}
                  onClick={() => setEditingField('content')}
                >
                  {slide.content}
                  <Pencil className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-50" />
                </p>
              )}
            </div>
          ) : (
            <>
              <div className={`text-xs font-semibold ${colors.text} opacity-60 tracking-widest uppercase mb-2`}>Slide {slide?.slideNumber}</div>
              {editingField === 'title' ? (
                <div className="flex items-center gap-2 mb-3">
                  <Input
                    value={slide.title}
                    onChange={e => updateSlideField('title', e.target.value)}
                    className="text-xl md:text-3xl font-bold bg-white/20 border-white/40 text-white placeholder:text-white/50"
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && setEditingField(null)}
                  />
                  <Button size="sm" variant="ghost" className="text-white" onClick={() => setEditingField(null)}><Check className="w-4 h-4" /></Button>
                </div>
              ) : (
                <h3
                  className={`font-display text-xl md:text-3xl font-bold ${colors.text} mb-3 cursor-pointer hover:opacity-80 group`}
                  onClick={() => setEditingField('title')}
                >
                  {slide.title}
                  <Pencil className="w-4 h-4 inline ml-2 opacity-0 group-hover:opacity-50" />
                </h3>
              )}
              {editingField === 'content' ? (
                <div className="mb-3">
                  <Textarea
                    value={slide.content}
                    onChange={e => updateSlideField('content', e.target.value)}
                    className="bg-white/20 border-white/40 text-white placeholder:text-white/50"
                    rows={2}
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && setEditingField(null)}
                  />
                  <Button size="sm" variant="ghost" className="text-white mt-1" onClick={() => setEditingField(null)}><Check className="w-4 h-4" /></Button>
                </div>
              ) : (
                <p
                  className={`text-sm md:text-base ${colors.text} opacity-85 mb-3 cursor-pointer hover:opacity-70 group`}
                  onClick={() => setEditingField('content')}
                >
                  {slide.content}
                  <Pencil className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-50" />
                </p>
              )}
              {/* Editable bullet points */}
              {slide.bulletPoints && slide.bulletPoints.length > 0 && (
                <ul className="space-y-1">
                  {slide.bulletPoints.map((bp, i) => (
                    <li key={i} className={`${colors.text} opacity-90 text-sm md:text-base flex items-start gap-2`}>
                      <span className="mt-1 shrink-0">&#9656;</span>
                      {editingField === `bp-${i}` ? (
                        <div className="flex-1 flex items-center gap-1">
                          <Input
                            value={bp}
                            onChange={e => updateBulletPoint(i, e.target.value)}
                            className="bg-white/20 border-white/40 text-white text-sm h-8"
                            autoFocus
                            onKeyDown={e => e.key === 'Enter' && setEditingField(null)}
                          />
                          <Button size="sm" variant="ghost" className="text-white h-8 w-8 p-0" onClick={() => setEditingField(null)}><Check className="w-3 h-3" /></Button>
                          <Button size="sm" variant="ghost" className="text-red-300 h-8 w-8 p-0" onClick={() => { removeBulletPoint(i); setEditingField(null); }}><X className="w-3 h-3" /></Button>
                        </div>
                      ) : (
                        <span className="cursor-pointer hover:opacity-70 group flex-1" onClick={() => setEditingField(`bp-${i}`)}>
                          {bp}
                          <Pencil className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-50" />
                        </span>
                      )}
                    </li>
                  ))}
                  <li>
                    <button onClick={addBulletPoint} className={`${colors.text} opacity-50 hover:opacity-80 text-sm flex items-center gap-1`}>
                      <Plus className="w-3 h-3" /> Add point
                    </button>
                  </li>
                </ul>
              )}
            </>
          )}
        </div>
      </div>

      {/* Speaker Notes */}
      {showNotes && (
        <div className="mb-4 p-4 bg-muted/40 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <StickyNote className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Speaker Notes</span>
          </div>
          <Textarea
            value={slide?.notes || ''}
            onChange={e => updateSlideField('notes', e.target.value)}
            placeholder="Add speaker notes for this slide..."
            rows={3}
            className="text-sm"
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={() => { setEditingField(null); setCurrentSlide(Math.max(0, currentSlide - 1)); }} disabled={currentSlide === 0}>
          <ChevronLeft className="w-4 h-4 mr-1" />Previous
        </Button>
        <span className="text-sm text-muted-foreground font-medium">{currentSlide + 1} / {slides.length}</span>
        <Button variant="outline" size="sm" onClick={() => { setEditingField(null); setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1)); }} disabled={currentSlide === slides.length - 1}>
          Next<ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Slide Thumbnails */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
        {slides.map((s, i) => {
          const tc = typeColors[s.type] || typeColors.title;
          return (
            <button
              key={i}
              onClick={() => { setEditingField(null); setCurrentSlide(i); }}
              className={`aspect-[16/9] rounded-md text-[8px] font-semibold ${tc.bg} ${tc.text} flex items-center justify-center p-1 transition-all ${i === currentSlide ? 'ring-2 ring-fuchsia-400 ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
            >
              {s.slideNumber}
            </button>
          );
        })}
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
        <span className="text-sm font-medium text-muted-foreground">Export:</span>
        <Button onClick={handleDownloadPDF} disabled={downloading === 'pdf'} size="sm" className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white">
          {downloading === 'pdf' ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating PDF...</> : <><FileText className="w-4 h-4 mr-2" />Download PDF</>}
        </Button>
        <Button onClick={handleDownloadPPTX} disabled={downloading === 'pptx'} size="sm" variant="outline">
          {downloading === 'pptx' ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Download className="w-4 h-4 mr-2" />Download PPTX</>}
        </Button>
        {showNotes && <span className="text-xs text-muted-foreground">✓ Speaker notes will be included</span>}
      </div>
    </Card>
  );
}
