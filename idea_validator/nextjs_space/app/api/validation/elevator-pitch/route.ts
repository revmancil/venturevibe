import { NextRequest, NextResponse } from "next/server";
import { handleValidationRequest, ideaContext } from "@/lib/validation-helper";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const ideaId = request.nextUrl.searchParams.get("ideaId");
    if (!ideaId) return NextResponse.json({ error: "Missing ideaId" }, { status: 400 });
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const prompt = `You are an expert pitch writer. Create multiple elevator pitch variations for this business idea:

${ideaContext(idea)}

Provide pitches in this exact JSON format:
{
  "pitches": [
    {
      "type": "one-liner",
      "label": "The One-Liner (10 seconds)",
      "pitch": "A single compelling sentence"
    },
    {
      "type": "elevator",
      "label": "Elevator Pitch (30 seconds)",
      "pitch": "3-4 sentence pitch covering problem, solution, and why now"
    },
    {
      "type": "investor",
      "label": "Investor Pitch (60 seconds)",
      "pitch": "5-6 sentence pitch covering problem, solution, market, traction potential, and ask"
    },
    {
      "type": "storytelling",
      "label": "Storytelling Pitch (90 seconds)",
      "pitch": "A narrative-driven pitch that starts with a relatable scenario"
    },
    {
      "type": "tweet",
      "label": "Twitter/X Pitch (280 chars)",
      "pitch": "Tweet-length pitch with hashtags"
    }
  ],
  "tipsForDelivery": ["tip1", "tip2", "tip3"]
}

Make each pitch compelling, specific, and action-oriented. Respond with ONLY valid JSON, no additional text.`;

    return handleValidationRequest(request, {
      fieldName: 'elevatorPitchData',
      prompt,
      maxTokens: 2500,
    });
  } catch (error) {
    console.error('Elevator pitch error:', error);
    return NextResponse.json({ error: 'Failed to generate elevator pitches' }, { status: 500 });
  }
}
