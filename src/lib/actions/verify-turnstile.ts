"use server";

interface TurnstileVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  error_codes?: string[];
  score?: number;
  score_reason?: string[];
}

export async function verifyTurnstileToken(token: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!token) {
    return {
      success: false,
      error: "No CAPTCHA token provided",
    };
  }

  const secretKey = process.env.BANDOFBAKERS_TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    // Log this but don't fail - Turnstile is optional
    console.warn("Turnstile secret key not configured");
    return {
      success: true, // Allow in development if not configured
    };
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });

    const data: TurnstileVerifyResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: "Failed to verify CAPTCHA",
      };
    }

    if (!data.success) {
      return {
        success: false,
        error: data.error_codes?.join(", ") || "CAPTCHA verification failed",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return {
      success: false,
      error: "CAPTCHA verification error",
    };
  }
}
