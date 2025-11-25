import { z } from "zod";

/**
 * Extract field-level errors from Zod validation result
 */
export function getFieldErrors<T>(result: z.ZodSafeParseSuccess<T> | z.ZodSafeParseError<T>) {
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
  result: z.ZodSafeParseSuccess<T> | z.ZodSafeParseError<T>
): result is z.ZodSafeParseSuccess<T> {
  return result.success;
}
