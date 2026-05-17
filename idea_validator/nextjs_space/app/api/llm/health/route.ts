import { NextResponse } from "next/server";
import {
  getLlmApiKey,
  getLlmChatCompletionsUrl,
  getLlmModel,
} from "@/lib/llm-config";

export const runtime = "nodejs";

/** Visit /api/llm/health after deploy — validation tools need AI_API_KEY. */
export async function GET() {
  const apiKey = getLlmApiKey();
  const baseUrl = process.env.AI_API_BASE_URL?.trim() || "https://apps.abacus.ai/v1 (default)";
  const model = getLlmModel();

  return NextResponse.json({
    configured: Boolean(apiKey),
    model,
    chatCompletionsUrl: getLlmChatCompletionsUrl(),
    baseUrl,
    hint: apiKey
      ? undefined
      : "Set AI_API_KEY (or ABACUSAI_API_KEY) on Vercel. For OpenAI: AI_API_BASE_URL=https://api.openai.com/v1 and AI_MODEL=gpt-4o-mini.",
  });
}
