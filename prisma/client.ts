import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function closeConnection() {
  await prisma.$disconnect();
}

export default prisma;