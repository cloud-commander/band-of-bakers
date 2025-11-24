import { NextRequest, NextResponse } from "next/server";
import {
  signInWithEmailAndPassword,
  signUpWithEmailAndPassword,
  GoogleUser,
} from "@/lib/google-identity";

interface AuthRequest {
  email: string;
  password: string;
  displayName?: string;
  action: "signin" | "signup";
}

export async function POST(request: NextRequest) {
  try {
    const body: AuthRequest = await request.json();
    const { email, password, displayName, action } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    let result;

    if (action === "signup") {
      result = await signUpWithEmailAndPassword(email, password, displayName);
    } else {
      result = await signInWithEmailAndPassword(email, password);
    }

    const { idToken, user } = result;

    // Create session data
    const sessionData = {
      idToken,
      user,
      expiresIn: 3600, // 1 hour in seconds
    };

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      user,
      message: action === "signup" ? "Account created successfully" : "Signed in successfully",
    });

    response.cookies.set("auth-session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600,
    });

    return response;
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Authentication failed",
      },
      { status: 400 }
    );
  }
}

// Get current user from session
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("auth-session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const sessionData = JSON.parse(sessionCookie);

    return NextResponse.json({
      user: sessionData.user,
      expiresAt: new Date(Date.now() + sessionData.expiresIn * 1000).toISOString(),
    });
  } catch (error) {
    console.error("Session retrieval error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
