import type { ZodError } from "zod";

/**
 * Converts a Zod validation error into a Nuxt HTTP 422 error.
 *
 * @example
 * const result = await readValidatedBody(event, InsertLocationLog.safeParse);
 *
 * if (!result.success) {
 *   sendZodError(result.error);
 * }
 *
 * @param error - Zod validation error.
 * @throws Nuxt error with status code 422.
 */

export default function sendZodError(error: ZodError): never {
  const statusMessage = error.issues.map(issue => `${issue.path.join("")}: ${issue.message}`).join("; ");

  const data = error.issues.reduce((errors, issue) => {
    errors[issue.path.join("")] = issue.message;
    return errors;
  }, {} as Record<string, string>);

  throw createError({
    statusCode: 422,
    statusMessage,
    data,
  });
}
