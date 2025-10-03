// src/app/api/items/route.ts
import { prisma } from "../../../../lib/prisma";// make sure this path is correct
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Utility to verify JWT token
async function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");

  const token = authHeader.split(" ")[1];
  const payload = jwt.verify(token, JWT_SECRET);
  return payload;
}

// GET all items
export async function GET(req: NextRequest) {
  try {
    await verifyToken(req); // Only authorized users

    const items = await prisma.item.findMany({
      include: { history: true },
      orderBy: { id: "asc" },
    });

    return new Response(JSON.stringify(items), { status: 200 });
  } catch (err) {
    console.error("GET /api/items error:", err);
    return new Response("Unauthorized", { status: 401 });
  }
}

// POST a new item
export async function POST(req: NextRequest) {
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
        history: { create: { quantity } },
      },
      include: { history: true },
    });

    return new Response(JSON.stringify(item), { status: 201 });
  } catch (err) {
    console.error("POST /api/items error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}