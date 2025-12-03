import { signOut } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // First, sign out from NextAuth
  await signOut({ redirect: false });

  // Get Cognito configuration from environment
  const cognitoDomain = process.env.AUTH_COGNITO_DOMAIN; // e.g., "bandofbakers" or full domain
  const clientId = process.env.AUTH_COGNITO_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

  // If Cognito domain is configured, redirect to Cognito logout
  if (cognitoDomain && clientId) {
    // Determine if it's a full domain or just the prefix
    const fullDomain = cognitoDomain.includes(".")
      ? cognitoDomain
      : `${cognitoDomain}.auth.${extractRegion()}.amazoncognito.com`;

    // Construct the logout URL
    const logoutUrl = new URL(`https://${fullDomain}/logout`);
    logoutUrl.searchParams.set("client_id", clientId);
    logoutUrl.searchParams.set("logout_uri", `${baseUrl}${callbackUrl}`);

    // Redirect to Cognito logout endpoint
    return NextResponse.redirect(logoutUrl.toString());
  }

  // If Cognito domain is not configured, just clear NextAuth session and redirect
  // Note: This means Cognito session will remain active, but NextAuth session is cleared
  return NextResponse.redirect(new URL(callbackUrl, baseUrl));
}

function extractRegion(): string {
  const issuer = process.env.AUTH_COGNITO_ISSUER;
  if (!issuer) return "eu-west-2"; // Default region
  const match = issuer.match(/cognito-idp\.([^.]+)\.amazonaws\.com/);
  return match ? match[1] : "eu-west-2";
}
