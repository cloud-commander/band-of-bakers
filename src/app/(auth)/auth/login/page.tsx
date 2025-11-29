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
import { loginSchema, type LoginFormData } from "@/lib/validators/auth";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { resendVerification } from "@/actions/auth";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pendingResend, setPendingResend] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setEmailError("");
    setPasswordError("");

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
        const code = result.error.toUpperCase();
        if (code.includes("EMAIL_NOT_VERIFIED")) {
          setEmailError("Please verify your email before logging in.");
          throw new Error("Please verify your email before logging in.");
        }
        if (code.includes("INVALID LOGIN CREDENTIALS") || code.includes("CREDENTIALSSIGNIN")) {
          setEmailError("Check your email address.");
          setPasswordError("Invalid email or password.");
          throw new Error("Invalid email or password.");
        }
        throw new Error("Unable to sign in. Please try again.");
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
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded" role="alert">
                {error}
              </div>
            )}
            {emailError && (
              <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded flex justify-between items-center">
                <span>{emailError}</span>
                <button
                  type="button"
                  className="text-primary underline text-xs disabled:opacity-50"
                  disabled={pendingResend || !email}
                  onClick={async () => {
                    if (!email) return;
                    setPendingResend(true);
                    setError("");
                    try {
                      const formData = new FormData();
                      formData.append("email", email);
                      const result = await resendVerification(formData);
                      if (result.error) throw new Error(result.error);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Failed to resend email");
                    } finally {
                      setPendingResend(false);
                    }
                  }}
                >
                  {pendingResend ? "Resending..." : "Resend email"}
                </button>
              </div>
            )}
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
                className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                aria-invalid={!!emailError}
              />
              {emailError && <p className="text-xs text-red-600 mt-1">{emailError}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 pr-10"
                  aria-invalid={!!passwordError}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && <p className="text-xs text-red-600 mt-1">{passwordError}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <div className="flex justify-between text-sm text-muted-foreground">
              <Link
                href="/auth/forgot"
                className="hover:underline text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
              >
                Forgot password?
              </Link>
            </div>

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
