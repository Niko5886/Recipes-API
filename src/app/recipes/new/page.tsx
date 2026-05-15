"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function NewRecipePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  if (loading) return null;
  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ingredientsArray = formData.ingredients.split("\n").filter(i => i.trim());
    const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(t => t);

    const payload = {
      ...formData,
      ingredients: ingredientsArray,
      tags: tagsArray
    };

    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const { id } = await res.json();
      
      if (imageFile) {
        const photoData = new FormData();
        photoData.append("file", imageFile);
        
        await fetch(`/api/recipes/${id}/photo`, {
          method: "POST",
          body: photoData,
        });
      }

      router.push("/my-recipes");
    } else {
      alert("Грешка при създаване");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.type === "number") {
      const parsed = parseInt(e.target.value);
      setFormData({ ...formData, [e.target.name]: isNaN(parsed) ? 0 : parsed });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-xl">
      <h1 className="text-3xl font-bold mb-6">Добави рецепта</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm">
        <div>
          <label className="block text-slate-300 mb-2">Снимка</label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md border border-slate-700" />
                <button 
                  type="button" 
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-500"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="w-32 h-32 flex flex-col items-center justify-center bg-slate-950 border border-dashed border-slate-600 rounded-md cursor-pointer hover:border-slate-400 text-slate-400 hover:text-slate-200 transition">
                <span className="text-2xl mb-1">+</span>
                <span>Качи</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

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
            <label htmlFor="category" className="block text-slate-300 mb-1">Категория (пр. Обяд)</label>
            <input id="category" name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white" />
          </div>
          <div>
            <label htmlFor="tags" className="block text-slate-300 mb-1">Тагове (разделени със запетая)</label>
            <input id="tags" name="tags" placeholder="vegan, fast" value={formData.tags} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white" />
          </div>
        </div>

        <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-3 rounded-md transition mt-4 text-base">
          Запази рецептата
        </button>
      </form>
    </div>
  );
}
