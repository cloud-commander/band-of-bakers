import { NextResponse } from "next/server";
import { signUpWithEmailAndPassword } from "@/lib/google-identity";
import { syncUser } from "@/lib/auth/sync-user";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = registerSchema.parse(body);

    // 1. Create user in GCP
    const { user: gcpUser } = await signUpWithEmailAndPassword(email, password, name);

    // 2. Sync to D1
    await syncUser({
      email: gcpUser.email,
      name: gcpUser.displayName,
      emailVerified: gcpUser.emailVerified,
      photoURL: gcpUser.photoURL,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed" },
      { status: 400 }
    );
  }
}
