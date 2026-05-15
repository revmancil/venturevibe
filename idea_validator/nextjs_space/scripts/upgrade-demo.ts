import { prisma } from "../lib/prisma";
import { DEMO_TEST_EMAIL } from "../lib/demo-auth";

async function main() {
  const user = await prisma.user.findUnique({ where: { email: DEMO_TEST_EMAIL } });
  if (!user) {
    console.error("Demo user not found. Run `npx prisma db seed` first.");
    process.exit(1);
  }

  const sub = await prisma.subscription.upsert({
    where: { userId: user.id },
    update: { plan: "business", status: "active" },
    create: {
      userId: user.id,
      plan: "business",
      status: "active",
    },
  });

  console.log("Demo user upgraded to:", sub.plan);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
