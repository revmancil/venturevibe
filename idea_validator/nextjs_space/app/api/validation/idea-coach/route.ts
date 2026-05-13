import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ideaId, messages } = await request.json();
    if (!ideaId || !messages?.length) {
      return NextResponse.json({ error: "Missing ideaId or messages" }, { status: 400 });
    }

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: { validationReport: true },
    });
    if (!idea || idea.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Build context from all available validation data
    const report = idea.validationReport;
    let contextParts = [
      `Business Idea: ${idea.title}`,
      `Description: ${idea.description}`,
      `Target Audience: ${idea.targetAudience}`,
      `Problem Statement: ${idea.problemStatement}`,
      `Category: ${idea.category}`,
    ];

    if (report?.validationScoreData) contextParts.push(`Validation Score Data: ${JSON.stringify(report.validationScoreData).slice(0, 500)}`);
    if (report?.swotData) contextParts.push(`SWOT Analysis: ${JSON.stringify(report.swotData).slice(0, 500)}`);
    if (report?.competitorData) contextParts.push(`Competitor Analysis: ${JSON.stringify(report.competitorData).slice(0, 500)}`);
    if (report?.marketData) contextParts.push(`Market Data: ${JSON.stringify(report.marketData).slice(0, 500)}`);
    if (report?.pricingStrategyData) contextParts.push(`Pricing Strategy: ${JSON.stringify(report.pricingStrategyData).slice(0, 300)}`);

    const systemPrompt = `You are an expert startup coach and mentor helping a founder validate and develop their business idea. You have deep knowledge about this specific idea:

${contextParts.join('\n')}

Based on all this context, provide specific, actionable advice. Be encouraging but honest. Reference the actual data when relevant. Keep responses concise (2-4 paragraphs max). If the user asks about something you have data on, cite it specifically.`;

    const llmMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ];

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: llmMessages,
        stream: true,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) throw new Error('LLM API error');

    // Stream the response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) { controller.close(); return; }
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let partialRead = '';
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            partialRead += decoder.decode(value, { stream: true });
            const lines = partialRead.split('\n');
            partialRead = lines.pop() || '';
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  controller.close();
                  return;
                }
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || '';
                  if (content) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch { /* skip */ }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
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
  } catch (error) {
    console.error('Idea coach error:', error);
    return NextResponse.json({ error: 'Failed to get coach response' }, { status: 500 });
  }
}
