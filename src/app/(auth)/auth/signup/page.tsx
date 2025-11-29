"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { QuotesDisplay } from "@/components/quotes-display";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { signupSchema, type SignupFormData } from "@/lib/validators/auth";
import { z } from "zod";
import { registerUser } from "@/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
export const dynamic = "force-dynamic";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<"weak" | "medium" | "strong">("weak");
  const [lastEmail, setLastEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (completed) return;
    setIsLoading(true);
    setError("");
    setSuccess(false);

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

      if (validatedData.email) {
        setLastEmail(validatedData.email);
      }
      setSuccess(true);
      setCompleted(true);
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
          {success ? (
            <div className="space-y-4" aria-live="polite">
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Check your email</AlertTitle>
                <AlertDescription>
                  We&apos;ve sent a verification link to {lastEmail || email || "your inbox"}. Please verify to
                  activate your account.
                </AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground text-center">
                Didn&apos;t get it? Check spam or try again in a few minutes.
              </p>
              <div className="text-center text-sm">
                <Link href="/auth/login" className="text-primary hover:underline">
                  Back to login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite">
              {error && <div className="text-sm text-red-500 bg-red-50 p-2 rounded" role="alert">{error}</div>}
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
                <p className="text-xs text-muted-foreground mt-1">
                  We&apos;ll send a verification link to this address.
                </p>
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPassword(value);
                      const isLong = value.length >= 10;
                      const hasMix = /[A-Z]/.test(value) && /[0-9]/.test(value);
                      const isStrong = isLong && hasMix;
                      const isMedium = value.length >= 8 && (isLong || hasMix);
                      setStrength(isStrong ? "strong" : isMedium ? "medium" : "weak");
                    }}
                    disabled={isLoading}
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
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>Minimum 8 characters.</span>
                  <span
                    className={`font-semibold ${
                      strength === "strong"
                        ? "text-emerald-600"
                        : strength === "medium"
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    {strength === "strong"
                      ? "Strong"
                      : strength === "medium"
                        ? "Medium"
                        : "Weak"}
                  </span>
                </div>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Re-enter your password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || completed}>
                {isLoading ? "Creating account..." : completed ? "Check your email" : "Sign Up"}
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
          )}
        </CardContent>
      </Card>
      <QuotesDisplay />
    </>
  );
}
