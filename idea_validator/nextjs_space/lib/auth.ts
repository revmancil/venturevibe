import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcryptjs from "bcryptjs";
import { DEMO_TEST_EMAIL, DEMO_TEST_PASSWORD } from "./demo-auth";

function shouldAutoProvisionDemoUser(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_SHOW_DEMO_LOGIN === "true"
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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

        const email = credentials.email.trim();
        const password = credentials.password;

        const isDemoAttempt =
          email.toLowerCase() === DEMO_TEST_EMAIL.toLowerCase() &&
          password === DEMO_TEST_PASSWORD;

        if (isDemoAttempt && shouldAutoProvisionDemoUser()) {
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
};
