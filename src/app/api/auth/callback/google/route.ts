import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getUserInfo, verifyOAuthState } from "@/lib/google-identity";

// Handle Google OAuth callback
export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  try {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      console.error("OAuth error:", error);
      return NextResponse.redirect(new URL("/auth/login?error=oauth_error", url.origin));
    }

    // Validate required parameters
    if (!code || !state) {
      console.error("Missing code or state parameter");
      return NextResponse.redirect(new URL("/auth/login?error=missing_params", url.origin));
    }

    // Verify state parameter for security
    if (!verifyOAuthState(state)) {
      console.error("Invalid OAuth state parameter");
      return NextResponse.redirect(new URL("/auth/login?error=invalid_state", url.origin));
    }

    // Exchange authorization code for tokens
    const tokenData = await exchangeCodeForToken(code);

    // Get user info from Google
    const userInfo = await getUserInfo(tokenData.access_token);

    // Create session data
    const sessionData = {
      idToken: tokenData.id_token,
      user: {
        uid: userInfo.id,
        email: userInfo.email,
        displayName: userInfo.name,
        photoURL: userInfo.picture,
        emailVerified: userInfo.verified_email,
      },
      expiresIn: tokenData.expires_in,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
    };

    // Set session cookie
    const response = NextResponse.redirect(new URL("/", url.origin));

    // Store session data (you may want to encrypt this)
    response.cookies.set("auth-session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in,
    });

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL("/auth/login?error=callback_failed", url.origin));
  }
}
