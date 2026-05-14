import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function createUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
      })
      .returning();

    return result[0];
  } catch (error) {
    throw new Error("Не е възможно да се създаде потребител");
  }
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0];
}

export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0];
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
) {
  return bcrypt.compare(plainPassword, hashedPassword);
}
