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

    const report = idea.validationReport;
    const extra = report
      ? `\nExisting validation context (use if present):\n- Market data: ${JSON.stringify(report.marketData || {}).slice(0, 800)}\n- Competitors: ${JSON.stringify(report.competitorData || {}).slice(0, 800)}\n- Validation score: ${JSON.stringify(report.validationScoreData || {}).slice(0, 400)}`
      : "";

    const prompt = `You are a venture investor assessing how "investor ready" a startup is BEFORE a first institutional meeting.

${ideaContext(idea)}${extra}

Score each dimension 0-100 and compute a weighted overall score. Be honest but constructive.

Return ONLY valid JSON:
{
  "overallScore": 68,
  "readinessLevel": "Early but promising | Approaching ready | Investor ready | Not yet ready",
  "dimensions": [
    {
      "id": "traction",
      "name": "Traction & validation",
      "score": 55,
      "weight": 20,
      "summary": "What evidence exists today",
      "signals": ["positive signal 1", "gap 1"]
    },
    {
      "id": "market",
      "name": "Market size & timing",
      "score": 75,
      "weight": 20,
      "summary": "",
      "signals": []
    },
    {
      "id": "team",
      "name": "Team & execution",
      "score": 60,
      "weight": 15,
      "summary": "",
      "signals": []
    },
    {
      "id": "defensibility",
      "name": "Defensibility & moat",
      "score": 50,
      "weight": 15,
      "summary": "",
      "signals": []
    },
    {
      "id": "financials",
      "name": "Financial clarity",
      "score": 45,
      "weight": 15,
      "summary": "",
      "signals": []
    },
    {
      "id": "story",
      "name": "Narrative & pitch",
      "score": 70,
      "weight": 15,
      "summary": "",
      "signals": []
    }
  ],
  "topStrengths": ["strength 1", "strength 2"],
  "criticalGaps": ["gap investors will probe", "gap 2"],
  "meetingPrepChecklist": ["action before meeting 1", "action 2", "action 3"],
  "estimatedMonthsToInvestorReady": 4
}

Respond with ONLY valid JSON.`;

    return handleValidationRequest(request, {
      fieldName: "fundingReadinessData",
      prompt,
      maxTokens: 4000,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
