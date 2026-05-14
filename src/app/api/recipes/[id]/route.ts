import { db } from "@/db";
import { recipes } from "@/db/schema";
import { getUserIdFromRequest } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, parseInt(id)));

    if (!recipe) {
      return NextResponse.json({ error: "Рецептата не е намерена" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json({ error: "Грешка при извличане на рецептата" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json({ error: "Неоторизиран достъп" }, { status: 401 });
  }

  const { id } = await params;
  
  try {
    // Проверка дали рецептата принадлежи на потребителя
    const [existingRecipe] = await db
      .select()
      .from(recipes)
      .where(and(eq(recipes.id, parseInt(id)), eq(recipes.userId, userId)));

    if (!existingRecipe) {
      return NextResponse.json({ error: "Нямате права да редактирате тази рецепта или тя не съществува" }, { status: 403 });
    }

    const body = await request.json();

    const [updatedRecipe] = await db
      .update(recipes)
      .set({
        title: body.title !== undefined ? body.title : existingRecipe.title,
        description: body.description !== undefined ? body.description : existingRecipe.description,
        ingredients: body.ingredients !== undefined ? (typeof body.ingredients === 'string' ? body.ingredients : JSON.stringify(body.ingredients)) : existingRecipe.ingredients,
        instructions: body.instructions !== undefined ? body.instructions : existingRecipe.instructions,
        cookingTime: body.cookingTime !== undefined ? body.cookingTime : existingRecipe.cookingTime,
        servings: body.servings !== undefined ? body.servings : existingRecipe.servings,
        tags: body.tags !== undefined ? JSON.stringify(body.tags) : existingRecipe.tags,
        category: body.category !== undefined ? body.category : existingRecipe.category,
        updatedAt: new Date(),
      })
      .where(eq(recipes.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedRecipe);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Грешка при обновяване на рецептата" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json({ error: "Неоторизиран достъп" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Проверка дали рецептата принадлежи на потребителя
    const [existingRecipe] = await db
      .select()
      .from(recipes)
      .where(and(eq(recipes.id, parseInt(id)), eq(recipes.userId, userId)));

    if (!existingRecipe) {
      return NextResponse.json({ error: "Нямате права да изтриете тази рецепта или тя не съществува" }, { status: 403 });
    }

    await db.delete(recipes).where(eq(recipes.id, parseInt(id)));

    return NextResponse.json({ message: "Успешно изтрита рецепта" });
  } catch (error) {
    return NextResponse.json({ error: "Грешка при изтриване на рецептата" }, { status: 500 });
  }
}
