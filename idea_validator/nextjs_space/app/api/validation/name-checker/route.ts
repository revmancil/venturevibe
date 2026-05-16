import { NextRequest, NextResponse } from "next/server";
import { handleValidationRequest, ideaContext } from "@/lib/validation-helper";
import { checkDomainsForRoot } from "@/lib/domain-check";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const ideaId = request.nextUrl.searchParams.get("ideaId");
    if (!ideaId) return NextResponse.json({ error: "Missing ideaId" }, { status: 400 });
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const prompt = `You are a startup naming expert. Generate distinctive, brandable company name ideas for this venture.

${ideaContext(idea)}

Return ONLY valid JSON:
{
  "names": [
    {
      "name": "BrandName",
      "tagline": "5-8 word tagline",
      "domainRoot": "brandname",
      "trademarkRisk": "low | medium | high",
      "trademarkNote": "Brief non-legal note on common-word or obvious conflict risk",
      "whyItWorks": "Why it fits this idea"
    }
  ],
  "namingTips": ["tip for choosing among these", "tip 2"],
  "disclaimer": "Domain and trademark checks are preliminary screening only—not legal advice."
}

Provide exactly 10 names. domainRoot must be lowercase alphanumeric only (no spaces). Respond with ONLY valid JSON.`;

    return handleValidationRequest(request, {
      fieldName: "nameCheckerData",
      prompt,
      maxTokens: 4000,
      afterSave: async (id, parsed) => {
        const names = Array.isArray(parsed?.names) ? parsed.names : [];
        const enriched = await Promise.all(
          names.map(async (entry: { domainRoot?: string; [key: string]: unknown }) => {
            const root = String(entry.domainRoot || "").toLowerCase();
            const domains = root ? await checkDomainsForRoot(root) : {};
            return { ...entry, domains };
          })
        );
        await prisma.validationReport.update({
          where: { ideaId: id },
          data: {
            nameCheckerData: {
              ...parsed,
              names: enriched,
              domainsCheckedAt: new Date().toISOString(),
            },
          },
        });
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
