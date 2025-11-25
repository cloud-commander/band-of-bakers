/**
 * Reusable hook for handling form submissions with consistent patterns
 *
 * Features:
 * - Automatic toast notifications
 * - Error handling
 * - Navigation on success
 * - Loading state management
 */

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MOCK_API_DELAY_MS } from "@/lib/constants/app";

interface UseFormSubmissionOptions {
  successMessage: string;
  successDescription?: string;
  errorMessage?: string;
  redirectPath?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useFormSubmission<TData = unknown>({
  successMessage,
  successDescription,
  errorMessage = "An error occurred. Please try again.",
  redirectPath,
  onSuccess,
  onError,
}: UseFormSubmissionOptions) {
  const router = useRouter();

  const handleSubmit = async (
    data: TData,
    apiCall?: (data: TData) => Promise<void>
  ): Promise<void> => {
    try {
      if (apiCall) {
        await apiCall(data);
      } else {
        // Mock API call for development
        await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY_MS));
      }

      // Show success toast
      toast.success(successMessage, {
        description: successDescription,
      });

      // Call custom success handler if provided
      if (onSuccess) {
        onSuccess();
      }

      // Navigate if redirect path provided
      if (redirectPath) {
        router.push(redirectPath);
      }
    } catch (error) {
      // Show error toast
      const message = error instanceof Error ? error.message : errorMessage;
      toast.error(errorMessage, {
        description: message !== errorMessage ? message : undefined,
      });

      // Call custom error handler if provided
      if (onError) {
        onError(error);
      }

      // Re-throw to allow form-level error handling
      throw error;
    }
  };

  return { handleSubmit };
}
