import { db } from "@/db";
import { users } from "@/db/schema";
import { signToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email и парола са задължителни" }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return NextResponse.json({ error: "Грешен email или парола" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Грешен email или парола" }, { status: 401 });
    }

    const token = signToken({ userId: user.id });

    const response = NextResponse.json(
      { message: "Успешен вход", token, user: { id: user.id, email: user.email } },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Възникна грешка при вход" }, { status: 500 });
  }
}
