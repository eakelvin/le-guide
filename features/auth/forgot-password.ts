"use server";

import { cookies, headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { createClient } from "@/lib/supabase/server";

type ForgotState = { error?: string; ok?: boolean };

export async function forgotPasswordAction(_prev: ForgotState, formData: FormData): Promise<ForgotState> {
  const t = await getTranslations("auth");
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: t("enterEmailRequired") };

  const h = await headers();
  const origin = h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(AUTH_ROUTES.updatePassword)}`;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) return { error: error.message };

  return { ok: true };
}
