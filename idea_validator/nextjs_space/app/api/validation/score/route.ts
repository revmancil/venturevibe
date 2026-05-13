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

    const prompt = `You are a startup validation expert. Evaluate this business idea and provide a validation score from 0 to 100.

${ideaContext(idea)}

Provide your analysis in this exact JSON format:
{
  "score": 75,
  "grade": "B+",
  "summary": "One-sentence overall assessment",
  "dimensions": [
    { "name": "Market Demand", "score": 80, "reasoning": "Why this score" },
    { "name": "Competition Level", "score": 65, "reasoning": "Why this score" },
    { "name": "Feasibility", "score": 70, "reasoning": "Why this score" },
    { "name": "Revenue Potential", "score": 75, "reasoning": "Why this score" },
    { "name": "Timing & Trends", "score": 80, "reasoning": "Why this score" }
  ],
  "topStrengths": ["strength1", "strength2", "strength3"],
  "topConcerns": ["concern1", "concern2", "concern3"],
  "verdict": "Clear recommendation: proceed, pivot, or pass with reasoning"
}

Respond with ONLY valid JSON, no additional text.`;

    return handleValidationRequest(request, {
      fieldName: 'validationScoreData',
      prompt,
      maxTokens: 2000,
    });
  } catch (error) {
    console.error('Score generation error:', error);
    return NextResponse.json({ error: 'Failed to generate score' }, { status: 500 });
  }
}
