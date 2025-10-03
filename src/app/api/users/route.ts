import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Simple frontend check
function verifyFrontend(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin && origin !== FRONTEND_URL) {
    throw new Error("Forbidden: must come from frontend");
  }
}
// Verify admin JWT
async function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");

  const token = authHeader.split(" ")[1];
  const payload: any = jwt.verify(token, JWT_SECRET);

  if (!payload.isAdmin) throw new Error("Forbidden");
  return payload;
}

// ✅ GET all users (admin only)
export async function GET(req: NextRequest) {
  try {
    verifyFrontend(req);     // simple frontend check
    await verifyAdmin(req);  // admin check

    const users = await prisma.user.findMany({
      select: { id: true, username: true, isAdmin: true },
    });

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err: any) {
    console.error("GET /api/users error:", err);
    const status =
      err.message.startsWith("Forbidden") ? 403 :
      err.message === "Unauthorized" ? 401 : 500;
    return new Response(err.message || "Internal server error", { status });
  }
}

// ✅ POST create new user (admin only)
export async function POST(req: NextRequest) {
  try {
    verifyFrontend(req);     // simple frontend check
    await verifyAdmin(req);  // admin check

    const { username, password, isAdmin } = await req.json();

    if (!username || !password) {
      return new Response("Missing username or password", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        isAdmin: Boolean(isAdmin),
      },
    });

    return new Response(
      JSON.stringify({ id: user.id, username: user.username, isAdmin: user.isAdmin }),
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/users error:", err);
    const status =
      err.message.startsWith("Forbidden") ? 403 :
      err.message === "Unauthorized" ? 401 : 500;
    return new Response(err.message || "Internal server error", { status });
  }
}