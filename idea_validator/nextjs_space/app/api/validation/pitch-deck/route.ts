import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ideaContext } from "@/lib/validation-helper";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ideaId = request.nextUrl.searchParams.get("ideaId");
    if (!ideaId) return NextResponse.json({ error: "Missing ideaId" }, { status: 400 });

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: { validationReport: true },
    });
    if (!idea || idea.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // First generate pitch deck content via LLM
    const prompt = `You are a pitch deck expert. Create content for a 10-slide investor pitch deck for this business idea:

${ideaContext(idea)}

Provide the content in this exact JSON format:
{
  "slides": [
    { "slideNumber": 1, "title": "Company Name / Tagline", "type": "title", "content": "Compelling tagline", "notes": "Speaker notes" },
    { "slideNumber": 2, "title": "The Problem", "type": "problem", "content": "Problem description", "bulletPoints": ["point1", "point2", "point3"], "notes": "" },
    { "slideNumber": 3, "title": "The Solution", "type": "solution", "content": "Solution description", "bulletPoints": ["point1", "point2", "point3"], "notes": "" },
    { "slideNumber": 4, "title": "Market Opportunity", "type": "market", "content": "Market overview", "bulletPoints": ["TAM: $X", "SAM: $X", "Growth: X%"], "notes": "" },
    { "slideNumber": 5, "title": "Business Model", "type": "business_model", "content": "Revenue model description", "bulletPoints": ["Revenue stream 1", "Revenue stream 2"], "notes": "" },
    { "slideNumber": 6, "title": "Competitive Advantage", "type": "competition", "content": "Why we win", "bulletPoints": ["advantage1", "advantage2", "advantage3"], "notes": "" },
    { "slideNumber": 7, "title": "Go-To-Market Strategy", "type": "gtm", "content": "GTM approach", "bulletPoints": ["channel1", "channel2"], "notes": "" },
    { "slideNumber": 8, "title": "Traction & Milestones", "type": "traction", "content": "Progress so far / planned milestones", "bulletPoints": ["milestone1", "milestone2", "milestone3"], "notes": "" },
    { "slideNumber": 9, "title": "Financial Projections", "type": "financials", "content": "Revenue projections summary", "bulletPoints": ["Year 1: $X", "Year 2: $X", "Year 3: $X"], "notes": "" },
    { "slideNumber": 10, "title": "The Ask", "type": "ask", "content": "What we're looking for", "bulletPoints": ["Funding amount", "Use of funds 1", "Use of funds 2"], "notes": "" }
  ],
  "companyName": "${idea.title}"
}

Respond with ONLY valid JSON, no additional text.`;

    const llmResponse = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!llmResponse.ok) throw new Error('LLM API error');
    const llmData = await llmResponse.json();
    let deckContent = llmData.choices?.[0]?.message?.content || '';
    // Strip markdown fences
    deckContent = deckContent.trim();
    if (deckContent.startsWith('```')) {
      deckContent = deckContent.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }
    const deck = JSON.parse(deckContent);

    // Save deck data to DB
    await prisma.validationReport.upsert({
      where: { ideaId },
      update: { pitchDeckData: deck },
      create: { ideaId, pitchDeckData: deck },
    });

    return NextResponse.json({ success: true, deck });
  } catch (error) {
    console.error('Pitch deck error:', error);
    return NextResponse.json({ error: 'Failed to generate pitch deck' }, { status: 500 });
  }
}
