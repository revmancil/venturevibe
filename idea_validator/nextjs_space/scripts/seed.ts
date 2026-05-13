import { prisma } from "../lib/prisma";
import bcryptjs from "bcryptjs";

async function main() {
  const email = "john@doe.com";
  const password = "johndoe123";
  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: "John Entrepreneur",
    },
  });

  console.log("Seed user created:", user);
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
