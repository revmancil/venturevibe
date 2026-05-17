'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ArrowLeft, Loader2, CheckCircle, BarChart3, TrendingUp, Crown, RefreshCw, Download,
  Target, Shield, DollarSign, Rocket, Layers, Users, LayoutGrid, AlertTriangle,
  Sparkles, Mic, Presentation, MessageCircle, Radio,
  LineChart, Globe, Banknote, Map,
} from 'lucide-react';
import SurveyResults from './survey-results';
import CompetitorAnalysis from './competitor-analysis';
import MarketSizing from './market-sizing';
import ValidationScore from './validation-score';
import SwotAnalysis from './swot-analysis';
import PricingStrategy from './pricing-strategy';
import GtmPlan from './gtm-plan';
import MvpFeatures from './mvp-features';
import CustomerPersonas from './customer-personas';
import BusinessCanvas from './business-canvas';
import RiskAssessment from './risk-assessment';
import RefinementSuggestions from './refinement-suggestions';
import ElevatorPitchDisplay from './elevator-pitch';
import PitchDeckViewer from './pitch-deck-viewer';
import IdeaCoachChat from './idea-coach-chat';
import RevenueSimulator from './revenue-simulator';
import MarketSignals from './market-signals';
import FinancialProjectionsBuilder from './financial-projections-builder';
import NameDomainChecker from './name-domain-checker';
import FundingReadinessScore from './funding-readiness-score';
import CompetitivePositioningMap from './competitive-positioning-map';

interface Idea {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  problemStatement: string;
  category: string;
  status: string;
  createdAt: Date;
  validationReport: any | null;
}

type AnalysisType =
  | 'survey' | 'competitors' | 'market' | 'score' | 'swot' | 'pricing' | 'gtm' | 'mvp' | 'personas' | 'canvas' | 'risks' | 'refinement' | 'elevator-pitch' | 'pitch-deck' | 'revenue-sim' | 'market-signals'
  | 'financial-projections' | 'name-checker' | 'funding-readiness' | 'positioning-map';

interface ValidationReportClientProps {
  idea: Idea;
}

export default function ValidationReportClient({ idea: initialIdea }: ValidationReportClientProps) {
  const router = useRouter();
  const [idea, setIdea] = useState(initialIdea);
  const [loadingAnalysis, setLoadingAnalysis] = useState<AnalysisType | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [limitMessage, setLimitMessage] = useState('');
  const [llmConfigured, setLlmConfigured] = useState<boolean | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);

  useEffect(() => {
    fetch('/api/llm/health')
      .then((res) => res.json())
      .then((data) => setLlmConfigured(Boolean(data.configured)))
      .catch(() => setLlmConfigured(null));
  }, []);

  const parseApiError = async (response: Response) => {
    try {
      const data = await response.json();
      const parts = [data.error, data.hint].filter(Boolean);
      return parts.join(' — ') || `Request failed (${response.status})`;
    } catch {
      return `Request failed (${response.status})`;
    }
  };

  const handleDownloadReport = async () => {
    setIsDownloadingReport(true);
    try {
      const res = await fetch('/api/report/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId: idea.id }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to generate report');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${idea.title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_')}_Report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Report downloaded!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to download report');
    } finally {
      setIsDownloadingReport(false);
    }
  };

  const refreshIdea = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/ideas/${idea.id}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.idea) setIdea(data.idea);
      }
      router.refresh();
    } catch {
      toast.error('Could not refresh');
    } finally {
      setIsRefreshing(false);
    }
  };

  const runAnalysis = async (type: AnalysisType, endpoint: string, successMsg: string) => {
    setLoadingAnalysis(type);
    try {
      // Pitch deck uses a non-streaming GET request
      if (type === 'pitch-deck') {
        const response = await fetch(`/api/validation/${endpoint}?ideaId=${idea.id}`);
        if (!response.ok) {
          const message = await parseApiError(response);
          toast.error(response.status === 503 ? 'AI not configured' : 'Generation failed', {
            description: message,
          });
          setLoadingAnalysis(null);
          return;
        }
        toast.success(successMsg);
        await refreshIdea();
        setLoadingAnalysis(null);
        return;
      }

      const response = await fetch(`/api/validation/${endpoint}?ideaId=${idea.id}`);
      if (response.status === 403) {
        const data = await response.json();
        if (data.limitReached) {
          setLimitMessage(data.error);
          setShowUpgradePrompt(true);
          setLoadingAnalysis(null);
          return;
        }
      }
      if (!response.ok) {
        const message = await parseApiError(response);
        toast.error(response.status === 503 ? 'AI not configured' : 'Generation failed', {
          description: message,
        });
        setLoadingAnalysis(null);
        return;
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No body');
      while (true) {
        const { done } = await reader.read();
        if (done) break;
      }
      toast.success(successMsg);
      await refreshIdea();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to generate ${type} analysis`);
    } finally {
      setLoadingAnalysis(null);
    }
  };

  const report = idea.validationReport;

  // Analysis cards config
  const coreAnalyses = [
    {
      type: 'survey' as AnalysisType,
      label: 'Micro-Surveys',
      desc: 'AI-generated survey questions to validate your idea',
      icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
      iconBg: 'bg-blue-100',
      btnColor: 'bg-blue-500 hover:bg-blue-600',
      endpoint: 'survey',
      successMsg: 'Survey generated successfully!',
      hasData: !!report?.surveyData,
      genLabel: 'Generate Survey',
      regenLabel: 'Regenerate',
      loadingLabel: 'Generating...',
    },
    {
      type: 'competitors' as AnalysisType,
      label: 'Competitors',
      desc: 'Identify and analyze your market competitors',
      icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
      iconBg: 'bg-purple-100',
      btnColor: 'bg-purple-500 hover:bg-purple-600',
      endpoint: 'competitors',
      successMsg: 'Competitor analysis complete!',
      hasData: !!report?.competitorData,
      genLabel: 'Analyze Competitors',
      regenLabel: 'Re-analyze',
      loadingLabel: 'Analyzing...',
    },
    {
      type: 'market' as AnalysisType,
      label: 'Market Sizing',
      desc: 'Estimate TAM, SAM, and market growth',
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      iconBg: 'bg-emerald-100',
      btnColor: 'bg-emerald-500 hover:bg-emerald-600',
      endpoint: 'market',
      successMsg: 'Market sizing complete!',
      hasData: !!report?.marketData,
      genLabel: 'Size the Market',
      regenLabel: 'Re-estimate',
      loadingLabel: 'Estimating...',
    },
  ];

  const deepAnalyses = [
    {
      type: 'score' as AnalysisType,
      label: 'Validation Score',
      desc: 'AI-generated 0-100 score with dimensional breakdown',
      icon: <Target className="w-5 h-5 text-indigo-600" />,
      iconBg: 'bg-indigo-100',
      btnColor: 'bg-indigo-500 hover:bg-indigo-600',
      endpoint: 'score',
      successMsg: 'Validation score calculated!',
      hasData: !!report?.validationScoreData,
      genLabel: 'Calculate Score',
      regenLabel: 'Recalculate',
      loadingLabel: 'Calculating...',
    },
    {
      type: 'swot' as AnalysisType,
      label: 'SWOT Analysis',
      desc: 'Strengths, Weaknesses, Opportunities & Threats',
      icon: <Shield className="w-5 h-5 text-teal-600" />,
      iconBg: 'bg-teal-100',
      btnColor: 'bg-teal-500 hover:bg-teal-600',
      endpoint: 'swot',
      successMsg: 'SWOT analysis complete!',
      hasData: !!report?.swotData,
      genLabel: 'Run SWOT',
      regenLabel: 'Re-run',
      loadingLabel: 'Analyzing...',
    },
    {
      type: 'pricing' as AnalysisType,
      label: 'Pricing Strategy',
      desc: 'Pricing models, tiers & revenue projections',
      icon: <DollarSign className="w-5 h-5 text-green-600" />,
      iconBg: 'bg-green-100',
      btnColor: 'bg-green-500 hover:bg-green-600',
      endpoint: 'pricing',
      successMsg: 'Pricing strategy generated!',
      hasData: !!report?.pricingStrategyData,
      genLabel: 'Generate Pricing',
      regenLabel: 'Regenerate',
      loadingLabel: 'Generating...',
    },
    {
      type: 'gtm' as AnalysisType,
      label: 'Go-To-Market Plan',
      desc: '30-60-90 day launch roadmap',
      icon: <Rocket className="w-5 h-5 text-orange-600" />,
      iconBg: 'bg-orange-100',
      btnColor: 'bg-orange-500 hover:bg-orange-600',
      endpoint: 'gtm',
      successMsg: 'Go-to-market plan ready!',
      hasData: !!report?.gtmPlanData,
      genLabel: 'Create Plan',
      regenLabel: 'Recreate',
      loadingLabel: 'Planning...',
    },
    {
      type: 'mvp' as AnalysisType,
      label: 'MVP Features',
      desc: 'Prioritized feature list for your MVP',
      icon: <Layers className="w-5 h-5 text-violet-600" />,
      iconBg: 'bg-violet-100',
      btnColor: 'bg-violet-500 hover:bg-violet-600',
      endpoint: 'mvp',
      successMsg: 'MVP features identified!',
      hasData: !!report?.mvpFeaturesData,
      genLabel: 'Identify Features',
      regenLabel: 'Regenerate',
      loadingLabel: 'Identifying...',
    },
    {
      type: 'personas' as AnalysisType,
      label: 'Customer Personas',
      desc: 'Detailed buyer personas with demographics & motivations',
      icon: <Users className="w-5 h-5 text-pink-600" />,
      iconBg: 'bg-pink-100',
      btnColor: 'bg-pink-500 hover:bg-pink-600',
      endpoint: 'personas',
      successMsg: 'Customer personas created!',
      hasData: !!report?.personasData,
      genLabel: 'Create Personas',
      regenLabel: 'Recreate',
      loadingLabel: 'Creating...',
    },
    {
      type: 'canvas' as AnalysisType,
      label: 'Business Model Canvas',
      desc: 'Auto-fill the 9-block business model framework',
      icon: <LayoutGrid className="w-5 h-5 text-cyan-600" />,
      iconBg: 'bg-cyan-100',
      btnColor: 'bg-cyan-500 hover:bg-cyan-600',
      endpoint: 'canvas',
      successMsg: 'Business canvas generated!',
      hasData: !!report?.businessCanvasData,
      genLabel: 'Generate Canvas',
      regenLabel: 'Regenerate',
      loadingLabel: 'Generating...',
    },
    {
      type: 'risks' as AnalysisType,
      label: 'Risk Assessment',
      desc: 'Legal, technical, market & financial risk analysis',
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      iconBg: 'bg-red-100',
      btnColor: 'bg-red-500 hover:bg-red-600',
      endpoint: 'risks',
      successMsg: 'Risk assessment complete!',
      hasData: !!report?.riskAssessmentData,
      genLabel: 'Assess Risks',
      regenLabel: 'Re-assess',
      loadingLabel: 'Assessing...',
    },
    {
      type: 'refinement' as AnalysisType,
      label: 'Idea Refinement',
      desc: 'AI suggests ways to improve or pivot your idea',
      icon: <Sparkles className="w-5 h-5 text-yellow-600" />,
      iconBg: 'bg-yellow-100',
      btnColor: 'bg-yellow-500 hover:bg-yellow-600',
      endpoint: 'refinement',
      successMsg: 'Refinement suggestions ready!',
      hasData: !!report?.refinementData,
      genLabel: 'Get Suggestions',
      regenLabel: 'Regenerate',
      loadingLabel: 'Thinking...',
    },
    {
      type: 'elevator-pitch' as AnalysisType,
      label: 'Elevator Pitches',
      desc: 'Multiple pitch variations from tweet to 90-second',
      icon: <Mic className="w-5 h-5 text-sky-600" />,
      iconBg: 'bg-sky-100',
      btnColor: 'bg-sky-500 hover:bg-sky-600',
      endpoint: 'elevator-pitch',
      successMsg: 'Elevator pitches generated!',
      hasData: !!report?.elevatorPitchData,
      genLabel: 'Generate Pitches',
      regenLabel: 'Regenerate',
      loadingLabel: 'Writing...',
    },
    {
      type: 'revenue-sim' as AnalysisType,
      label: 'Revenue Simulator',
      desc: 'Interactive 24-month MRR/ARR projections with sliders',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      iconBg: 'bg-emerald-100',
      btnColor: 'bg-emerald-500 hover:bg-emerald-600',
      endpoint: 'revenue-sim',
      successMsg: 'Revenue simulator ready!',
      hasData: !!report?.revenueSimData,
      genLabel: 'Build Simulator',
      regenLabel: 'Rebuild',
      loadingLabel: 'Modeling...',
    },
    {
      type: 'market-signals' as AnalysisType,
      label: 'Live Market Signals',
      desc: 'Real-time trends, search interest, funding, and recent moves',
      icon: <Radio className="w-5 h-5 text-rose-600" />,
      iconBg: 'bg-rose-100',
      btnColor: 'bg-rose-500 hover:bg-rose-600',
      endpoint: 'market-signals',
      successMsg: 'Market signals snapshot ready!',
      hasData: !!report?.marketSignalsData,
      genLabel: 'Get Signals',
      regenLabel: 'Refresh Signals',
      loadingLabel: 'Scanning...',
    },
    {
      type: 'pitch-deck' as AnalysisType,
      label: 'Pitch Deck',
      desc: '10-slide investor pitch deck with PDF export',
      icon: <Presentation className="w-5 h-5 text-fuchsia-600" />,
      iconBg: 'bg-fuchsia-100',
      btnColor: 'bg-fuchsia-500 hover:bg-fuchsia-600',
      endpoint: 'pitch-deck',
      successMsg: 'Pitch deck generated!',
      hasData: !!report?.pitchDeckData,
      genLabel: 'Generate Deck',
      regenLabel: 'Regenerate',
      loadingLabel: 'Creating...',
    },
  ];

  const investorPrepAnalyses = [
    {
      type: 'financial-projections' as AnalysisType,
      label: 'Financial Projections',
      desc: '3–5 year revenue, burn, runway & break-even with editable assumptions',
      icon: <LineChart className="w-5 h-5 text-indigo-600" />,
      iconBg: 'bg-indigo-100',
      btnColor: 'bg-indigo-500 hover:bg-indigo-600',
      endpoint: 'financial-projections',
      successMsg: 'Financial projections ready!',
      hasData: !!report?.financialProjectionsData,
      genLabel: 'Build Projections',
      regenLabel: 'Rebuild',
      loadingLabel: 'Modeling...',
    },
    {
      type: 'name-checker' as AnalysisType,
      label: 'Name & Domain Checker',
      desc: 'Brandable names with live domain & trademark risk screening',
      icon: <Globe className="w-5 h-5 text-violet-600" />,
      iconBg: 'bg-violet-100',
      btnColor: 'bg-violet-500 hover:bg-violet-600',
      endpoint: 'name-checker',
      successMsg: 'Name ideas & domain checks ready!',
      hasData: !!report?.nameCheckerData,
      genLabel: 'Generate Names',
      regenLabel: 'Regenerate',
      loadingLabel: 'Checking domains...',
    },
    {
      type: 'funding-readiness' as AnalysisType,
      label: 'Funding Readiness',
      desc: 'Investor-ready score across traction, market, team & defensibility',
      icon: <Banknote className="w-5 h-5 text-amber-600" />,
      iconBg: 'bg-amber-100',
      btnColor: 'bg-amber-500 hover:bg-amber-600',
      endpoint: 'funding-readiness',
      successMsg: 'Funding readiness assessed!',
      hasData: !!report?.fundingReadinessData,
      genLabel: 'Score Readiness',
      regenLabel: 'Re-score',
      loadingLabel: 'Assessing...',
    },
    {
      type: 'positioning-map' as AnalysisType,
      label: 'Positioning Map',
      desc: '2×2 competitive map on the axes that matter for your market',
      icon: <Map className="w-5 h-5 text-cyan-600" />,
      iconBg: 'bg-cyan-100',
      btnColor: 'bg-cyan-500 hover:bg-cyan-600',
      endpoint: 'positioning-map',
      successMsg: 'Positioning map created!',
      hasData: !!report?.positioningMapData,
      genLabel: 'Build Map',
      regenLabel: 'Rebuild',
      loadingLabel: 'Mapping...',
    },
  ];

  const renderAnalysisButton = (a: typeof coreAnalyses[0], size?: 'sm' | 'default') => {
    const isLoading = loadingAnalysis === a.type;
    if (isLoading) {
      return (
        <Button disabled className="w-full" size={size}>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />{a.loadingLabel}
        </Button>
      );
    }
    if (a.hasData) {
      return (
        <Button onClick={() => runAnalysis(a.type, a.endpoint, a.successMsg)} variant="outline" className="w-full" size={size} disabled={!!loadingAnalysis}>
          {a.regenLabel}
        </Button>
      );
    }
    return (
      <Button onClick={() => runAnalysis(a.type, a.endpoint, a.successMsg)} className={`w-full text-white ${a.btnColor}`} size={size} disabled={!!loadingAnalysis}>
        {a.genLabel}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to ideas
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadReport} disabled={isDownloadingReport}>
              {isDownloadingReport ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isDownloadingReport ? 'Generating PDF…' : 'Download Report'}
            </Button>
            <Button variant="outline" size="sm" onClick={refreshIdea} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Idea overview */}
        <Card className="p-8 border border-border/50 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-display text-4xl font-bold mb-2">{idea.title}</h1>
              <p className="text-muted-foreground max-w-3xl">{idea.description}</p>
            </div>
            <Badge className="bg-gradient-to-r from-violet-500 to-emerald-500 text-white">48-Hour Validation</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border/30">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Category</p>
              <p className="font-semibold">{idea.category}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Target Audience</p>
              <p className="font-semibold text-sm">{idea.targetAudience}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Problem</p>
              <p className="font-semibold text-sm line-clamp-1">{idea.problemStatement}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Submitted</p>
              <p className="font-semibold text-sm">{new Date(idea.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>

        {/* Core analyses: surveys, competitors, market */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {coreAnalyses.map((a) => (
            <Card key={a.type} className="p-6 border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 ${a.iconBg} rounded-lg`}>{a.icon}</div>
                <h3 className="font-semibold text-lg">{a.label}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{a.desc}</p>
              {renderAnalysisButton(a)}
            </Card>
          ))}
        </div>

        {/* Investor prep */}
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold mb-1">Investor Prep</h2>
          <p className="text-muted-foreground text-sm mb-6">Tools founders use before investor meetings</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {investorPrepAnalyses.map((a) => (
              <Card key={a.type} className="p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 ${a.iconBg} rounded-lg`}>{a.icon}</div>
                  <h4 className="font-semibold text-sm">{a.label}</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-4">{a.desc}</p>
                {renderAnalysisButton(a, 'sm')}
              </Card>
            ))}
          </div>
        </div>

        {/* Deep analyses */}
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold mb-1">Deep Analysis</h2>
          <p className="text-muted-foreground text-sm mb-6">Go deeper with advanced AI-powered business analyses</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {deepAnalyses.map((a) => (
              <Card key={a.type} className="p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 ${a.iconBg} rounded-lg`}>{a.icon}</div>
                  <h4 className="font-semibold text-sm">{a.label}</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-4">{a.desc}</p>
                {renderAnalysisButton(a, 'sm')}
              </Card>
            ))}
          </div>
        </div>

        {llmConfigured === false && (
          <Card className="p-6 border-2 border-red-300 bg-red-50 mb-8">
            <h3 className="font-display text-lg font-bold mb-2 text-red-900">AI validation is not configured</h3>
            <p className="text-sm text-red-800/90 mb-2">
              The server returned 503 because no LLM API key is set. Add{' '}
              <code className="rounded bg-white/80 px-1 py-0.5 text-xs">AI_API_KEY</code> in Vercel
              (Project → Settings → Environment Variables), then redeploy.
            </p>
            <p className="text-xs text-red-800/80">
              OpenAI example: <code className="rounded bg-white/80 px-1 py-0.5">AI_API_BASE_URL=https://api.openai.com/v1</code>,{' '}
              <code className="rounded bg-white/80 px-1 py-0.5">AI_MODEL=gpt-4o-mini</code>
            </p>
          </Card>
        )}

        {/* Upgrade prompt */}
        {showUpgradePrompt && (
          <Card className="p-8 border-2 border-amber-300 bg-amber-50 mb-8 text-center">
            <Crown className="w-10 h-10 text-amber-500 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">Validation Limit Reached</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">{limitMessage}</p>
            <Link href="/pricing">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                <Crown className="w-4 h-4 mr-2" />
                View Upgrade Options
              </Button>
            </Link>
          </Card>
        )}

        {/* Results */}
        {report && (
          <div className="space-y-0">
            {report.validationScoreData && <ValidationScore data={report.validationScoreData} />}
            {report.surveyData && <SurveyResults data={report.surveyData} />}
            {report.competitorData && <CompetitorAnalysis data={report.competitorData} />}
            {report.marketData && <MarketSizing data={report.marketData} />}
            {report.swotData && <SwotAnalysis data={report.swotData} />}
            {report.pricingStrategyData && <PricingStrategy data={report.pricingStrategyData} />}
            {report.gtmPlanData && <GtmPlan data={report.gtmPlanData} />}
            {report.mvpFeaturesData && <MvpFeatures data={report.mvpFeaturesData} />}
            {report.personasData && <CustomerPersonas data={report.personasData} />}
            {report.businessCanvasData && <BusinessCanvas data={report.businessCanvasData} />}
            {report.riskAssessmentData && <RiskAssessment data={report.riskAssessmentData} />}
            {report.refinementData && <RefinementSuggestions data={report.refinementData} />}
            {report.elevatorPitchData && <ElevatorPitchDisplay data={report.elevatorPitchData} />}
            {report.pitchDeckData && <PitchDeckViewer data={report.pitchDeckData} ideaId={idea.id} />}
            {report.revenueSimData && <RevenueSimulator data={report.revenueSimData} />}
            {report.marketSignalsData && <MarketSignals data={report.marketSignalsData} history={Array.isArray(report.marketSignalsHistory) ? report.marketSignalsHistory : undefined} />}
            {report.financialProjectionsData && <FinancialProjectionsBuilder data={report.financialProjectionsData} />}
            {report.nameCheckerData && <NameDomainChecker data={report.nameCheckerData} />}
            {report.fundingReadinessData && <FundingReadinessScore data={report.fundingReadinessData} />}
            {report.positioningMapData && <CompetitivePositioningMap data={report.positioningMapData} />}
          </div>
        )}

        {/* AI Idea Coach - always visible */}
        <IdeaCoachChat ideaId={idea.id} />
      </main>
    </div>
  );
}
