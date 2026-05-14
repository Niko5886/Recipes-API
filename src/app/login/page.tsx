"use client";

import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = "/";
      } else {
        setError(data.error || "Грешка при вход");
        setSubmitting(false);
      }
    } catch {
      setError("Не може да се свърже със сървъра.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-slate-900 border border-slate-800 rounded-xl">
      <h1 className="text-2xl font-bold text-center mb-6 text-white">Вход</h1>
      {error && (
        <div className="bg-red-900/50 text-red-200 border border-red-800 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm mb-1 text-slate-300">Имейл</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full bg-slate-800 border border-slate-600 rounded-md px-4 py-2 text-white placeholder:text-slate-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1 text-slate-300">Парола</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full bg-slate-800 border border-slate-600 rounded-md px-4 py-2 text-white placeholder:text-slate-500"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-md transition mt-2"
        >
          {submitting ? "Влизане..." : "Влез"}
        </button>
      </form>
    </div>
  );
}
