"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Recipe } from "@/db/schema";

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/recipes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setRecipe(data))
      .catch(() => setRecipe(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Сигурни ли сте, че искате да изтриете тази рецепта?")) return;
    
    await fetch(`/api/recipes/${id}`, { method: "DELETE" });
    router.push("/my-recipes");
  };

  if (loading) return <p>Зареждане...</p>;
  if (!recipe) return <p>Рецептата не е намерена.</p>;

  const isOwner = user?.id === recipe.userId;
  const tags: string[] = recipe.tags ? JSON.parse(recipe.tags) : [];
  const ingredients: string[] = typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients;

  return (
    <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-4xl font-bold text-cyan-300">{recipe.title}</h1>
        {isOwner && (
          <div className="flex gap-2">
            <button onClick={() => router.push(`/recipes/${recipe.id}/edit`)} className="bg-yellow-600/20 text-yellow-300 border border-yellow-700 px-4 py-1.5 rounded-md text-sm hover:bg-yellow-600/40">Редактирай</button>
            <button onClick={handleDelete} className="bg-red-600/20 text-red-300 border border-red-700 px-4 py-1.5 rounded-md text-sm hover:bg-red-600/40">Изтрий</button>
          </div>
        )}
      </div>

      <div className="flex gap-4 text-sm text-slate-400 mb-8 border-b border-slate-700 pb-6">
        <span>🕒 {recipe.cookingTime} мин.</span>
        <span>🍽️ {recipe.servings} порции</span>
        {recipe.category && <span>📁 {recipe.category}</span>}
      </div>

      <p className="text-xl text-slate-300 italic mb-8">{recipe.description}</p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-cyan-200 border-b border-slate-700 pb-2">Съставки</h3>
          <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
            {ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-cyan-200 border-b border-slate-700 pb-2">Инструкции</h3>
          <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
            {recipe.instructions}
          </div>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-800 flex gap-2">
          {tags.map((tag, i) => (
            <span key={i} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-full px-3 py-1">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
