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

    const prompt = `You are a SaaS revenue modeling expert. Generate realistic baseline assumptions for a financial simulation of this business idea.

${ideaContext(idea)}

Return ONLY valid JSON in this exact format:
{
  "businessModel": "subscription | one-time | freemium | marketplace",
  "baseline": {
    "pricePerCustomer": 29,
    "monthlyVisitors": 2000,
    "visitorToSignupRate": 0.05,
    "signupToPaidRate": 0.10,
    "monthlyChurnRate": 0.05,
    "variableCostPerCustomer": 3,
    "monthlyFixedCosts": 500
  },
  "ranges": {
    "pricePerCustomer": { "min": 5, "max": 200, "step": 1 },
    "monthlyVisitors": { "min": 100, "max": 50000, "step": 100 },
    "visitorToSignupRate": { "min": 0.005, "max": 0.30, "step": 0.005 },
    "signupToPaidRate": { "min": 0.01, "max": 0.50, "step": 0.01 },
    "monthlyChurnRate": { "min": 0.01, "max": 0.30, "step": 0.005 },
    "variableCostPerCustomer": { "min": 0, "max": 100, "step": 1 },
    "monthlyFixedCosts": { "min": 0, "max": 50000, "step": 100 }
  },
  "assumptions": ["explanation of why this price is reasonable", "why this conversion rate is realistic for this industry", "why this churn rate is typical"],
  "benchmarks": {
    "industry": "name of industry",
    "typicalConversion": "2-5% for SaaS",
    "typicalChurn": "5-7% monthly for SMB SaaS",
    "typicalCAC": "$50-200 for low-touch SaaS"
  }
}

Make the baseline numbers realistic for this specific idea and target audience. Pick numbers that would lead to a viable but not unrealistic business. Respond with ONLY valid JSON.`;

    return handleValidationRequest(request, {
      fieldName: 'revenueSimData',
      prompt,
      maxTokens: 1500,
    });
  } catch (error) {
    console.error('Revenue sim error:', error);
    return NextResponse.json({ error: 'Failed to generate revenue simulation' }, { status: 500 });
  }
}
