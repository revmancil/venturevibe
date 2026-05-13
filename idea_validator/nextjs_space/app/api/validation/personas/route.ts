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

    const prompt = `You are a customer research expert. Create detailed customer personas for this business idea:

${ideaContext(idea)}

Provide 3 personas in this exact JSON format:
{
  "personas": [
    {
      "name": "Persona Name (e.g., 'Startup Sarah')",
      "age": "Age range",
      "occupation": "Job title / role",
      "income": "Income range",
      "location": "Where they live/work",
      "bio": "2-3 sentence backstory",
      "goals": ["goal1", "goal2", "goal3"],
      "painPoints": ["pain1", "pain2", "pain3"],
      "motivations": ["motivation1", "motivation2"],
      "objections": ["Why they might not buy"],
      "channels": ["Where to reach them (e.g., LinkedIn, Twitter, Reddit)"],
      "quote": "A realistic quote from this persona about their problem"
    }
  ],
  "commonThemes": ["theme shared across personas"],
  "acquisitionStrategy": "How to reach these personas effectively"
}

Respond with ONLY valid JSON, no additional text.`;

    return handleValidationRequest(request, {
      fieldName: 'personasData',
      prompt,
      maxTokens: 3500,
    });
  } catch (error) {
    console.error('Personas error:', error);
    return NextResponse.json({ error: 'Failed to generate personas' }, { status: 500 });
  }
}
