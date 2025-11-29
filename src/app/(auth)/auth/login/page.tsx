"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuotesDisplay } from "@/components/quotes-display";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { initiateGoogleSignIn } from "@/lib/google-identity";
import { loginSchema, type LoginFormData } from "@/lib/validators/auth";
import { z } from "zod";
import { signIn } from "next-auth/react";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate form data with Zod
      const formData: LoginFormData = {
        email,
        password,
      };

      const validatedData = loginSchema.parse(formData);

      const result = await signIn("credentials", {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "EMAIL_NOT_VERIFIED") {
          throw new Error("Please verify your email before logging in.");
        }
        if (result.error.toLowerCase().includes("invalid login credentials")) {
          throw new Error("Invalid email or password");
        }
        throw new Error(result.error);
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        setError(error.issues[0]?.message || "Please check your input");
      } else {
        setError(error instanceof Error ? error.message : "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle
            className={`${DESIGN_TOKENS.typography.h2.size} ${DESIGN_TOKENS.typography.h2.weight}`}
            style={{ fontFamily: DESIGN_TOKENS.typography.h2.family }}
          >
            Login
          </CardTitle>
          <p
            className={`${DESIGN_TOKENS.typography.body.sm.size}`}
            style={{ color: DESIGN_TOKENS.colors.text.muted }}
          >
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</div>}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            {/* Divider */}
            {/* Social login temporarily disabled */}
            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={initiateGoogleSignIn}
              disabled={isLoading}
            >
              ...google svg...
              Sign in with Google
            </Button> */}

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don&apos;t have an account? </span>
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <QuotesDisplay />
    </>
  );
}
