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

    const prompt = `Perform a comprehensive SWOT analysis for this business idea:

${ideaContext(idea)}

Provide your analysis in this exact JSON format:
{
  "strengths": [
    { "title": "Short title", "description": "Detailed explanation" }
  ],
  "weaknesses": [
    { "title": "Short title", "description": "Detailed explanation" }
  ],
  "opportunities": [
    { "title": "Short title", "description": "Detailed explanation" }
  ],
  "threats": [
    { "title": "Short title", "description": "Detailed explanation" }
  ],
  "strategicInsight": "Overall strategic insight combining the SWOT findings"
}

Provide 3-4 items per category. Respond with ONLY valid JSON, no additional text.`;

    return handleValidationRequest(request, {
      fieldName: 'swotData',
      prompt,
      maxTokens: 3000,
    });
  } catch (error) {
    console.error('SWOT error:', error);
    return NextResponse.json({ error: 'Failed to generate SWOT' }, { status: 500 });
  }
}
