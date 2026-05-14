/**
 * All validation LLM calls use an OpenAI-compatible Chat Completions API.
 * Point at Abacus (defaults), OpenAI, Azure OpenAI, or any compatible proxy.
 */
const DEFAULT_LLM_BASE = "https://apps.abacus.ai/v1";
const DEFAULT_LLM_MODEL = "gpt-5.4-mini";

export function getLlmChatCompletionsUrl(): string {
  const base = (process.env.AI_API_BASE_URL || DEFAULT_LLM_BASE).replace(/\/+$/, "");
  return `${base}/chat/completions`;
}

/** Prefer AI_API_KEY; ABACUSAI_API_KEY is a legacy alias. */
export function getLlmApiKey(): string | undefined {
  const key = process.env.AI_API_KEY || process.env.ABACUSAI_API_KEY;
  return key?.trim() || undefined;
}

export function getLlmModel(): string {
  return (process.env.AI_MODEL || DEFAULT_LLM_MODEL).trim();
}

/**
 * Abacus-only APIs (HTML→PDF, hosted notification email) expect a deployment token.
 * Prefer ABACUS_DEPLOYMENT_TOKEN when your chat LLM uses a non-Abacus key.
 */
export function getAbacusDeploymentToken(): string | undefined {
  const explicit = process.env.ABACUS_DEPLOYMENT_TOKEN?.trim();
  if (explicit) return explicit;
  return process.env.ABACUSAI_API_KEY?.trim() || process.env.AI_API_KEY?.trim();
}
