import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcryptjs from "bcryptjs";
import { DEMO_TEST_EMAIL, DEMO_TEST_PASSWORD, isDemoLoginEnabled } from "./demo-auth";
import { normalizeEmail } from "./normalize-email";

export const authOptions: NextAuthOptions = {
  // Credentials + JWT only — PrismaAdapter conflicts with credential sign-in on serverless.
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = normalizeEmail(credentials.email);
        const password = credentials.password;

        try {
          const isDemoAttempt =
            email === DEMO_TEST_EMAIL && password === DEMO_TEST_PASSWORD;

          if (isDemoAttempt && isDemoLoginEnabled()) {
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
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
};
