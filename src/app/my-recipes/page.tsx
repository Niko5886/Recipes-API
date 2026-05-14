"use client";

import { useEffect, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/db/schema";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetch("/api/my-recipes")
        .then((res) => res.json())
        .then((data) => setRecipes(data.data || []))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return <p className="text-slate-400">Зареждане...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-cyan-400">Моите рецепти</h1>
      
      {recipes.length === 0 ? (
        <p className="text-slate-300">
          Все още нямаш добавени рецепти. <Link href="/recipes/new" className="text-cyan-400 underline">Създай първата си рецепта</Link>.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
