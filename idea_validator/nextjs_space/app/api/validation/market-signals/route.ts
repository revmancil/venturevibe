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

    const today = new Date().toISOString().split('T')[0];

    const prompt = `You are a market intelligence analyst. Generate a current market signals snapshot for this business idea. Use your knowledge of recent industry trends, search behavior, news, funding activity, and competitor moves.

${ideaContext(idea)}

Today's date: ${today}

Return ONLY valid JSON in this exact format:
{
  "snapshotDate": "${today}",
  "overallTrend": "heating-up | steady | cooling-down",
  "trendScore": 75,
  "summary": "One sentence summary of where this market is heading right now.",
  "keyTrends": [
    { "title": "AI integration in this space", "direction": "up", "magnitude": "strong", "explanation": "Why this trend matters for the idea" },
    { "title": "Regulatory pressure", "direction": "up", "magnitude": "moderate", "explanation": "..." }
  ],
  "searchInterest": {
    "verdict": "rising | stable | falling",
    "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
    "notes": "What people are searching for in this niche right now"
  },
  "recentMoves": [
    { "actor": "Company or sector", "event": "What happened", "timeframe": "last 30 days | last 90 days", "implication": "What it means for this idea" },
    { "actor": "...", "event": "...", "timeframe": "...", "implication": "..." },
    { "actor": "...", "event": "...", "timeframe": "...", "implication": "..." }
  ],
  "fundingActivity": {
    "level": "high | moderate | low",
    "notable": ["Brief mention of recent rounds or M&A in this space"],
    "implication": "What this signals about market timing"
  },
  "opportunities": [
    "Specific opportunity #1 the user could exploit right now",
    "Specific opportunity #2",
    "Specific opportunity #3"
  ],
  "risks": [
    "Specific risk or threat to monitor #1",
    "Specific risk or threat to monitor #2"
  ],
  "actionItems": [
    "Concrete next move the founder should take this week given current signals",
    "Second concrete next move",
    "Third concrete next move"
  ]
}

Be specific and concrete. Tie every observation back to this exact idea. Respond with ONLY valid JSON.`;

    return handleValidationRequest(request, {
      fieldName: 'marketSignalsData',
      prompt,
      maxTokens: 2500,
      afterSave: async (id, parsed) => {
        // Append this snapshot to the history array (keep last 12)
        const report = await prisma.validationReport.findUnique({ where: { ideaId: id }, select: { marketSignalsHistory: true } });
        const history = Array.isArray((report as any)?.marketSignalsHistory) ? ((report as any).marketSignalsHistory as any[]) : [];
        const snapshot = { date: parsed.snapshotDate || today, trendScore: parsed.trendScore, overallTrend: parsed.overallTrend, summary: parsed.summary };
        history.push(snapshot);
        const trimmed = history.slice(-12); // keep last 12 snapshots
        await prisma.validationReport.update({ where: { ideaId: id }, data: { marketSignalsHistory: trimmed } });
      },
    });
  } catch (error) {
    console.error('Market signals error:', error);
    return NextResponse.json({ error: 'Failed to generate market signals' }, { status: 500 });
  }
}
