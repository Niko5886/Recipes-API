# Recipes API - Database Setup

## Структура на базата данни

### Users таблица
- `id` (serial, primary key)
- `email` (varchar, unique)
- `password` (text, bcrypted)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Recipes таблица
- `id` (serial, primary key)
- `title` (varchar)
- `description` (text)
- `ingredients` (text - JSON или comma-separated)
- `instructions` (text)
- `cooking_time` (integer - минути)
- `servings` (integer)
- `tags` (text - JSON array)
- `category` (varchar)
- `user_id` (integer - foreign key)
- `date_created` (timestamp)
- `updated_at` (timestamp)

## Инструкции за настройка

### 1. Создаване на Neon Database

1. Отидете на [neon.tech](https://neon.tech)
2. Създайте нов проект
3. Копирайте connection string от Neon конзолата

### 2. Конфигуриране на environment variables

Създайте `.env.local` файл с DATABASE_URL:

```bash
DATABASE_URL=postgresql://user:password@endpoint.neon.tech/database_name
```

### 3. Инсталиране на зависимости

```bash
npm install
npm install --save-dev drizzle-kit
```

### 4. Применяне на миграциите

**Опция 1: Используя drizzle-kit push (автоматично)**
```bash
npm run db:push
```

**Опция 2: Ръчно выполнение на SQL**
Отворете `drizzle/0001_initial_schema.sql` и я изпълнете в Neon конзолата.

### 5. Генериране на нови миграции (ако правите промени)

После като направите промени на `src/db/schema.ts`:

```bash
npm run db:generate
npm run db:migrate
```

## Използване на базата данни

### Примери

**Създаване на потребител:**
```typescript
import { createUser } from "@/db/queries/users";

const user = await createUser("example@email.com", "password123");
```

**Получаване на потребител:**
```typescript
import { getUserByEmail } from "@/db/queries/users";

const user = await getUserByEmail("example@email.com");
```

**Създаване на рецепта:**
```typescript
import { createRecipe } from "@/db/queries/recipes";

const recipe = await createRecipe({
  title: "Моя рецепта",
  description: "Описание",
  ingredients: JSON.stringify(["Съставка 1", "Съставка 2"]),
  instructions: "Инструкции",
  cookingTime: 30,
  servings: 4,
  tags: JSON.stringify(["вкусна", "лека"]),
  category: "Основни",
  userId: 1,
});
```

**Получаване на рецепти:**
```typescript
import { getRecipesByUserId } from "@/db/queries/recipes";

const recipes = await getRecipesByUserId(1);
```

## Drizzle Studio (за разработка)

За да разглеждате и управлявате данните в интерфейс:

```bash
npm run db:studio
```

Това отваря локалната конзола за управление на базата данни.
