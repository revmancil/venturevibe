import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, description, targetAudience, problemStatement, category } = await request.json();

    if (!title || !description || !targetAudience || !problemStatement || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const idea = await prisma.idea.create({
      data: {
        userId: session.user.id,
        title,
        description,
        targetAudience,
        problemStatement,
        category,
        status: "pending",
      },
    });

    return NextResponse.json({
      message: "Idea submitted successfully",
      idea,
    });
  } catch (error) {
    console.error("Idea submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const ideas = await prisma.idea.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        validationReport: true,
      },
    });

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Fetch ideas error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
