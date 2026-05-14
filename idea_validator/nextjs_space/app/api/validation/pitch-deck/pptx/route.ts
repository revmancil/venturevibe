import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PptxGenJS from 'pptxgenjs';

export const dynamic = "force-dynamic";

const THEME_COLORS: Record<string, Record<string, { bg: string; accent: string }>> = {
  default: { title: { bg: '4F46E5', accent: '818CF8' }, problem: { bg: 'DC2626', accent: 'FCA5A5' }, solution: { bg: '059669', accent: '6EE7B7' }, market: { bg: '2563EB', accent: '93C5FD' }, business_model: { bg: '7C3AED', accent: 'C4B5FD' }, competition: { bg: 'D97706', accent: 'FCD34D' }, gtm: { bg: 'EA580C', accent: 'FDBA74' }, traction: { bg: '0891B2', accent: '67E8F9' }, financials: { bg: '4338CA', accent: 'A5B4FC' }, ask: { bg: 'BE185D', accent: 'F9A8D4' } },
  corporate: { title: { bg: '1E3A5F', accent: '4A90D9' }, problem: { bg: '2C3E50', accent: '7F8C8D' }, solution: { bg: '1E3A5F', accent: '4A90D9' }, market: { bg: '34495E', accent: '5DADE2' }, business_model: { bg: '2C3E50', accent: '85C1E9' }, competition: { bg: '1B2631', accent: 'AED6F1' }, gtm: { bg: '34495E', accent: '82E0AA' }, traction: { bg: '1E3A5F', accent: 'F7DC6F' }, financials: { bg: '2C3E50', accent: 'BB8FCE' }, ask: { bg: '1B2631', accent: 'F1948A' } },
  startup: { title: { bg: '7C3AED', accent: 'DDD6FE' }, problem: { bg: 'EF4444', accent: 'FEE2E2' }, solution: { bg: '10B981', accent: 'D1FAE5' }, market: { bg: '3B82F6', accent: 'DBEAFE' }, business_model: { bg: 'F59E0B', accent: 'FEF3C7' }, competition: { bg: 'EC4899', accent: 'FCE7F3' }, gtm: { bg: '8B5CF6', accent: 'EDE9FE' }, traction: { bg: '06B6D4', accent: 'CFFAFE' }, financials: { bg: '6366F1', accent: 'E0E7FF' }, ask: { bg: 'F43F5E', accent: 'FFE4E6' } },
  dark: { title: { bg: '111827', accent: '6366F1' }, problem: { bg: '1F2937', accent: 'EF4444' }, solution: { bg: '1F2937', accent: '10B981' }, market: { bg: '111827', accent: '3B82F6' }, business_model: { bg: '1F2937', accent: 'F59E0B' }, competition: { bg: '111827', accent: 'EC4899' }, gtm: { bg: '1F2937', accent: '8B5CF6' }, traction: { bg: '111827', accent: '06B6D4' }, financials: { bg: '1F2937', accent: '818CF8' }, ask: { bg: '111827', accent: 'F43F5E' } },
  minimal: { title: { bg: 'FFFFFF', accent: '111827' }, problem: { bg: 'F9FAFB', accent: 'DC2626' }, solution: { bg: 'FFFFFF', accent: '059669' }, market: { bg: 'F9FAFB', accent: '2563EB' }, business_model: { bg: 'FFFFFF', accent: '7C3AED' }, competition: { bg: 'F9FAFB', accent: 'D97706' }, gtm: { bg: 'FFFFFF', accent: 'EA580C' }, traction: { bg: 'F9FAFB', accent: '0891B2' }, financials: { bg: 'FFFFFF', accent: '4338CA' }, ask: { bg: 'F9FAFB', accent: 'BE185D' } },
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ideaId, theme, includeNotes, logoUrl } = await request.json();
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
      return NextResponse.json({ error: "No pitch deck data" }, { status: 400 });
    }

    const slides = deckData.slides || [];
    const ct = THEME_COLORS[theme || 'default'] || THEME_COLORS.default;
    const isMinimal = theme === 'minimal';

    const pptx = new PptxGenJS();
    pptx.author = 'VentureVibe';
    pptx.title = deckData.companyName || 'Pitch Deck';
    pptx.layout = 'LAYOUT_WIDE';

    for (const s of slides) {
      const c = ct[s.type] || ct.title || { bg: '4F46E5', accent: '818CF8' };
      const pptSlide = pptx.addSlide();
      pptSlide.background = { color: c.bg };
      const fontColor = isMinimal ? c.accent : 'FFFFFF';

      if (s.type === 'title') {
        if (logoUrl) {
          try { pptSlide.addImage({ path: logoUrl, x: 4.5, y: 0.5, w: 1.5, h: 0.8, sizing: { type: 'contain', w: 1.5, h: 0.8 } }); } catch {}
        }
        pptSlide.addText(deckData.companyName || s.title, { x: 0.5, y: 2.0, w: '90%', fontSize: 44, bold: true, color: fontColor, align: 'center' });
        if (s.content) pptSlide.addText(s.content, { x: 0.5, y: 3.2, w: '90%', fontSize: 22, color: fontColor, align: 'center' });
      } else {
        pptSlide.addText(`SLIDE ${s.slideNumber}`, { x: 0.5, y: 0.3, fontSize: 10, color: c.accent, bold: true, charSpacing: 3 });
        pptSlide.addText(s.title, { x: 0.5, y: 0.7, w: '85%', fontSize: 32, bold: true, color: fontColor });
        if (s.content) pptSlide.addText(s.content, { x: 0.5, y: 1.5, w: '85%', fontSize: 16, color: fontColor });
        if (s.bulletPoints?.length) {
          const bpText = s.bulletPoints.map((bp: string) => ({ text: `\u25B6 ${bp}\n`, options: { fontSize: 14, color: fontColor, paraSpaceAfter: 6 } }));
          pptSlide.addText(bpText as any, { x: 0.5, y: 2.4, w: '85%' });
        }
        if (logoUrl) {
          try { pptSlide.addImage({ path: logoUrl, x: 11.5, y: 0.2, w: 1, h: 0.5, sizing: { type: 'contain', w: 1, h: 0.5 } }); } catch {}
        }
      }
      if (includeNotes && s.notes) {
        pptSlide.addNotes(s.notes);
      }
    }

    const buffer = await pptx.write({ outputType: 'nodebuffer' }) as Buffer;
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${(deckData.companyName || 'Pitch_Deck').replace(/[^a-zA-Z0-9]/g, '_')}.pptx"`,
      },
    });
  } catch (error) {
    console.error('PPTX generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PPTX' }, { status: 500 });
  }
}
