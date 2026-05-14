export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-5xl px-6 py-12 sm:px-10">
        <header className="mb-10 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-8 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Recipes API</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">REST API Documentation</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Документация за endpoint-ите за удостоверяване и управление на рецепти.
            Публичните endpoints са достъпни без токен, а защитените изискват JWT.
          </p>
        </header>

        <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-200">Authentication</h2>
          <div className="space-y-3 text-sm">
            <DocRow method="POST" path="/api/auth/register" note="Създаване на нов потребител" />
            <DocRow method="POST" path="/api/auth/login" note="Вход и връщане на JWT" />
            <DocRow method="POST" path="/api/auth/logout" note="Изход и изчистване на token cookie" />
            <DocRow method="GET" path="/api/auth/me" note="Текущ потребител (изисква JWT)" />
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-200">Recipes - Public</h2>
          <div className="space-y-3 text-sm">
            <DocRow method="GET" path="/api/recipes?page=1&pageSize=10" note="Списък с пагинация" />
            <DocRow method="GET" path="/api/recipes?tag=vegan" note="Филтриране по таг" />
            <DocRow method="GET" path="/api/recipes?search=pasta" note="Търсене по ключова дума" />
            <DocRow method="GET" path="/api/recipes/:id" note="Детайли за рецепта" />
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-200">Recipes - Protected (JWT)</h2>
          <div className="space-y-3 text-sm">
            <DocRow method="POST" path="/api/recipes" note="Създаване на рецепта" />
            <DocRow method="PUT" path="/api/recipes/:id" note="Редакция на собствена рецепта" />
            <DocRow method="DELETE" path="/api/recipes/:id" note="Изтриване на собствена рецепта" />
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Изпращай token в header: Authorization: Bearer &lt;jwt_token&gt; или чрез HTTP-only cookie.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-200">Example Requests</h2>
          <div className="space-y-5">
            <CodeBlock
              title="Register"
              code={`curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"demo@example.com","password":"123456"}'`}
            />
            <CodeBlock
              title="Login"
              code={`curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"demo@example.com","password":"123456"}'`}
            />
            <CodeBlock
              title="Create Recipe (JWT)"
              code={`curl -X POST http://localhost:3000/api/recipes \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <jwt_token>" \\
  -d '{
    "title":"Pasta Primavera",
    "description":"Fresh spring pasta",
    "ingredients":["pasta", "zucchini", "olive oil"],
    "instructions":"Boil pasta, saute veggies, combine.",
    "cookingTime":20,
    "servings":2,
    "tags":["vegetarian", "quick"],
    "category":"Dinner"
  }'`}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function DocRow({ method, path, note }: { method: string; path: string; note: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="inline-flex w-14 justify-center rounded-md border border-cyan-400/40 bg-cyan-500/10 px-2 py-1 text-xs font-bold text-cyan-200">
          {method}
        </span>
        <code className="text-sm text-slate-100">{path}</code>
      </div>
      <p className="text-xs text-slate-400">{note}</p>
    </div>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-cyan-200">{title}</p>
      <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}
