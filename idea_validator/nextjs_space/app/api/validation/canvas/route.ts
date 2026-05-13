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

    const prompt = `You are a business model expert. Fill in a Business Model Canvas for this business idea:

${ideaContext(idea)}

Provide the canvas in this exact JSON format:
{
  "blocks": {
    "keyPartners": { "items": ["partner1", "partner2", "partner3"], "notes": "Additional context" },
    "keyActivities": { "items": ["activity1", "activity2", "activity3"], "notes": "Additional context" },
    "keyResources": { "items": ["resource1", "resource2", "resource3"], "notes": "Additional context" },
    "valuePropositions": { "items": ["value1", "value2", "value3"], "notes": "Additional context" },
    "customerRelationships": { "items": ["relationship1", "relationship2"], "notes": "Additional context" },
    "channels": { "items": ["channel1", "channel2", "channel3"], "notes": "Additional context" },
    "customerSegments": { "items": ["segment1", "segment2", "segment3"], "notes": "Additional context" },
    "costStructure": { "items": ["cost1", "cost2", "cost3"], "notes": "Additional context" },
    "revenueStreams": { "items": ["revenue1", "revenue2", "revenue3"], "notes": "Additional context" }
  },
  "summary": "One-paragraph business model summary"
}

Respond with ONLY valid JSON, no additional text.`;

    return handleValidationRequest(request, {
      fieldName: 'businessCanvasData',
      prompt,
      maxTokens: 3000,
    });
  } catch (error) {
    console.error('Business canvas error:', error);
    return NextResponse.json({ error: 'Failed to generate business canvas' }, { status: 500 });
  }
}
