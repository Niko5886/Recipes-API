"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function EditRecipePage() {
  const router = useRouter();
  const { id } = useParams();
  const { user, loading } = useAuth();
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    cookingTime: 30,
    servings: 2,
    category: "",
    tags: ""
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetch(`/api/recipes/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            title: data.title || "",
            description: data.description || "",
            ingredients: (typeof data.ingredients === 'string' ? JSON.parse(data.ingredients) : data.ingredients).join('\n'),
            instructions: data.instructions || "",
            cookingTime: data.cookingTime || 30,
            servings: data.servings || 2,
            category: data.category || "",
            tags: (data.tags ? JSON.parse(data.tags) : []).join(", ")
          });
        })
        .finally(() => setFetching(false));
    }
  }, [id, user, loading, router]);

  if (loading || fetching) return <p>Зареждане...</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ingredientsArray = formData.ingredients.split("\n").filter(i => i.trim());
    const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(t => t);

    const payload = {
      ...formData,
      ingredients: ingredientsArray,
      tags: tagsArray
    };

    const res = await fetch(`/api/recipes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push(`/recipes/${id}`);
    } else {
      alert("Грешка при обновяване");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "number" ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-xl">
      <h1 className="text-3xl font-bold mb-6">Редактирай рецепта</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm">
        <div>
          <label htmlFor="title" className="block text-slate-300 mb-1">Заглавие</label>
          <input id="title" name="title" required value={formData.title} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white" />
        </div>

        <div>
          <label htmlFor="description" className="block text-slate-300 mb-1">Описание</label>
          <input id="description" name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cookingTime" className="block text-slate-300 mb-1">Време (мин)</label>
            <input id="cookingTime" name="cookingTime" type="number" required min="1" value={formData.cookingTime} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white" />
          </div>
          <div>
            <label htmlFor="servings" className="block text-slate-300 mb-1">Порции</label>
            <input id="servings" name="servings" type="number" required min="1" value={formData.servings} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white" />
          </div>
        </div>

        <div>
          <label htmlFor="ingredients" className="block text-slate-300 mb-1">Съставки (по една на ред)</label>
          <textarea id="ingredients" name="ingredients" required value={formData.ingredients} onChange={handleChange} rows={4} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white" />
        </div>

        <div>
          <label htmlFor="instructions" className="block text-slate-300 mb-1">Инструкции</label>
          <textarea id="instructions" name="instructions" required value={formData.instructions} onChange={handleChange} rows={5} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-slate-300 mb-1">Категория</label>
            <input id="category" name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white" />
          </div>
          <div>
            <label htmlFor="tags" className="block text-slate-300 mb-1">Тагове (разделени със запетая)</label>
            <input id="tags" name="tags" placeholder="vegan, fast" value={formData.tags} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white" />
          </div>
        </div>

        <button type="submit" className="bg-yellow-600/30 hover:bg-yellow-600 border border-yellow-700 text-yellow-300 font-medium py-3 rounded-md transition mt-4 text-base">
          Запази промените
        </button>
      </form>
    </div>
  );
}
