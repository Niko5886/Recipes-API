import { pgTable, serial, text, timestamp, integer, varchar, foreignKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Users таблица
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(), // bcrypted password
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Recipes таблица
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  ingredients: text("ingredients").notNull(), // JSON array или comma-separated
  instructions: text("instructions").notNull(),
  cookingTime: integer("cooking_time").notNull(), // в минути
  servings: integer("servings").notNull(),
  tags: text("tags").default("[]"), // JSON array
  category: varchar("category", { length: 100 }),
  photoUrl: text("photo_url"),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dateCreated: timestamp("date_created").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
