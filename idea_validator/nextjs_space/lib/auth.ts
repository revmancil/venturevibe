import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcryptjs from "bcryptjs";
import { DEMO_TEST_EMAIL, DEMO_TEST_PASSWORD } from "./demo-auth";
import { normalizeEmail } from "./normalize-email";
import { ensureAuthEnv, getAuthSecret } from "./auth-env";

ensureAuthEnv();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (!getAuthSecret()) {
          throw new Error("Configuration");
        }

        if (!process.env.DATABASE_URL?.match(/^postgres(ql)?:\/\//)) {
          throw new Error("Configuration");
        }

        const email = normalizeEmail(credentials.email);
        const password = credentials.password;

        try {
          const isDemoAttempt =
            email === DEMO_TEST_EMAIL && password === DEMO_TEST_PASSWORD;

          // Demo credentials are public in lib/demo-auth.ts — always ensure user exists.
          if (isDemoAttempt) {
            const hashedPassword = await bcryptjs.hash(DEMO_TEST_PASSWORD, 10);
            await prisma.user.upsert({
              where: { email: DEMO_TEST_EMAIL },
              update: {
                password: hashedPassword,
                name: "Demo Founder",
              },
              create: {
                email: DEMO_TEST_EMAIL,
                password: hashedPassword,
                name: "Demo Founder",
              },
            });
          }

          const user = await prisma.user.findFirst({
            where: { email: { equals: email, mode: "insensitive" } },
          });

          if (!user?.password) {
            return null;
          }

          const isPasswordValid = await bcryptjs.compare(password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("[auth] authorize failed:", error);
          const message = error instanceof Error ? error.message : String(error);
          if (
            message.includes("Can't reach database") ||
            message.includes("P1001") ||
            message.includes("P1012") ||
            message.includes("Connection")
          ) {
            throw new Error("Configuration");
          }
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const id = (user as { id: string }).id;
        token.id = id;
        token.sub = id;
      }
      return token;
    },
    async session({ session, token }) {
      const userId = (token.id ?? token.sub) as string | undefined;
      if (session.user && userId) {
        (session.user as { id: string }).id = userId;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  secret: getAuthSecret(),
};
