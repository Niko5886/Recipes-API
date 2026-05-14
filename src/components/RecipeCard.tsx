import Link from "next/link";
import { Recipe } from "@/db/schema";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const tags: string[] = recipe.tags ? JSON.parse(recipe.tags) : [];

  return (
    <div className="border border-slate-700 bg-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-cyan-500/50 transition">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{recipe.title}</h3>
        <p className="text-sm text-slate-300 mb-4 line-clamp-2">{recipe.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <span key={i} className="text-xs bg-cyan-900/30 text-cyan-300 border border-cyan-800 rounded-full px-2 py-1">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center text-sm text-slate-400 mt-4 border-t border-slate-700 pt-4">
        <span>🕒 {recipe.cookingTime} мин</span>
        <Link href={`/recipes/${recipe.id}`} className="text-cyan-400 hover:underline">
          Виж повече →
        </Link>
      </div>
    </div>
  );
}
