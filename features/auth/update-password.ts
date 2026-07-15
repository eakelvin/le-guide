"use server";

import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { redirectWithLocale } from "@/lib/locale-redirect";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { createClient } from "@/lib/supabase/server";

type UpdatePasswordState = { error?: string };

const RECOVERY_COOKIE = "password_recovery_flow";

export async function updatePasswordAction(_prev: UpdatePasswordState, formData: FormData): Promise<UpdatePasswordState> {
  const t = await getTranslations("auth");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const currentPassword = String(formData.get("current_password") ?? "");
  const nextRaw = String(formData.get("next") ?? "/dashboard");

  if (!password || !confirm) return { error: t("fillAllFields") };
  if (password !== confirm) return { error: t("passwordsMismatch") };
  if (password.length < 8) return { error: t("passwordMinLength") };

  const safeNext = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/dashboard";

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: t("sessionExpired") };
  }

  const user = userData.user;
  const email = user.email?.trim();
  const hasEmailIdentity = (user.identities ?? []).some((i) => i.provider === "email");
  const recoveryFlow = cookieStore.get(RECOVERY_COOKIE)?.value === "1";

  const clearRecoveryCookie = () => {
    cookieStore.set(RECOVERY_COOKIE, "", { path: AUTH_ROUTES.updatePassword, maxAge: 0 });
  };

  const applyPasswordUpdate = async (): Promise<UpdatePasswordState | void> => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { error: error.message };
    clearRecoveryCookie();
    return redirectWithLocale(`${safeNext}?passwordUpdated=1`);
  };

  if (recoveryFlow) {
    const result = await applyPasswordUpdate();
    if (result) return result;
    return {};
  }

  if (!hasEmailIdentity) {
    const result = await applyPasswordUpdate();
    if (result) return result;
    return {};
  }

  if (!email) {
    return { error: t("noEmailOnAccount") };
  }

  if (!currentPassword) {
    return { error: t("currentPasswordRequired") };
  }

  const { error: signError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });
  if (signError) {
    return { error: t("currentPasswordIncorrect") };
  }

  const result = await applyPasswordUpdate();
  if (result) return result;
  return {};
}
