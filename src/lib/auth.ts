import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-development-only";

export function signToken(payload: { userId: number }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch (error) {
    return null;
  }
}

export function getUserIdFromRequest(request: NextRequest): number | null {
  const authHeader = request.headers.get("authorization");
  let token = "";
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    // Check cookies fallback
    token = request.cookies.get("token")?.value || "";
  }

  if (!token) return null;

  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
}
