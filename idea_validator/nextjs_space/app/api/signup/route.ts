import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { normalizeEmail } from "@/lib/normalize-email";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { email: rawEmail, password, name } = await request.json();

    if (!rawEmail || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const email = normalizeEmail(rawEmail);
    const trimmedName = String(name).trim();

    if (!email.includes("@") || password.length < 8) {
      return NextResponse.json(
        { error: "Enter a valid email and a password of at least 8 characters." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists. Sign in instead." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: trimmedName,
      },
    });

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Could not create account. Check database connection and migrations." },
      { status: 500 }
    );
  }
}
