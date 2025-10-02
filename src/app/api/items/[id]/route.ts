// app/api/items/[id]/route.ts
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  const { id } = params;
  try {
    const item = await prisma.item.findUnique({
      where: { id },
      include: { history: true },
    });
    if (!item) return new Response("Item not found", { status: 404 });
    return new Response(JSON.stringify(item), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = params;
  try {
    const body = await req.json();
    const { name, quantity, sku, category, image } = body;

    // Fetch current item to update history
    const current = await prisma.item.findUnique({ where: { id }, include: { history: true } });
    if (!current) return new Response("Item not found", { status: 404 });

    // Update item and append new history entry if quantity changed
    const updated = await prisma.item.update({
      where: { id },
      data: {
        name: name ?? current.name,
        sku: sku ?? current.sku,
        category: category ?? current.category,
        image: image ?? current.image,
        quantity: quantity ?? current.quantity,
        history: quantity !== undefined ? { create: { quantity } } : undefined,
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
    await prisma.item.delete({ where: { id } });
    return new Response("Deleted", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}