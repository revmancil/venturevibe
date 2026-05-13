import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const prompt = `Estimate market size for this business idea:

Title: ${idea.title}
Description: ${idea.description}
Target Audience: ${idea.targetAudience}
Category: ${idea.category}

Provide market sizing analysis in this JSON format:
{
  "tam": "Dollar amount or 'N/A'",
  "tamLabel": "TAM description",
  "sam": "Dollar amount or 'N/A'",
  "samLabel": "SAM description",
  "som": "Dollar amount or 'N/A'",
  "somLabel": "SOM description",
  "growth": "XX% or 'TBD'",
  "growthLabel": "Growth rate description",
  "insights": ["insight1", "insight2", "insight3"],
  "marketTrends": [
    {"year": "2024", "market_size": 1000000},
    {"year": "2025", "market_size": 1200000},
    {"year": "2026", "market_size": 1500000}
  ]
}

Provide realistic estimates based on industry data. Respond with ONLY valid JSON.`;

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: true,
        max_tokens: 2500,
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
                    const marketData = JSON.parse(buffer);
                    // Save to database
                    await prisma.validationReport.upsert({
                      where: { ideaId },
                      update: { marketData },
                      create: { ideaId, marketData },
                    });
                  } catch (e) {
                    console.error('Error parsing/saving market data:', e);
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
    console.error('Market sizing error:', error);
    return NextResponse.json(
      { error: 'Failed to estimate market' },
      { status: 500 }
    );
  }
}
