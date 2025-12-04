import { signOut } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = ensureLeadingSlash(searchParams.get("callbackUrl") || "/");

  // First, sign out from NextAuth
  const signOutResponse = await signOut({ redirect: false });

  // Get Cognito configuration from environment
  const cognitoDomain = resolveCognitoDomain(); // e.g., auth.bandofbakers.co.uk or *.amazoncognito.com
  const clientId = process.env.AUTH_COGNITO_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

  // If Cognito domain is configured, redirect to Cognito logout
  if (cognitoDomain && clientId) {
    // Construct the logout URL
    const logoutUrl = new URL(`https://${cognitoDomain}/logout`);
    logoutUrl.searchParams.set("client_id", clientId);
    logoutUrl.searchParams.set("logout_uri", `${baseUrl}${callbackUrl}`);

    // Redirect to Cognito logout endpoint, forwarding any session-clearing cookies from signOut
    const response = NextResponse.redirect(logoutUrl.toString());
    const setCookie = signOutResponse?.headers?.get("set-cookie");
    if (setCookie) {
      response.headers.append("set-cookie", setCookie);
    }
    return response;
  }

  // If Cognito domain is not configured, just clear NextAuth session and redirect
  // Note: This means Cognito session will remain active, but NextAuth session is cleared
  const fallback = NextResponse.redirect(new URL(callbackUrl, baseUrl));
  const setCookie = signOutResponse?.headers?.get("set-cookie");
  if (setCookie) {
    fallback.headers.append("set-cookie", setCookie);
  }
  return fallback;
}

function extractRegion(): string {
  const issuer = process.env.AUTH_COGNITO_ISSUER;
  if (!issuer) return "eu-west-2"; // Default region
  const match = issuer.match(/cognito-idp\.([^.]+)\.amazonaws\.com/);
  return match ? match[1] : "eu-west-2";
}

function resolveCognitoDomain(): string | null {
  // If explicitly provided, respect it
  if (process.env.AUTH_COGNITO_DOMAIN) {
    return process.env.AUTH_COGNITO_DOMAIN;
  }

  // Derive from hosted auth URL, e.g. https://auth.bandofbakers.co.uk/oauth2/authorize
  const authUrl = process.env.AUTH_COGNITO_AUTH;
  if (authUrl) {
    try {
      return new URL(authUrl).host;
    } catch (e) {
      console.warn("Unable to parse AUTH_COGNITO_AUTH", e);
    }
  }

  // Derive from issuer (gives *.amazoncognito.com)
  const issuer = process.env.AUTH_COGNITO_ISSUER;
  if (issuer) {
    try {
      const host = new URL(issuer).host;
      if (host.includes("cognito-idp")) {
        // Convert cognito-idp.<region>.amazonaws.com/<pool> to <pool>.auth.<region>.amazoncognito.com
        const [, region, pool] = host.match(/cognito-idp\.([^.]+)\.amazonaws\.com/) || [];
        if (region && pool) {
          const poolId = issuer.split("/").pop();
          if (poolId) {
            return `${poolId}.auth.${region}.amazoncognito.com`;
          }
        }
      }
      return host;
    } catch (e) {
      console.warn("Unable to parse AUTH_COGNITO_ISSUER", e);
    }
  }

  return null;
}

function ensureLeadingSlash(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}
