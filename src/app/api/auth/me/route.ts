import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return new Response(JSON.stringify({ isAdmin: false }), { status: 200 });

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return new Response(JSON.stringify({ isAdmin: false }), { status: 200 });

    return new Response(JSON.stringify({ id: user.id, username: user.username, isAdmin: user.isAdmin }), { status: 200 });
  } catch (err) {
    console.error("GET /api/auth/me error:", err);
    return new Response(JSON.stringify({ isAdmin: false }), { status: 200 });
  }
}