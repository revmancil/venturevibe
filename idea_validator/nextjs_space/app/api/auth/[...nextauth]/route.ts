import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureAuthEnv } from "@/lib/auth-env";

export const runtime = "nodejs";

ensureAuthEnv();

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
