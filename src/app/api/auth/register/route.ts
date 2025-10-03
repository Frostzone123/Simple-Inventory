import { prisma } from "../../../../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Admin check helper
async function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");

  const token = authHeader.split(" ")[1];
  const payload: any = jwt.verify(token, JWT_SECRET);

  if (!payload.isAdmin) throw new Error("Forbidden");
  return payload;
}

// GET /api/users → list all users
export async function GET(req: NextRequest) {
  try {
    await verifyAdmin(req);

    const users = await prisma.user.findMany({
      select: { id: true, username: true, isAdmin: true },
    });

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err: any) {
    console.error("GET /api/users error:", err);
    const status = err.message === "Unauthorized" ? 401 : err.message === "Forbidden" ? 403 : 500;
    return new Response(err.message || "Internal server error", { status });
  }
}

// POST /api/users → create new user
export async function POST(req: NextRequest) {
  try {
    await verifyAdmin(req);

    const { username, password, isAdmin } = await req.json();

    if (!username || !password) {
      return new Response("Missing username or password", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hashedPassword, isAdmin: Boolean(isAdmin) },
    });

    return new Response(JSON.stringify({ id: user.id, username: user.username, isAdmin: user.isAdmin }), { status: 201 });
  } catch (err: any) {
    console.error("POST /api/users error:", err);
    const status = err.message === "Unauthorized" ? 401 : err.message === "Forbidden" ? 403 : 500;
    return new Response(err.message || "Internal server error", { status });
  }
}

// PUT /api/users/:id → update a user (toggle isAdmin)
export async function PUT(req: NextRequest) {
  try {
    await verifyAdmin(req);

    const url = new URL(req.url);
    const id = Number(url.pathname.split("/").pop());
    if (!id) return new Response("Invalid user ID", { status: 400 });

    const { isAdmin } = await req.json();

    const user = await prisma.user.update({
      where: { id },
      data: { isAdmin: Boolean(isAdmin) },
    });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err: any) {
    console.error("PUT /api/users error:", err);
    const status = err.message === "Unauthorized" ? 401 : err.message === "Forbidden" ? 403 : 500;
    return new Response(err.message || "Internal server error", { status });
  }
}

// DELETE /api/users/:id → delete a user
export async function DELETE(req: NextRequest) {
  try {
    await verifyAdmin(req);

    const url = new URL(req.url);
    const id = Number(url.pathname.split("/").pop());
    if (!id) return new Response("Invalid user ID", { status: 400 });

    await prisma.user.delete({ where: { id } });

    return new Response(JSON.stringify({ message: "User deleted" }), { status: 200 });
  } catch (err: any) {
    console.error("DELETE /api/users error:", err);
    const status = err.message === "Unauthorized" ? 401 : err.message === "Forbidden" ? 403 : 500;
    return new Response(err.message || "Internal server error", { status });
  }
}