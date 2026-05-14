import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ideaContext } from "@/lib/validation-helper";
import { deepSanitizeUnicode } from "@/lib/sanitize-unicode";
import { getLlmApiKey, getLlmChatCompletionsUrl, getLlmModel } from "@/lib/llm-config";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ideaId, slideNumber, slideType, slideTitle } = await request.json();
    if (!ideaId || !slideNumber) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: { validationReport: true },
    });
    if (!idea || idea.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const prompt = `You are a pitch deck expert. Regenerate ONLY slide ${slideNumber} for this business idea:

${ideaContext(idea)}

The slide type is "${slideType}" and should be titled "${slideTitle}".
Provide fresh, improved content for this single slide.

Respond in this exact JSON format:
{
  "slideNumber": ${slideNumber},
  "title": "${slideTitle}",
  "type": "${slideType}",
  "content": "Main description text",
  "bulletPoints": ["point1", "point2", "point3"],
  "notes": "Speaker notes for this slide"
}

Respond with ONLY valid JSON, no additional text.`;

    const apiKey = getLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "LLM not configured", hint: "Set AI_API_KEY or ABACUSAI_API_KEY." },
        { status: 503 }
      );
    }

    const llmResponse = await fetch(getLlmChatCompletionsUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: getLlmModel(),
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!llmResponse.ok) throw new Error("LLM API error");
    const llmData = await llmResponse.json();
    let slideContent = llmData.choices?.[0]?.message?.content || "";
    slideContent = slideContent.trim();
    if (slideContent.startsWith("```")) {
      slideContent = slideContent.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }
    const newSlide = deepSanitizeUnicode(JSON.parse(slideContent));

    return NextResponse.json({ success: true, slide: newSlide });
  } catch (error) {
    console.error("Regenerate slide error:", error);
    return NextResponse.json({ error: "Failed to regenerate slide" }, { status: 500 });
  }
}
