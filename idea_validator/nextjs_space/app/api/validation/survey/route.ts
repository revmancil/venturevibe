import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canUserValidate, incrementValidationCount } from "@/lib/subscription";
import { getLlmApiKey, getLlmChatCompletionsUrl, getLlmModel } from "@/lib/llm-config";
import {
  markValidationStarted,
  refreshIdeaValidationStatus,
} from "@/lib/idea-validation-status";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const ideaId = request.nextUrl.searchParams.get("ideaId");

    if (!ideaId) {
      return NextResponse.json(
        { error: "Missing ideaId" },
        { status: 400 }
      );
    }

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea || idea.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Idea not found or unauthorized" },
        { status: 404 }
      );
    }

    await markValidationStarted(ideaId);

    // Check if this is a new validation (no existing report with survey data)
    const existingReport = await prisma.validationReport.findUnique({
      where: { ideaId },
    });
    if (!existingReport?.surveyData) {
      const limitCheck = await canUserValidate(session.user.id);
      if (!limitCheck.allowed) {
        return NextResponse.json(
          { error: limitCheck.reason, limitReached: true },
          { status: 403 }
        );
      }
      await incrementValidationCount(session.user.id);
    }

    const prompt = `Generate 5-7 micro-survey questions to validate this business idea:
    
Title: ${idea.title}
Description: ${idea.description}
Target Audience: ${idea.targetAudience}
Problem it solves: ${idea.problemStatement}

Generate survey questions in JSON format with the following structure:
{
  "questions": [
    {
      "question": "Question text",
      "type": "multiple_choice|open_ended|rating",
      "options": ["option1", "option2"] (only for multiple_choice),
      "insight": "Why this question matters for validation"
    }
  ]
}

Respond with ONLY valid JSON, no additional text.`;

    const apiKey = getLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "LLM not configured",
          hint: "Set AI_API_KEY or ABACUSAI_API_KEY; optional AI_API_BASE_URL for OpenAI-compatible providers.",
        },
        { status: 503 }
      );
    }

    const response = await fetch(getLlmChatCompletionsUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: getLlmModel(),
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: true,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.error(new Error('No response body'));
          return;
        }

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
                    const surveyData = JSON.parse(buffer);
                    // Save to database
                    await prisma.validationReport.upsert({
                      where: { ideaId },
                      update: { surveyData },
                      create: { ideaId, surveyData },
                    });
                    await refreshIdeaValidationStatus(ideaId);
                  } catch (e) {
                    console.error('Error parsing/saving survey data:', e);
                  }
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  controller.close();
                  return;
                }
                try {
                  const parsed = JSON.parse(data);
                  buffer += parsed.choices?.[0]?.delta?.content || '';
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing' })}\n\n`));
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        } finally {
          reader.releaseLock();
          controller.close();
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
  } catch (error) {
    console.error('Survey generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate survey' },
      { status: 500 }
    );
  }
}
