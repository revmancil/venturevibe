/** One-time free trials surfaced on the pricing page Free column. */
export const FREE_TRIAL_TOOLS = [
  { id: "pitch-deck", label: "Pitch Deck" },
  { id: "idea-coach", label: "AI Idea Coach" },
  { id: "financial-projections", label: "Financial Projections" },
] as const;

export type FreeTrialToolId = (typeof FREE_TRIAL_TOOLS)[number]["id"];

export function signupTrialUrl(trialId: FreeTrialToolId): string {
  return `/auth/signup?trial=${encodeURIComponent(trialId)}`;
}
