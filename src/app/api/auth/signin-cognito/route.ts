import { signIn } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const screenHint = searchParams.get("screen_hint");

  const host = request.headers.get("host");
  const origin = request.nextUrl.origin;
  const redirectUri = new URL(callbackUrl, origin).toString();

  console.log(
    JSON.stringify({
      msg: "[signin-cognito]",
      host,
      origin,
      callbackUrlParam: callbackUrl,
      redirectUri,
      fullUrl: request.url,
    })
  );

  // Use NextAuth signIn action to get the provider redirect URL without auto-redirect (avoids loops)
  // The screen_hint parameter can be used to show signup form
  const result = await signIn("cognito", {
    redirect: false,
    callbackUrl: redirectUri,
    ...(screenHint ? { screen_hint: screenHint } : {}),
  });

  if (result?.url) {
    return NextResponse.redirect(result.url);
  }

  // If no URL returned, fall back to callback target
  return NextResponse.redirect(new URL(redirectUri));
}
