import { signIn } from "@/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const screenHint = searchParams.get("screen_hint");

  // Use NextAuth signIn action to redirect to Cognito Hosted UI
  // The screen_hint parameter can be used to show signup form
  await signIn("cognito", {
    redirectTo: callbackUrl,
    // TODO: Add screen_hint support if needed for signup differentiation
  });
}
