import { prisma } from "../lib/prisma";
import bcryptjs from "bcryptjs";
import { DEMO_TEST_EMAIL, DEMO_TEST_PASSWORD } from "../lib/demo-auth";
import { ensureDemoSubscription } from "../lib/demo-subscription";

async function main() {
  const hashedPassword = await bcryptjs.hash(DEMO_TEST_PASSWORD, 10);

  const demo = await prisma.user.upsert({
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

  await ensureDemoSubscription(demo.id);

  console.log("Demo user ready:", demo.email, "(Business plan, password in lib/demo-auth.ts)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
