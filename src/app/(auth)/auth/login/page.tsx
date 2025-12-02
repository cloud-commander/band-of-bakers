"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { QuotesDisplay } from "@/components/quotes-display";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    // Automatically redirect to Cognito login
    // This ensures the auth flow works correctly across all environments
    // (localhost, staging, production) with trustHost: true detecting the correct host
    const handleLogin = async () => {
      await signIn("cognito", { callbackUrl, redirect: true });
    };

    handleLogin().catch((error) => {
      console.error("Login error:", error);
    });
  }, [callbackUrl]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle
            className={`${DESIGN_TOKENS.typography.h2.size} ${DESIGN_TOKENS.typography.h2.weight}`}
            style={{ fontFamily: DESIGN_TOKENS.typography.h2.family }}
          >
            Sign In
          </CardTitle>
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            If you are not redirected automatically, click the button below.
          </p>

          <Button
            onClick={() => signIn("cognito", { callbackUrl, redirect: true })}
            className="w-full"
          >
            Sign in with Cognito
          </Button>

          <div className="text-center text-sm">
            <span>Don&apos;t have an account? </span>
            <Link
              href="/auth/signup"
              className="text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
      <QuotesDisplay />
    </>
  );
}
