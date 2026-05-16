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

    const prompt = `You are a startup CFO preparing investor-ready financial projections. Build baseline assumptions for a 5-year model.

${ideaContext(idea)}

Return ONLY valid JSON:
{
  "horizonYears": 5,
  "baseline": {
    "startingCustomers": 0,
    "monthlyCustomerGrowthRate": 0.06,
    "arpa": 49,
    "cogsPercent": 0.22,
    "monthlyFixedOpex": 12000,
    "monthlyMarketingSpend": 3000,
    "startingCash": 75000
  },
  "ranges": {
    "monthlyCustomerGrowthRate": { "min": 0.01, "max": 0.25, "step": 0.005 },
    "arpa": { "min": 9, "max": 500, "step": 1 },
    "cogsPercent": { "min": 0.05, "max": 0.6, "step": 0.01 },
    "monthlyFixedOpex": { "min": 0, "max": 200000, "step": 500 },
    "monthlyMarketingSpend": { "min": 0, "max": 100000, "step": 500 },
    "startingCash": { "min": 0, "max": 5000000, "step": 5000 }
  },
  "assumptions": ["3-5 bullet assumptions investors will ask about"],
  "investorNotes": "1-2 sentences on how to present this model in a meeting"
}

Use realistic numbers for this idea stage (pre-seed/seed). Respond with ONLY valid JSON.`;

    return handleValidationRequest(request, {
      fieldName: "financialProjectionsData",
      prompt,
      maxTokens: 3500,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
