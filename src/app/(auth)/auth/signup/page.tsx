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
import { signupSchema, type SignupFormData } from "@/lib/validators/auth";
import { z } from "zod";
import { registerUser } from "@/actions/auth";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate form data with Zod
      const formData: SignupFormData = {
        name,
        email,
        phone,
        password,
        confirmPassword,
      };

      const validatedData = signupSchema.parse(formData);

      const submitData = new FormData();
      submitData.append("name", validatedData.name);
      submitData.append("email", validatedData.email);
      submitData.append("phone", validatedData.phone);
      submitData.append("password", validatedData.password);

      const result = await registerUser(submitData);

      if (result.error) {
        throw new Error(result.error);
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        setError(error.issues[0]?.message || "Please check your input");
      } else {
        setError(error instanceof Error ? error.message : "Signup failed");
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
            Create an Account
          </CardTitle>
          <p
            className={`${DESIGN_TOKENS.typography.body.sm.size}`}
            style={{ color: DESIGN_TOKENS.colors.text.muted }}
          >
            Sign up to start ordering from Band of Bakers
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</div>}
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Fred Baker"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="fred@baker.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+44 7700 900000"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Re-enter your password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={initiateGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>

            <div
              className={`text-center ${DESIGN_TOKENS.typography.body.sm.size}`}
              style={{ color: DESIGN_TOKENS.colors.text.muted }}
            >
              <span>Already have an account? </span>
              <Link
                href="/auth/login"
                className="hover:underline"
                style={{ color: DESIGN_TOKENS.colors.accent }}
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <QuotesDisplay />
    </>
  );
}
