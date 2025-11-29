"use server";

import {
  signUpWithEmailAndPassword,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendVerificationByEmail,
} from "@/lib/google-identity";
import { syncUser } from "@/lib/auth/sync-user";
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
    const { user, idToken } = await signUpWithEmailAndPassword(email, password, name);

    // 2. Sync user to D1 database
    // We pass the user object from GCP, but we might want to add phone if supported by syncUser
    // Checking syncUser implementation, it takes authData.
    // We'll pass an object that matches what syncUser expects.
    await syncUser({
      ...user,
      displayName: name,
      photoURL: user.photoURL,
      phone: phone,
    });

    // 3. Send verification email
    await sendVerificationEmail(idToken);

    // 4. Do not auto-sign-in; require email verification flow on client
    return { success: true, needsVerification: true, email };
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

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) {
    return { error: "Email is required" };
  }

  try {
    await sendPasswordResetEmail(email);
    return { success: true };
  } catch (error) {
    console.error("Password reset request failed:", error);
    return { error: error instanceof Error ? error.message : "Failed to send reset email" };
  }
}

export async function resendVerification(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required" };

  try {
    await sendVerificationByEmail(email);
    return { success: true };
  } catch (error) {
    console.error("Resend verification failed:", error);
    return { error: "Unable to resend verification email" };
  }
}
