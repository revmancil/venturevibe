import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAuthEnv, getAuthBaseUrl, getAuthSecret } from "@/lib/auth-env";

export const runtime = "nodejs";

/** Quick config check — visit /api/auth/health after deploy. */
export async function GET() {
  ensureAuthEnv();

  let database: "ok" | "error" = "error";
  let databaseHint: string | undefined;

  try {
    await prisma.user.count();
    database = "ok";
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("P1001") || message.includes("Can't reach database")) {
      databaseHint =
        "Cannot reach Postgres from Vercel. Use Supabase Session pooler URI (Connect tab), not direct db.*.supabase.co:5432.";
    } else if (message.includes("P1000")) {
      databaseHint = "Database rejected credentials. Reset password in Supabase and update DATABASE_URL on Vercel.";
    } else if (message.includes("P1012")) {
      databaseHint = "DATABASE_URL must start with postgresql:// or postgres://";
    } else {
      databaseHint = "Database connection failed. Check DATABASE_URL on Vercel.";
    }
  }

  const databaseUrl = process.env.DATABASE_URL ?? "";
  const databaseUrlValid = /^postgres(ql)?:\/\//.test(databaseUrl);
  const configuredNextAuthUrl = process.env.NEXTAUTH_URL?.trim();
  const nextAuthUrlLooksLocal = /localhost|127\.0\.0\.1/i.test(configuredNextAuthUrl ?? "");

  return NextResponse.json({
    database,
    databaseHint,
    databaseUrlValid,
    nextAuthSecret: Boolean(getAuthSecret()),
    nextAuthUrl: configuredNextAuthUrl ? "set" : "missing",
    nextAuthUrlLooksLocal,
    authBaseUrl: getAuthBaseUrl(),
    onVercel: process.env.VERCEL === "1",
  });
}
