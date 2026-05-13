import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./_components/dashboard-client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const ideas = await prisma.idea.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      validationReport: true,
    },
  });

  return <DashboardClient ideas={ideas} />;
}
