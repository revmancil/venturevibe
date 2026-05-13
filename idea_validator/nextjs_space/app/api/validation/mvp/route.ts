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

    const prompt = `You are a product strategy expert. Recommend the MVP (Minimum Viable Product) feature set for this business idea:

${ideaContext(idea)}

Provide your recommendations in this exact JSON format:
{
  "mvpVision": "One-sentence MVP vision statement",
  "coreProblem": "The single core problem the MVP must solve",
  "mustHave": [
    { "feature": "Feature name", "description": "What it does", "effort": "low|medium|high", "impact": "high|medium|low", "reasoning": "Why this is essential" }
  ],
  "niceToHave": [
    { "feature": "Feature name", "description": "What it does", "effort": "low|medium|high", "phase": "v1.1|v1.2|v2.0" }
  ],
  "techStack": ["Recommended tech/tool 1", "Recommended tech/tool 2"],
  "estimatedTimeline": "Estimated build time for MVP",
  "launchChecklist": ["Pre-launch item 1", "Pre-launch item 2", "Pre-launch item 3"]
}

Provide 5-7 must-have features and 3-4 nice-to-have. Respond with ONLY valid JSON, no additional text.`;

    return handleValidationRequest(request, {
      fieldName: 'mvpFeaturesData',
      prompt,
      maxTokens: 3000,
    });
  } catch (error) {
    console.error('MVP features error:', error);
    return NextResponse.json({ error: 'Failed to generate MVP features' }, { status: 500 });
  }
}
