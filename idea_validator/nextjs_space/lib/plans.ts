export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    validationsPerMonth: 1, // 1 lifetime validation, not recurring
    features: [
      '1 free idea validation (lifetime)',
      'Micro-survey generation',
      'Basic competitor analysis',
      'Basic market sizing',
      'Validation score & recommendations',
      'SWOT analysis',
      'Customer personas',
    ],
  },
  pro: {
    name: 'Pro',
    price: 29,
    validationsPerMonth: 5,
    features: [
      '5 idea validations per month',
      'Advanced survey generation',
      'Detailed competitor analysis',
      'Comprehensive market sizing',
      'Validation score & recommendations',
      'SWOT analysis',
      'Pricing strategy',
      'Go-to-market plan',
      'MVP feature prioritization',
      'Customer personas',
      'Business model canvas',
      'Risk assessment',
      'Financial projections',
      'Priority processing',
    ],
  },
  business: {
    name: 'Business',
    price: 79,
    validationsPerMonth: -1, // unlimited
    features: [
      'Unlimited idea validations',
      'Everything in Pro, plus:',
      '5-year financial projections builder',
      'Startup name & domain checker',
      'Funding readiness score',
      'Competitive positioning map (2×2)',
      'Revenue simulator & scenario compare',
      'Live market signals',
      'Idea refinement suggestions',
      'Elevator pitch generator',
      'Investor pitch deck with PDF export',
      'AI Idea Coach chat',
      'Full PDF validation report',
      'Priority processing',
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
