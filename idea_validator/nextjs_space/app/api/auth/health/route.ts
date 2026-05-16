import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAuthEnv, getAuthBaseUrl, getAuthSecret } from "@/lib/auth-env";

export const runtime = "nodejs";

/** Quick config check — visit /api/auth/health after deploy. */
export async function GET() {
  ensureAuthEnv();

  let database: "ok" | "error" = "error";
  try {
    await prisma.user.count();
    database = "ok";
  } catch {
    database = "error";
  }

  const databaseUrl = process.env.DATABASE_URL ?? "";
  const databaseUrlValid = /^postgres(ql)?:\/\//.test(databaseUrl);

  return NextResponse.json({
    database,
    databaseUrlValid,
    nextAuthSecret: Boolean(getAuthSecret()),
    nextAuthUrl: process.env.NEXTAUTH_URL ? "set" : "missing",
    authBaseUrl: getAuthBaseUrl(),
  });
}
