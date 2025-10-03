const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prismaSeed = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("#b8lUxdEfP3@", 10);

  await prismaSeed.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      isAdmin: true,
    },
  });

  console.log("✅ Admin user seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaSeed.$disconnect();
  });