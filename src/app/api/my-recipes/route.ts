import { db } from "@/db";
import { recipes } from "@/db/schema";
import { getUserIdFromRequest } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json({ error: "Неоторизиран достъп" }, { status: 401 });
  }

  try {
    const data = await db
      .select()
      .from(recipes)
      .where(eq(recipes.userId, userId));

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Грешка при извличане на рецептите" }, { status: 500 });
  }
}
