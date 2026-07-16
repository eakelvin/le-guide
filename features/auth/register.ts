"use server";

import { cookies, headers } from "next/headers";
import { redirectWithLocale } from "@/lib/locale-redirect";
import { getLocale, getTranslations } from "next-intl/server";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { withLocalePath, isAppLocale } from "@/lib/locale";
import { createClient } from "@/lib/supabase/server";

type RegisterState = { error?: string };

function isUserAlreadyRegistered(message: string) {
  const m = message.toLowerCase();
  return m.includes("already registered") || m.includes("user already exists") || m.includes("already exists");
}

export async function registerAction(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const t = await getTranslations("auth");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const university = String(formData.get("university") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();

  if (!firstName || !lastName || !email || !password) return { error: t("fillAllFields") };
  if (password.length < 8) return { error: t("passwordMinLength") };

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const h = await headers();
  const origin = h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const localeRaw = await getLocale();
  const locale = isAppLocale(localeRaw) ? localeRaw : "fr";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}${withLocalePath(locale, `${AUTH_ROUTES.login}?confirmed=1`)}`,
      data: {
        first_name: firstName,
        last_name: lastName,
        ...(university ? { university } : {}),
        ...(country ? { country } : {}),
      },
    },
  });

  if (error) {
    if (isUserAlreadyRegistered(error.message)) {
      return { error: t("accountExists") };
    }
    return { error: error.message };
  }

  // Supabase may return "success" for an email that already exists, but with no identities.
  // In that case, it won't send a confirmation email (prevents account enumeration).
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return { error: t("accountExists") };
  }

  // If email confirmations are enabled, there may be no session yet.
  if (!data.session) {
    return redirectWithLocale(`${AUTH_ROUTES.login}?checkEmail=1&email=${encodeURIComponent(email)}&fromSignup=1`);
  }

  return redirectWithLocale("/dashboard?signedIn=1");
}

