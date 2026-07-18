"use server";

import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { redirectWithLocale } from "@/lib/locale-redirect";
import { createClient } from "@/lib/supabase/server";
import { translateAuthError } from "@/lib/auth-errors";

type LoginState = { error?: string };

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const t = await getTranslations("auth");
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard") || "/dashboard";

  if (!email || !password) return { error: t("fillAllFields") };

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: translateAuthError(error.message, t) };

  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  const sep = safeNext.includes("?") ? "&" : "?";
  return redirectWithLocale(`${safeNext}${sep}signedIn=1`);
}

