export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    validationsPerMonth: 2,
    features: [
      '2 idea validations per month',
      'Micro-survey generation',
      'Basic competitor analysis',
      'Basic market sizing',
    ],
  },
  pro: {
    name: 'Pro',
    price: 29,
    validationsPerMonth: 15,
    features: [
      '15 idea validations per month',
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
