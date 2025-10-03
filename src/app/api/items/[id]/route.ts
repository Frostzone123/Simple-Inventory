import { prisma } from "../../../../../lib/prisma";
import { NextRequest } from "next/server";

interface Params {
  params: Promise<{ id: string }>; // <-- note the Promise
}

export async function GET(req: NextRequest, context: Params) {
  const { id } = await context.params; // await the promise

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

export async function PUT(req: NextRequest, context: Params) {
  const { id } = await context.params;
  const body = await req.json();
  const { name, quantity, sku, category, image } = body;

  try {
    const current = await prisma.item.findUnique({ where: { id }, include: { history: true } });
    if (!current) return new Response("Item not found", { status: 404 });

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

export async function DELETE(req: NextRequest, context: Params) {
  const { id } = await context.params;
  try {
    await prisma.item.delete({ where: { id } });
    return new Response("Deleted", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}