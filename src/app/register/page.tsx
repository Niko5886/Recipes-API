"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      login(data.token, data.user);
      router.push("/");
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-slate-900 border border-slate-800 rounded-xl">
      <h1 className="text-2xl font-bold text-center mb-6">Регистрация</h1>
      {error && <div className="bg-red-900/50 text-red-200 border border-red-800 p-3 rounded-md mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm mb-1 text-slate-300">Имейл</label>
          <input type="email" required className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1 text-slate-300">Парола</label>
          <input type="password" required className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 rounded-md transition mt-2">Регистрирай ме</button>
      </form>
    </div>
  );
}
