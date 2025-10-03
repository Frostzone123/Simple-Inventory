// app/api/users/[id]/route.ts
import { prisma } from "../../../../../lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

function verifyFrontend(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin && origin !== FRONTEND_URL) {
    throw new Error("Forbidden: must come from frontend");
  }
}

async function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");

  const token = authHeader.split(" ")[1];
  const payload: any = jwt.verify(token, JWT_SECRET);

  if (!payload.isAdmin) throw new Error("Forbidden");
  return payload;
}

// ✅ Update a user (toggle isAdmin, etc.)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyFrontend(req);
    await verifyAdmin(req);

    const { isAdmin } = await req.json();
    const user = await prisma.user.update({
      where: { id: Number(params.id) },
      data: { isAdmin },
      select: { id: true, username: true, isAdmin: true },
    });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err: any) {
    console.error("PUT /api/users/[id] error:", err);
    const status =
      err.message.startsWith("Forbidden") ? 403 :
      err.message === "Unauthorized" ? 401 :
      500;
    return new Response(err.message || "Internal server error", { status });
  }
}

// ✅ Delete a user
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyFrontend(req);
    await verifyAdmin(req);

    await prisma.user.delete({ where: { id: Number(params.id) } });
    return new Response("User deleted", { status: 200 });
  } catch (err: any) {
    console.error("DELETE /api/users/[id] error:", err);
    const status =
      err.message.startsWith("Forbidden") ? 403 :
      err.message === "Unauthorized" ? 401 :
      500;
    return new Response(err.message || "Internal server error", { status });
  }
}