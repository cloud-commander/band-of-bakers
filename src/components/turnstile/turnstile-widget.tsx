"use client";

import Turnstile from "react-turnstile";

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: "light" | "dark";
  size?: "normal" | "compact";
}

export function TurnstileWidget({
  onSuccess,
  onError,
  onExpire,
  theme = "light",
  size = "normal",
}: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_BANDOFBAKERS_TURNSTILE_SITEKEY;

  if (!siteKey) {
    return null; // Widget disabled if sitekey not configured
  }

  return (
    <div className="flex justify-center my-4">
      <Turnstile
        sitekey={siteKey}
        theme={theme}
        size={size}
        onSuccess={onSuccess}
        onError={onError}
        onExpire={onExpire}
      />
    </div>
  );
}
