import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ideaId, deck } = await request.json();
    if (!ideaId || !deck) {
      return NextResponse.json({ error: "Missing ideaId or deck" }, { status: 400 });
    }

    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea || idea.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.validationReport.update({
      where: { ideaId },
      data: { pitchDeckData: deck },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save pitch deck error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
