import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) return new Response("Missing credentials", { status: 400 });

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return new Response("Invalid username or password", { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return new Response("Invalid username or password", { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}