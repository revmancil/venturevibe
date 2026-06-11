import type { PlanKey } from './plans';
import {
  planToolAccess,
  toolGroups,
  type ToolGroupKey,
  type ToolSlug,
} from './toolGroups';

export type { ToolSlug };

export const TOOL_SECTION_LABELS: Record<ToolGroupKey, string> = {
  core: 'Core Tools',
  strategy: 'Strategy Tools',
  investor: 'Investor Tools',
};

export const TOOL_LABELS: Record<ToolSlug, string> = {
  'micro-surveys': 'Micro-surveys',
  'competitor-analysis': 'Competitor analysis',
  'market-sizing': 'Market sizing',
  'validation-score': 'Validation score & recommendations',
  'swot-analysis': 'SWOT analysis',
  'customer-personas': 'Customer personas',
  'idea-refinement': 'Idea refinement',
  'pricing-strategy': 'Pricing strategy',
  'gtm-plan': 'Go-to-market plan',
  'mvp-features': 'MVP feature prioritization',
  'business-model-canvas': 'Business model canvas',
  'risk-assessment': 'Risk assessment',
  'elevator-pitches': 'Elevator pitches',
  'financial-projections': 'Financial projections',
  'name-domain-checker': 'Name & domain checker',
  'funding-readiness': 'Funding readiness score',
  'positioning-map': 'Competitive positioning map',
  'revenue-simulator': 'Revenue simulator',
  'market-signals': 'Live market signals',
  'pitch-deck': 'Investor pitch deck',
  'ai-idea-coach': 'AI Idea Coach',
  'pdf-report': 'Full PDF validation report',
};

/** Maps validation API route segments to tool slugs in planToolAccess. */
export const ENDPOINT_TOOL_SLUG: Record<string, ToolSlug> = {
  survey: 'micro-surveys',
  competitors: 'competitor-analysis',
  market: 'market-sizing',
  score: 'validation-score',
  swot: 'swot-analysis',
  pricing: 'pricing-strategy',
  gtm: 'gtm-plan',
  mvp: 'mvp-features',
  personas: 'customer-personas',
  canvas: 'business-model-canvas',
  risks: 'risk-assessment',
  refinement: 'idea-refinement',
  'elevator-pitch': 'elevator-pitches',
  'financial-projections': 'financial-projections',
  'name-checker': 'name-domain-checker',
  'funding-readiness': 'funding-readiness',
  'positioning-map': 'positioning-map',
  'revenue-sim': 'revenue-simulator',
  'market-signals': 'market-signals',
  'pitch-deck': 'pitch-deck',
};

export function userHasToolAccess(plan: PlanKey, toolSlug: ToolSlug): boolean {
  return (planToolAccess[plan] as readonly string[]).includes(toolSlug);
}

/** Lowest plan tier that unlocks this tool, or null if in core (all plans). */
export function getToolUpgradeTier(toolSlug: ToolSlug): 'pro' | 'business' | null {
  if ((toolGroups.core as readonly string[]).includes(toolSlug)) return null;
  if ((toolGroups.strategy as readonly string[]).includes(toolSlug)) return 'pro';
  if ((toolGroups.investor as readonly string[]).includes(toolSlug)) return 'business';
  return null;
}

export function getUpgradeBadgeLabel(toolSlug: ToolSlug): string | null {
  const tier = getToolUpgradeTier(toolSlug);
  if (!tier) return null;
  return tier === 'pro' ? 'Unlock with Pro' : 'Unlock with Business';
}

export function getToolSectionsForPlan(plan: PlanKey): { key: ToolGroupKey; tools: ToolSlug[] }[] {
  const access = planToolAccess[plan] as readonly ToolSlug[];
  return (Object.keys(toolGroups) as ToolGroupKey[])
    .map((key) => ({
      key,
      tools: toolGroups[key].filter((slug) => access.includes(slug)),
    }))
    .filter((section) => section.tools.length > 0);
}
