import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLlmApiKey, getLlmChatCompletionsUrl, getLlmModel } from "@/lib/llm-config";
import { isCoreValidationField, refreshIdeaValidationStatus } from "@/lib/idea-validation-status";

export interface ValidationHandlerOptions {
  fieldName: string;
  prompt: string;
  maxTokens?: number;
  afterSave?: (ideaId: string, parsed: any) => Promise<void>;
}

export async function handleValidationRequest(
  request: NextRequest,
  options: ValidationHandlerOptions
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ideaId = request.nextUrl.searchParams.get("ideaId");
  if (!ideaId) {
    return NextResponse.json({ error: "Missing ideaId" }, { status: 400 });
  }

  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea || idea.userId !== session.user.id) {
    return NextResponse.json({ error: "Idea not found or unauthorized" }, { status: 404 });
  }

  const apiKey = getLlmApiKey();
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "LLM not configured",
        hint: "Set AI_API_KEY (recommended) or ABACUSAI_API_KEY. For OpenAI use AI_API_BASE_URL=https://api.openai.com/v1 and AI_MODEL=gpt-4o-mini.",
      },
      { status: 503 }
    );
  }

  const response = await fetch(getLlmChatCompletionsUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: getLlmModel(),
      messages: [{ role: 'user', content: options.prompt }],
      stream: true,
      max_tokens: options.maxTokens || 3000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.statusText}`);
  }

  const { fieldName } = options;
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();
      if (!reader) { controller.error(new Error('No body')); return; }
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = '';
      let partialRead = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          partialRead += decoder.decode(value, { stream: true });
          let lines = partialRead.split('\n');
          partialRead = lines.pop() || '';
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                try {
                  // Strip markdown fences if present
                  let cleaned = buffer.trim();
                  if (cleaned.startsWith('```')) {
                    cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
                  }
                  const parsed = JSON.parse(cleaned);
                  await prisma.validationReport.upsert({
                    where: { ideaId },
                    update: { [fieldName]: parsed },
                    create: { ideaId, [fieldName]: parsed },
                  });
                  if (options.afterSave) {
                    await options.afterSave(ideaId, parsed).catch(e => console.error('afterSave error:', e));
                  }
                  if (isCoreValidationField(fieldName)) {
                    await refreshIdeaValidationStatus(ideaId).catch((e) =>
                      console.error("refreshIdeaValidationStatus error:", e)
                    );
                  }
                } catch (e) {
                  console.error(`Error parsing/saving ${fieldName}:`, e);
                }
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
                return;
              }
              try {
                const parsed = JSON.parse(data);
                buffer += parsed.choices?.[0]?.delta?.content || '';
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing' })}\n\n`));
              } catch { /* skip */ }
            }
          }
        }
      } catch (error) {
        console.error('Stream error:', error);
        controller.error(error);
      } finally {
        reader.releaseLock();
        try { controller.close(); } catch { /* already closed */ }
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

export function ideaContext(idea: any) {
  return `Title: ${idea.title}\nDescription: ${idea.description}\nTarget Audience: ${idea.targetAudience}\nProblem it solves: ${idea.problemStatement}\nCategory: ${idea.category}`;
}
