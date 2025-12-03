import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/";

  // If already logged in, redirect to callback URL
  if (session?.user) {
    redirect(callbackUrl);
  }

  // Redirect to route handler that will initiate Cognito OAuth flow
  // The screen_hint=signup parameter tells Cognito to show the signup form
  redirect(`/api/auth/signin-cognito?callbackUrl=${encodeURIComponent(callbackUrl)}&screen_hint=signup`);
}
