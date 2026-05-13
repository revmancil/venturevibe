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

    const prompt = `You are a pricing strategy consultant. Suggest pricing strategies for this business idea:

${ideaContext(idea)}

Provide your analysis in this exact JSON format:
{
  "recommendedModel": "subscription|freemium|one-time|usage-based|marketplace",
  "modelReasoning": "Why this pricing model fits best",
  "tiers": [
    {
      "name": "Tier name",
      "price": "$X/month or $X one-time",
      "target": "Who this tier is for",
      "features": ["feature1", "feature2", "feature3"]
    }
  ],
  "revenueProjection": {
    "year1": "$X estimated revenue",
    "year2": "$X estimated revenue",
    "year3": "$X estimated revenue",
    "assumptions": "Key assumptions behind projections"
  },
  "competitorPricing": [
    { "competitor": "Name", "price": "Their pricing", "comparison": "How yours compares" }
  ],
  "keyInsights": ["insight1", "insight2", "insight3"]
}

Provide 2-3 tiers. Respond with ONLY valid JSON, no additional text.`;

    return handleValidationRequest(request, {
      fieldName: 'pricingStrategyData',
      prompt,
      maxTokens: 3000,
    });
  } catch (error) {
    console.error('Pricing strategy error:', error);
    return NextResponse.json({ error: 'Failed to generate pricing strategy' }, { status: 500 });
  }
}
