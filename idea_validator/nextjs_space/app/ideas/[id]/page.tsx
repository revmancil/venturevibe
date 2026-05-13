import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ValidationReportClient from "./_components/validation-report-client";

interface IdeaPageProps {
  params: {
    id: string;
  };
}

export default async function IdeaPage({ params }: IdeaPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const idea = await prisma.idea.findUnique({
    where: { id: params.id },
    include: {
      validationReport: true,
    },
  });

  if (!idea || idea.userId !== session.user.id) {
    redirect("/dashboard");
  }

  return <ValidationReportClient idea={idea} />;
}
