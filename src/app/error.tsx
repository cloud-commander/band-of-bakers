"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/state/error-state";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container flex items-center justify-center min-h-[50vh]">
      <ErrorState
        title="Something went wrong!"
        message={error.message || "An unexpected error occurred. Please try again."}
        onRetry={reset}
        retryLabel="Try again"
      />
    </div>
  );
}
