const SENSITIVE_PATTERN =
  /(password|token|secret|api[_-]?key|authorization|bearer|session|cookie)/gi;
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

export function sanitizeErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";

  const cleaned = raw
    .replace(/[\r\n]+/g, " ")
    .replace(EMAIL_PATTERN, "[redacted]")
    .replace(SENSITIVE_PATTERN, "[redacted]")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return fallback;
  }

  if (cleaned.length > 220) {
    return `${cleaned.slice(0, 217)}...`;
  }

  return cleaned;
}

export function sanitizeAuthError(error: unknown): string {
  const message = sanitizeErrorMessage(
    error,
    "We could not complete that request. Please try again.",
  ).toLowerCase();

  if (
    message.includes("invalid") ||
    message.includes("credentials") ||
    message.includes("wrong") ||
    message.includes("sign in")
  ) {
    return "Invalid email or password. Please try again.";
  }

  if (message.includes("verify") || message.includes("confirm")) {
    return "Please verify your email before signing in. Check your inbox for a verification link.";
  }

  if (
    message.includes("already") ||
    message.includes("registered") ||
    message.includes("exists")
  ) {
    return "This email is already registered. Please sign in or use a different email.";
  }

  if (message.includes("rate limit") || message.includes("too many")) {
    return "Too many attempts. Please try again in a few minutes.";
  }

  if (message.includes("reset")) {
    return "We could not send the password reset email. Please try again.";
  }

  return "We could not complete that request. Please try again.";
}
