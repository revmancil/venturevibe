import { NextRequest, NextResponse } from "next/server";
import { handleValidationRequest, ideaContext } from "@/lib/validation-helper";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const ideaId = request.nextUrl.searchParams.get("ideaId");
    if (!ideaId) return NextResponse.json({ error: "Missing ideaId" }, { status: 400 });
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: { validationReport: true },
    });
    if (!idea) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const competitorHint = idea.validationReport?.competitorData
      ? `\nKnown competitors from prior analysis: ${JSON.stringify(idea.validationReport.competitorData).slice(0, 1200)}`
      : "";

    const prompt = `You are a strategy consultant building a competitive positioning map for investors.

${ideaContext(idea)}${competitorHint}

Choose two axes that matter most for this market (e.g. price vs features, niche vs breadth). Place the startup and 4-8 competitors on a 2x2 using x and y from 0.0 (low) to 1.0 (high).

Return ONLY valid JSON:
{
  "xAxis": { "label": "Axis name", "lowLabel": "left pole", "highLabel": "right pole" },
  "yAxis": { "label": "Axis name", "lowLabel": "bottom pole", "highLabel": "top pole" },
  "startup": { "name": "short startup label", "x": 0.72, "y": 0.65 },
  "competitors": [
    { "name": "Competitor", "x": 0.35, "y": 0.8, "note": "one line positioning" }
  ],
  "whiteSpace": "Where unmet demand / opportunity sits on the map",
  "quadrantInsights": {
    "topLeft": "insight",
    "topRight": "insight",
    "bottomLeft": "insight",
    "bottomRight": "insight"
  },
  "strategicRecommendation": "How to win this quadrant in 2-3 sentences"
}

Respond with ONLY valid JSON.`;

    return handleValidationRequest(request, {
      fieldName: "positioningMapData",
      prompt,
      maxTokens: 3500,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
