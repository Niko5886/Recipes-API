import { db } from "@/db";
import { users } from "@/db/schema";
import { getUserIdFromRequest } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json({ error: "Неоторизиран достъп" }, { status: 401 });
  }

  try {
    const [user] = await db.select({ id: users.id, email: users.email }).from(users).where(eq(users.id, userId));

    if (!user) {
      return NextResponse.json({ error: "Потребителят не е намерен" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Възникна грешка" }, { status: 500 });
  }
}
