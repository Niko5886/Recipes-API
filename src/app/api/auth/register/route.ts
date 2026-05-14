import { db } from "@/db";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Двата полета email и password са задължителни" }, { status: 400 });
    }

    const existingUsers = await db.select().from(users).where(eq(users.email, email));
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Потребител с този email вече съществува" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({ email, password: hashedPassword })
      .returning({ id: users.id, email: users.email });

    const token = signToken({ userId: newUser.id });

    const response = NextResponse.json(
      { message: "Успешна регистрация", token, user: newUser },
      { status: 201 }
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
    return NextResponse.json({ error: "Възникна грешка при регистрацията" }, { status: 500 });
  }
}
