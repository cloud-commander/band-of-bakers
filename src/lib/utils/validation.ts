import { z } from "zod";

/**
 * Extract field-level errors from Zod validation result
 */
export function getFieldErrors<T>(result: z.SafeParseReturnType<T, T>) {
  if (!result.success) {
    return result.error.flatten().fieldErrors;
  }
  return {};
}

/**
 * Get first error message for a field
 */
export function getFirstError(
  errors: Record<string, string[] | undefined>,
  field: string
): string | undefined {
  return errors[field]?.[0];
}

/**
 * Check if validation passed
 */
export function isValidationSuccess<T>(
  result: z.SafeParseReturnType<T, T>
): result is z.SafeParseSuccess<T> {
  return result.success;
}
