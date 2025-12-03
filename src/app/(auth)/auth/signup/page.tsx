"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuotesDisplay } from "@/components/quotes-display";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    const handleSignup = async () => {
      await signIn("cognito", {
        callbackUrl,
        redirect: true,
        screen_hint: "signup",
      });
    };

    handleSignup().catch((error) => {
      console.error("Signup redirect error:", error);
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
            Sign Up
          </CardTitle>
          <p className="text-sm text-muted-foreground">Redirecting to Cognito hosted sign-up…</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            If you are not redirected automatically, click below.
          </p>
          <Button
            onClick={() =>
              signIn("cognito", {
                callbackUrl,
                redirect: true,
                screen_hint: "signup",
              })
            }
            className="w-full"
          >
            Continue to Cognito Sign Up
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() =>
                signIn("cognito", {
                  callbackUrl,
                  redirect: true,
                })
              }
              className="text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
            >
              Go to login
            </button>
          </p>
        </CardContent>
      </Card>
      <QuotesDisplay />
    </>
  );
}
