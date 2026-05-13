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

    const prompt = `You are a go-to-market strategist. Create a 30-60-90 day launch plan for this business idea:

${ideaContext(idea)}

Provide your plan in this exact JSON format:
{
  "phases": [
    {
      "name": "Phase 1: Foundation (Days 1-30)",
      "goal": "Primary goal for this phase",
      "tasks": [
        { "task": "Task description", "priority": "high|medium|low", "channel": "Channel or method" }
      ],
      "milestone": "Key milestone to hit"
    },
    {
      "name": "Phase 2: Launch (Days 31-60)",
      "goal": "Primary goal for this phase",
      "tasks": [
        { "task": "Task description", "priority": "high|medium|low", "channel": "Channel or method" }
      ],
      "milestone": "Key milestone to hit"
    },
    {
      "name": "Phase 3: Scale (Days 61-90)",
      "goal": "Primary goal for this phase",
      "tasks": [
        { "task": "Task description", "priority": "high|medium|low", "channel": "Channel or method" }
      ],
      "milestone": "Key milestone to hit"
    }
  ],
  "channels": [
    { "name": "Channel name", "priority": "primary|secondary", "reasoning": "Why this channel" }
  ],
  "first100Customers": "Specific strategy to acquire the first 100 customers",
  "keyMetrics": ["metric1", "metric2", "metric3"]
}

Provide 4-5 tasks per phase. Respond with ONLY valid JSON, no additional text.`;

    return handleValidationRequest(request, {
      fieldName: 'gtmPlanData',
      prompt,
      maxTokens: 4000,
    });
  } catch (error) {
    console.error('GTM plan error:', error);
    return NextResponse.json({ error: 'Failed to generate GTM plan' }, { status: 500 });
  }
}
