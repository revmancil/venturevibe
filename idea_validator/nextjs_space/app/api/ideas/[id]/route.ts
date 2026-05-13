import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idea = await prisma.idea.findFirst({
      where: { id: params.id, userId: session.user.id },
      include: { validationReport: true },
    });

    if (!idea) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ idea });
  } catch (error) {
    console.error("Fetch idea error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idea = await prisma.idea.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!idea) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete validation report first (if exists), then idea
    await prisma.validationReport.deleteMany({ where: { ideaId: params.id } });
    await prisma.idea.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete idea error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
