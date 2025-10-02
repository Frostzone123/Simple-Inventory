import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.item.findMany({
    include: { history: true },
  });
  return new Response(JSON.stringify(items), { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, quantity, sku, category, image } = body;

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
  });

  return new Response(JSON.stringify(item), { status: 201 });
}