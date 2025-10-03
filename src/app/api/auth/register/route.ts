import { prisma } from "lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return new Response("Username and password required", { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return new Response("User already exists", { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    return new Response(JSON.stringify({ id: user.id, username: user.username }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}