"use client";

import { useEffect, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/db/schema";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from 'react';

function HomeContent() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [tagVal, setTagVal] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const tag = searchParams.get("tag") || "";

  useEffect(() => {
    let active = true;

    const q = new URLSearchParams();
    q.set("page", page.toString());
    q.set("pageSize", "6");
    if (search) q.set("search", search);
    if (tag) q.set("tag", tag);

    fetch(`/api/recipes?${q.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setRecipes(data.data || []);
        setMeta(data.meta || { page: 1, totalPages: 1 });
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [page, search, tag]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (searchVal) q.set("search", searchVal);
    if (tagVal) q.set("tag", tagVal);
    router.push(`/?${q.toString()}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Всички рецепти</h1>

      <form onSubmit={handleFilter} className="mb-8 flex gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 flex-wrap">
        <input
          type="text"
          placeholder="Търсене по дума..."
          className="bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white flex-1"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <input
          type="text"
          placeholder="Таг (напр. vegan)"
          className="bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white w-40"
          value={tagVal}
          onChange={(e) => setTagVal(e.target.value)}
        />
        <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-md font-medium transition">
          Търси
        </button>
      </form>

      {loading ? (
        <p className="text-slate-400">Зареждане...</p>
      ) : recipes.length === 0 ? (
        <p className="text-slate-400">Няма намерени рецепти.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="mt-8 gap-2 flex justify-center items-center">
          <button
            disabled={meta.page <= 1}
            onClick={() => router.push(`/?page=${meta.page - 1}&search=${search}&tag=${tag}`)}
            className="px-4 py-2 bg-slate-800 disabled:opacity-50 rounded-l-md"
          >
            Предишна
          </button>
          <span className="px-4 text-slate-300">Стр. {meta.page} от {meta.totalPages}</span>
          <button
            disabled={meta.page >= meta.totalPages}
            onClick={() => router.push(`/?page=${meta.page + 1}&search=${search}&tag=${tag}`)}
            className="px-4 py-2 bg-slate-800 disabled:opacity-50 rounded-r-md"
          >
            Следваща
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}
