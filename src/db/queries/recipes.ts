import { db } from "@/db";
import { recipes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import type { NewRecipe } from "@/db/schema";

export async function createRecipe(recipe: NewRecipe) {
  try {
    const result = await db
      .insert(recipes)
      .values(recipe)
      .returning();

    return result[0];
  } catch (error) {
    throw new Error("Не е възможно да се създаде рецепта");
  }
}

export async function getRecipeById(id: number) {
  const result = await db
    .select()
    .from(recipes)
    .where(eq(recipes.id, id));
  return result[0];
}

export async function getRecipesByUserId(userId: number) {
  const result = await db
    .select()
    .from(recipes)
    .where(eq(recipes.userId, userId));
  return result;
}

export async function getAllRecipes() {
  const result = await db.select().from(recipes);
  return result;
}

export async function updateRecipe(id: number, updates: Partial<NewRecipe>) {
  try {
    const result = await db
      .update(recipes)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(recipes.id, id))
      .returning();

    return result[0];
  } catch (error) {
    throw new Error("Не е възможно да се обнови рецептата");
  }
}

export async function deleteRecipe(id: number) {
  try {
    const result = await db
      .delete(recipes)
      .where(eq(recipes.id, id))
      .returning();

    return result[0];
  } catch (error) {
    throw new Error("Не е възможно да се изтрие рецептата");
  }
}

export async function searchRecipes(searchTerm: string) {
  const result = await db
    .select()
    .from(recipes)
    .where(sql`title ILIKE ${"%" + searchTerm + "%"}`);
  return result;
}

export async function getRecipesByCategory(category: string) {
  const result = await db
    .select()
    .from(recipes)
    .where(eq(recipes.category, category));
  return result;
}
