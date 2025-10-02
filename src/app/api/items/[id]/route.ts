// app/api/items/[id]/route.ts
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

interface Params {
  params: { id: string };
}

// Helper: verify JWT token
async function verifyToken(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");

  const token = authHeader.split(" ")[1];
  const payload = jwt.verify(token, JWT_SECRET);
  return payload;
}

export async function GET(req: Request, { params }: Params) {
  const { id } = params;
  try {
    await verifyToken(req); // Only authenticated users

    const item = await prisma.item.findUnique({
      where: { id: Number(id) },
      include: { history: true },
    });

    if (!item) return new Response("Item not found", { status: 404 });

    return new Response(JSON.stringify(item), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Unauthorized", { status: 401 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = params;
  try {
    await verifyToken(req);

    const body = await req.json();
    const { name, quantity, sku, category, image } = body;

    const current = await prisma.item.findUnique({
      where: { id: Number(id) },
      include: { history: true },
    });
    if (!current) return new Response("Item not found", { status: 404 });

    const updated = await prisma.item.update({
      where: { id: Number(id) },
      data: {
        name: name ?? current.name,
        sku: sku ?? current.sku,
        category: category ?? current.category,
        image: image ?? current.image,
        quantity: quantity ?? current.quantity,
        history:
          quantity !== undefined
            ? { create: { quantity } }
            : undefined,
      },
      include: { history: true },
    });

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const { id } = params;
  try {
    await verifyToken(req);

    await prisma.item.delete({ where: { id: Number(id) } });
    return new Response("Deleted", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}