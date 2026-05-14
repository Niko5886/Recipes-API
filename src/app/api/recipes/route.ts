import { db } from "@/db";
import { recipes } from "@/db/schema";
import { getUserIdFromRequest } from "@/lib/auth";
import { eq, ilike, and, like, or, count } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search");
  const tag = searchParams.get("tag");

  const offset = (page - 1) * pageSize;

  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(recipes.title, `%${search}%`),
        ilike(recipes.description, `%${search}%`)
      )
    );
  }

  if (tag) {
    // tags is text, storing JSON array like '["vegan", "dinner"]'
    conditions.push(ilike(recipes.tags, `%${tag}%`));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  try {
    const data = await db
      .select()
      .from(recipes)
      .where(whereClause)
      .limit(pageSize)
      .offset(offset);

    const [totalCount] = await db
      .select({ value: count() })
      .from(recipes)
      .where(whereClause);

    return NextResponse.json({
      data,
      meta: {
        page,
        pageSize,
        total: totalCount.value,
        totalPages: Math.ceil(totalCount.value / pageSize)
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Грешка при извличане на рецептите" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json({ error: "Неоторизиран достъп" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validate minimally required fields based on schema
    if (!body.title || !body.ingredients || !body.instructions || !body.cookingTime || !body.servings) {
      return NextResponse.json({ error: "Моля, попълнете всички задължителни полета" }, { status: 400 });
    }

    const [newRecipe] = await db.insert(recipes).values({
      title: body.title,
      description: body.description,
      ingredients: typeof body.ingredients === 'string' ? body.ingredients : JSON.stringify(body.ingredients),
      instructions: body.instructions,
      cookingTime: body.cookingTime,
      servings: body.servings,
      tags: body.tags ? JSON.stringify(body.tags) : "[]",
      category: body.category,
      userId: userId,
    }).returning();

    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Грешка при създаване на рецепта" }, { status: 500 });
  }
}
