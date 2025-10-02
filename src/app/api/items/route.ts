import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Utility to verify JWT token
async function verifyToken(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");

  const token = authHeader.split(" ")[1];
  const payload = jwt.verify(token, JWT_SECRET);
  return payload;
}

export async function GET(req: Request) {
  try {
    await verifyToken(req); // Only authorized users

    const items = await prisma.item.findMany({
      include: { history: true },
      orderBy: { id: "asc" },
    });

    return new Response(JSON.stringify(items), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Unauthorized", { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await verifyToken(req); // Only authorized users

    const body = await req.json();
    const { name, quantity, sku, category, image } = body;

    if (!name || quantity === undefined || !sku || !category) {
      return new Response("Missing required fields", { status: 400 });
    }

    const item = await prisma.item.create({
      data: {
        name,
        quantity,
        sku,
        category,
        image,
        history: {
          create: {
            quantity,
          },
        },
      },
      include: { history: true },
    });

    return new Response(JSON.stringify(item), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}