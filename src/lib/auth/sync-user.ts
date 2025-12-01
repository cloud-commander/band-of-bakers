import { getDb } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

interface AuthData {
  email?: string | null | undefined;
  name?: string | null;
  displayName?: string | null;
  picture?: string | null;
  photoURL?: string | null;
  image?: string | null;
  emailVerified?: boolean | Date | null;
  phone?: string;
}

const KNOWN_ADMIN_EMAILS = new Set(["admin@bandofbakers.co.uk", "circularpi@hotmail.co.uk"]);

export async function syncUser(authData: AuthData) {
  const db = await getDb();
  const email = authData.email;

  if (!email) return;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    // Optional: Update avatar or other fields if they changed
    const desiredRole = KNOWN_ADMIN_EMAILS.has(email.toLowerCase()) ? "owner" : existingUser.role;
    if (
      desiredRole !== existingUser.role ||
      authData.picture ||
      authData.photoURL ||
      authData.image
    ) {
      const [updatedUser] = await db
        .update(users)
        .set({
          role: desiredRole,
          avatar_url:
            authData.picture || authData.photoURL || authData.image || existingUser.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .where(eq(users.email, email))
        .returning();
      return updatedUser;
    }
    return existingUser;
  }

  // Create new user
  const newUser = {
    id: crypto.randomUUID(),
    email: email,
    name: authData.name || authData.displayName || "User",
    phone: authData.phone,
    avatar_url: authData.picture || authData.photoURL || authData.image,
    email_verified: Boolean(authData.emailVerified),
    role: "customer" as const,
    is_banned: false,
  };

  await db.insert(users).values(newUser);
  return newUser;
}
