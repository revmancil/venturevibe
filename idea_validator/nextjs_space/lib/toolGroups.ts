export const toolGroups = {
  core: [
    'micro-surveys',
    'competitor-analysis',
    'market-sizing',
    'validation-score',
    'swot-analysis',
    'customer-personas',
    'idea-refinement',
  ],
  strategy: [
    'pricing-strategy',
    'gtm-plan',
    'mvp-features',
    'business-model-canvas',
    'risk-assessment',
    'elevator-pitches',
    'financial-projections',
  ],
  investor: [
    'name-domain-checker',
    'funding-readiness',
    'positioning-map',
    'revenue-simulator',
    'market-signals',
    'pitch-deck',
    'ai-idea-coach',
    'pdf-report',
  ],
} as const;

export const planToolAccess = {
  free: [...toolGroups.core],
  pro: [...toolGroups.core, ...toolGroups.strategy],
  business: [...toolGroups.core, ...toolGroups.strategy, ...toolGroups.investor],
};

export type ToolGroupKey = keyof typeof toolGroups;
export type ToolSlug = (typeof planToolAccess.business)[number];
