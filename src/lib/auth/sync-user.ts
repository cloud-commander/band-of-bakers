import { getDb } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function syncUser(authData: any) {
  const db = await getDb();
  const email = authData.email;

  if (!email) return;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    // Optional: Update avatar or other fields if they changed
    return existingUser;
  }

  // Create new user
  const newUser = {
    id: crypto.randomUUID(),
    email: email,
    name: authData.name || authData.displayName || "User",
    avatar_url: authData.picture || authData.photoURL || authData.image,
    email_verified: authData.emailVerified || false,
    role: "customer" as const,
  };

  await db.insert(users).values(newUser);
  return newUser;
}
