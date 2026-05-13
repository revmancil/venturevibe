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

    const prompt = `You are a risk assessment expert. Evaluate the risks for this business idea:

${ideaContext(idea)}

Provide your analysis in this exact JSON format:
{
  "overallRiskLevel": "low|medium|high|critical",
  "riskScore": 45,
  "categories": [
    {
      "category": "Market Risk",
      "level": "low|medium|high",
      "risks": [
        { "risk": "Risk description", "impact": "high|medium|low", "likelihood": "high|medium|low", "mitigation": "How to mitigate" }
      ]
    },
    {
      "category": "Technical Risk",
      "level": "low|medium|high",
      "risks": [
        { "risk": "Risk description", "impact": "high|medium|low", "likelihood": "high|medium|low", "mitigation": "How to mitigate" }
      ]
    },
    {
      "category": "Financial Risk",
      "level": "low|medium|high",
      "risks": [
        { "risk": "Risk description", "impact": "high|medium|low", "likelihood": "high|medium|low", "mitigation": "How to mitigate" }
      ]
    },
    {
      "category": "Legal & Regulatory Risk",
      "level": "low|medium|high",
      "risks": [
        { "risk": "Risk description", "impact": "high|medium|low", "likelihood": "high|medium|low", "mitigation": "How to mitigate" }
      ]
    }
  ],
  "topRisks": ["Most critical risk 1", "Most critical risk 2", "Most critical risk 3"],
  "mitigationPlan": "Overall risk mitigation strategy summary"
}

Provide 2-3 risks per category. Respond with ONLY valid JSON, no additional text.`;

    return handleValidationRequest(request, {
      fieldName: 'riskAssessmentData',
      prompt,
      maxTokens: 3500,
    });
  } catch (error) {
    console.error('Risk assessment error:', error);
    return NextResponse.json({ error: 'Failed to generate risk assessment' }, { status: 500 });
  }
}
