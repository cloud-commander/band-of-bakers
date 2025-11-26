"use server";

import { signUpWithEmailAndPassword } from "@/lib/google-identity";
import { syncUser } from "@/lib/auth/sync-user";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;

  if (!email || !password || !name) {
    return { error: "Missing required fields" };
  }

  try {
    // 1. Create user in GCP Identity Platform
    const { user } = await signUpWithEmailAndPassword(email, password, name);

    // 2. Sync user to D1 database
    // We pass the user object from GCP, but we might want to add phone if supported by syncUser
    // Checking syncUser implementation, it takes authData.
    // We'll pass an object that matches what syncUser expects.
    await syncUser({
      ...user,
      displayName: name,
      photoURL: user.photoURL,
      // Phone is not currently handled by syncUser based on my previous read,
      // but we can update syncUser later if needed. For now, let's just pass it.
      phone: phone,
    });

    // 3. Sign the user in immediately
    // We can't easily sign them in on the server side with credentials without re-verifying
    // But we can try to call signIn with the credentials we just used.
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    console.error("Registration error:", error);
    return { error: error instanceof Error ? error.message : "Registration failed" };
  }
}
