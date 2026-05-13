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

    const prompt = `You are a startup mentor and idea refinement expert. Based on the following business idea, suggest 3-5 concrete ways to improve, refine, or pivot the idea to increase its chances of success. Focus on addressing weaknesses and untapped opportunities.

${ideaContext(idea)}

Provide your suggestions in this exact JSON format:
{
  "currentAssessment": "Brief assessment of the idea's current state and main weaknesses",
  "suggestions": [
    {
      "type": "improve|pivot|expand|narrow|reposition",
      "title": "Short descriptive title",
      "description": "Detailed explanation of the suggestion",
      "expectedImpact": "What this change would improve",
      "effort": "low|medium|high",
      "example": "A real-world example or analogy"
    }
  ],
  "recommendedNext": "The single most important next step the founder should take"
}

Respond with ONLY valid JSON, no additional text.`;

    return handleValidationRequest(request, {
      fieldName: 'refinementData',
      prompt,
      maxTokens: 3000,
    });
  } catch (error) {
    console.error('Refinement error:', error);
    return NextResponse.json({ error: 'Failed to generate refinement suggestions' }, { status: 500 });
  }
}
