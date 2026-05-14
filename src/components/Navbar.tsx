"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center text-slate-100">
      <div className="flex gap-6 items-center">
        <Link href="/" className="text-xl font-bold text-cyan-400">Recipes App</Link>
        <Link href="/" className="hover:text-cyan-300 transition">Всички рецепти</Link>
        {user && <Link href="/my-recipes" className="hover:text-cyan-300 transition">Моите рецепти</Link>}
        {user && <Link href="/recipes/new" className="hover:text-cyan-300 transition">Добави рецепта</Link>}
      </div>
      <div className="flex gap-4 items-center">
        <Link href="/api-docs" className="text-sm text-slate-400 hover:text-white transition whitespace-nowrap">API Docs</Link>
        {user ? (
          <>
            <span className="text-sm text-slate-300">{user.email}</span>
            <button onClick={logout} className="text-sm bg-red-900/50 hover:bg-red-800 text-red-200 px-3 py-1.5 rounded-md transition">Изход</button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition">Вход</Link>
            <Link href="/register" className="text-sm bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 rounded-md transition">Регистрация</Link>
          </>
        )}
      </div>
    </nav>
  );
}
