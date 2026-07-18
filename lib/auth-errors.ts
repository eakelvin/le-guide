/**
 * Map Supabase Auth / GoTrue error messages to next-intl `auth.*` keys.
 * Falls back to a generic auth error so users never see raw English provider text.
 */
export type AuthErrorTranslator = (key: string) => string;

export function translateAuthError(
  message: string | null | undefined,
  t: AuthErrorTranslator,
): string {
  const m = (message ?? "").toLowerCase();

  if (!m) return t("errorAuthGeneric");

  if (
    m.includes("invalid login credentials") ||
    m.includes("invalid email or password") ||
    m.includes("invalid_credentials")
  ) {
    return t("errorInvalidCredentials");
  }
  if (m.includes("email not confirmed") || m.includes("email_not_confirmed")) {
    return t("errorEmailNotConfirmed");
  }
  if (
    m.includes("already registered") ||
    m.includes("user already exists") ||
    m.includes("already exists")
  ) {
    return t("accountExists");
  }
  if (m.includes("too many requests") || m.includes("rate limit")) {
    return t("errorTooManyRequests");
  }
  if (m.includes("weak password") || m.includes("password should be")) {
    return t("errorWeakPassword");
  }
  if (
    m.includes("same password") ||
    m.includes("should be different") ||
    m.includes("new password should be different")
  ) {
    return t("errorSamePassword");
  }
  if (m.includes("missing oauth code") || m.includes("oauth_missing_code")) {
    return t("errorOauthMissingCode");
  }

  return t("errorAuthGeneric");
}
