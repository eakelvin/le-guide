"use server";

import { cookies, headers } from "next/headers";
import { redirectWithLocale } from "@/lib/locale-redirect";
import { getLocale, getTranslations } from "next-intl/server";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { withLocalePath, isAppLocale } from "@/lib/locale";
import { createClient } from "@/lib/supabase/server";
import { translateAuthError } from "@/lib/auth-errors";
import { upsertProfileForUser } from "@/features/profile/queries";
import { DEFAULT_PROFILE } from "@/types";

type RegisterState = { error?: string };

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
    return { error: translateAuthError(error.message, t) };
  }

  // Supabase may return "success" for an email that already exists, but with no identities.
  // In that case, it won't send a confirmation email (prevents account enumeration).
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return { error: t("accountExists") };
  }

  // Persist signup fields onto public.profiles when we already have a session
  // (email confirmations off). With confirmations on, the DB trigger seeds the row.
  if (data.user && data.session) {
    await upsertProfileForUser(supabase, data.user.id, {
      ...DEFAULT_PROFILE,
      firstName,
      lastName,
      email,
      university,
      country,
    });
  }

  // If email confirmations are enabled, there may be no session yet.
  if (!data.session) {
    return redirectWithLocale(`${AUTH_ROUTES.login}?checkEmail=1&email=${encodeURIComponent(email)}&fromSignup=1`);
  }

  return redirectWithLocale("/dashboard?signedIn=1");
}
