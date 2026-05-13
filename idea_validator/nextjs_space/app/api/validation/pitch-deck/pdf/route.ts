import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function generatePitchDeckHTML(deck: any): string {
  const companyName = deck.companyName || 'Pitch Deck';
  const slides = deck.slides || [];

  const slideTypeColors: Record<string, { bg: string; accent: string }> = {
    title: { bg: '#4F46E5', accent: '#818CF8' },
    problem: { bg: '#DC2626', accent: '#FCA5A5' },
    solution: { bg: '#059669', accent: '#6EE7B7' },
    market: { bg: '#2563EB', accent: '#93C5FD' },
    business_model: { bg: '#7C3AED', accent: '#C4B5FD' },
    competition: { bg: '#D97706', accent: '#FCD34D' },
    gtm: { bg: '#EA580C', accent: '#FDBA74' },
    traction: { bg: '#0891B2', accent: '#67E8F9' },
    financials: { bg: '#4338CA', accent: '#A5B4FC' },
    ask: { bg: '#BE185D', accent: '#F9A8D4' },
  };

  const slidesHTML = slides.map((slide: any) => {
    const colors = slideTypeColors[slide.type] || { bg: '#4F46E5', accent: '#818CF8' };
    const bulletHTML = slide.bulletPoints?.length
      ? `<ul style="margin:24px 0 0 0;padding:0;list-style:none;">${slide.bulletPoints.map((bp: string) =>
        `<li style="color:#fff;font-size:18px;line-height:1.6;padding:6px 0 6px 24px;position:relative;"><span style="position:absolute;left:0;color:${colors.accent};">&#9656;</span>${bp}</li>`
      ).join('')}</ul>` : '';

    if (slide.type === 'title') {
      return `<div class="slide" style="background:linear-gradient(135deg, ${colors.bg}, ${colors.accent});display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:60px;">
        <h1 style="color:#fff;font-size:48px;font-weight:800;margin:0 0 20px 0;letter-spacing:-1px;">${companyName}</h1>
        <p style="color:rgba(255,255,255,0.9);font-size:24px;margin:0;font-weight:300;">${slide.content || ''}</p>
      </div>`;
    }

    return `<div class="slide" style="background:${colors.bg};padding:48px 56px;display:flex;flex-direction:column;">
      <div style="margin-bottom:8px;font-size:12px;color:${colors.accent};font-weight:600;letter-spacing:2px;text-transform:uppercase;">SLIDE ${slide.slideNumber}</div>
      <h2 style="color:#fff;font-size:36px;font-weight:700;margin:0 0 16px 0;letter-spacing:-0.5px;">${slide.title}</h2>
      <p style="color:rgba(255,255,255,0.85);font-size:18px;line-height:1.6;margin:0;">${slide.content || ''}</p>
      ${bulletHTML}
    </div>`;
  }).join('');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',system-ui,sans-serif; }
  .slide { width:100%; height:100%; page-break-after:always; min-height:100vh; }
  .slide:last-child { page-break-after:auto; }
</style></head><body>${slidesHTML}</body></html>`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ideaId } = await request.json();
    if (!ideaId) return NextResponse.json({ error: "Missing ideaId" }, { status: 400 });

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: { validationReport: true },
    });
    if (!idea || idea.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const deckData = idea.validationReport?.pitchDeckData as any;
    if (!deckData) {
      return NextResponse.json({ error: "No pitch deck data. Generate the pitch deck first." }, { status: 400 });
    }

    const html = generatePitchDeckHTML(deckData);

    // Create PDF request
    const createResponse = await fetch('https://apps.abacus.ai/api/createConvertHtmlToPdfRequest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        html_content: html,
        pdf_options: {
          format: 'A4',
          landscape: true,
          print_background: true,
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
        },
      }),
    });

    if (!createResponse.ok) {
      return NextResponse.json({ error: 'Failed to create PDF request' }, { status: 500 });
    }

    const { request_id } = await createResponse.json();
    if (!request_id) {
      return NextResponse.json({ error: 'No request ID' }, { status: 500 });
    }

    // Poll for status
    let attempts = 0;
    while (attempts < 120) {
      await new Promise(r => setTimeout(r, 1000));
      const statusRes = await fetch('https://apps.abacus.ai/api/getConvertHtmlToPdfStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id, deployment_token: process.env.ABACUSAI_API_KEY }),
      });
      const statusResult = await statusRes.json();
      if (statusResult?.status === 'SUCCESS' && statusResult?.result?.result) {
        const pdfBuffer = Buffer.from(statusResult.result.result, 'base64');
        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${idea.title.replace(/[^a-zA-Z0-9]/g, '_')}_Pitch_Deck.pdf"`,
          },
        });
      }
      if (statusResult?.status === 'FAILED') {
        return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
      }
      attempts++;
    }

    return NextResponse.json({ error: 'PDF generation timed out' }, { status: 500 });
  } catch (error) {
    console.error('Pitch deck PDF error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
