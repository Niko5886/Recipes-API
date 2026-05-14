import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

const sampleRecipes = [
  {
    title: "Pasta Carbonara",
    description: "Classic Italian pasta with eggs and bacon",
    ingredients: "400g pasta, 200g bacon, 4 eggs, 100g Pecorino cheese, black pepper",
    instructions: "Cook pasta. Fry bacon. Mix eggs with cheese. Combine all.",
    cookingTime: 20,
    servings: 4,
    category: "Italian",
    tags: JSON.stringify(["pasta", "quick", "italian"]),
  },
  {
    title: "Caesar Salad",
    description: "Fresh salad with homemade dressing",
    ingredients: "Romaine lettuce, croutons, parmesan, Caesar dressing",
    instructions: "Wash lettuce, toss with dressing, add croutons",
    cookingTime: 15,
    servings: 2,
    category: "Salads",
    tags: JSON.stringify(["salad", "vegetarian", "healthy"]),
  },
  {
    title: "Chocolate Cake",
    description: "Rich and moist chocolate cake",
    ingredients: "200g flour, 100g butter, 150g chocolate, 3 eggs, sugar",
    instructions: "Mix ingredients, bake at 180°C for 30 minutes",
    cookingTime: 40,
    servings: 8,
    category: "Desserts",
    tags: JSON.stringify(["dessert", "chocolate", "baking"]),
  },
  {
    title: "Chicken Stir Fry",
    description: "Quick Asian-inspired chicken dish",
    ingredients: "500g chicken breast, vegetables, soy sauce, garlic, ginger",
    instructions: "Cut chicken, stir fry with vegetables, add sauce",
    cookingTime: 25,
    servings: 4,
    category: "Asian",
    tags: JSON.stringify(["chicken", "quick", "asian"]),
  },
  {
    title: "Vegetable Soup",
    description: "Healthy and hearty soup",
    ingredients: "Mixed vegetables, broth, cream, herbs",
    instructions: "Sauté vegetables, add broth, simmer for 20 minutes",
    cookingTime: 30,
    servings: 4,
    category: "Soups",
    tags: JSON.stringify(["soup", "vegetarian", "healthy"]),
  },
  {
    title: "Grilled Salmon",
    description: "Perfectly grilled salmon with lemon",
    ingredients: "Salmon fillets, lemon, olive oil, garlic, herbs",
    instructions: "Season salmon, grill for 12-15 minutes",
    cookingTime: 20,
    servings: 2,
    category: "Fish",
    tags: JSON.stringify(["fish", "healthy", "grilled"]),
  },
  {
    title: "Beef Tacos",
    description: "Delicious Mexican-style tacos",
    ingredients: "Ground beef, taco shells, lettuce, tomato, cheese, salsa",
    instructions: "Cook beef with spices, assemble tacos",
    cookingTime: 15,
    servings: 4,
    category: "Mexican",
    tags: JSON.stringify(["tacos", "mexican", "quick"]),
  },
  {
    title: "Tiramisu",
    description: "Classic Italian dessert",
    ingredients: "Mascarpone, ladyfingers, coffee, cocoa, eggs",
    instructions: "Layer ingredients and refrigerate overnight",
    cookingTime: 20,
    servings: 6,
    category: "Desserts",
    tags: JSON.stringify(["dessert", "italian", "no-bake"]),
  },
  {
    title: "Vegetable Curry",
    description: "Spiced vegetable curry",
    ingredients: "Mixed vegetables, coconut milk, curry paste, rice",
    instructions: "Sauté paste, add vegetables and milk, simmer",
    cookingTime: 30,
    servings: 4,
    category: "Indian",
    tags: JSON.stringify(["curry", "vegetarian", "indian"]),
  },
  {
    title: "Garlic Bread",
    description: "Crispy garlic bread",
    ingredients: "Baguette, butter, garlic, parsley",
    instructions: "Spread garlic butter on bread, bake until crispy",
    cookingTime: 15,
    servings: 4,
    category: "Bread",
    tags: JSON.stringify(["bread", "side-dish", "quick"]),
  },
];

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // Hash passwords
    const nikoPassword = await bcrypt.hash("pass123", 10);
    const mariaPassword = await bcrypt.hash("pass123", 10);

    // Insert users
    const [nikoUser, mariaUser] = await Promise.all([
      db
        .insert(schema.users)
        .values({ email: "niko@gmail.com", password: nikoPassword })
        .returning(),
      db
        .insert(schema.users)
        .values({ email: "maria@gmail.com", password: mariaPassword })
        .returning(),
    ]);

    console.log("✅ Users created:");
    console.log(`   - niko@gmail.com (ID: ${nikoUser[0].id})`);
    console.log(`   - maria@gmail.com (ID: ${mariaUser[0].id})`);

    // Insert recipes for both users
    const allRecipes = [
      ...sampleRecipes.map((recipe) => ({ ...recipe, userId: nikoUser[0].id })),
      ...sampleRecipes.map((recipe) => ({ ...recipe, userId: mariaUser[0].id })),
    ];

    await db.insert(schema.recipes).values(allRecipes);

    console.log(`✅ ${allRecipes.length} recipes created (10 per user)`);
    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
