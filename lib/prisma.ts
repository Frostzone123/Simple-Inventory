// /lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent multiple instances during hot reload
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"], // optional, remove in production if you want
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;