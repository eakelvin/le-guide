"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { createClient } from "@/lib/supabase/server";

type UpdatePasswordState = { error?: string };

const RECOVERY_COOKIE = "password_recovery_flow";

export async function updatePasswordAction(_prev: UpdatePasswordState, formData: FormData): Promise<UpdatePasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const currentPassword = String(formData.get("current_password") ?? "");
  const nextRaw = String(formData.get("next") ?? "/dashboard");

  if (!password || !confirm) return { error: "Please fill in all fields." };
  if (password !== confirm) return { error: "Passwords do not match." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const safeNext = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/dashboard";

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "Your session expired. Request a new reset link from the forgot password page." };
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
    redirect(`${safeNext}?passwordUpdated=1`);
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
    return { error: "Your account has no email address; password update isn’t available." };
  }

  if (!currentPassword) {
    return { error: "Enter your current password first." };
  }

  const { error: signError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });
  if (signError) {
    return { error: "Current password is incorrect." };
  }

  const result = await applyPasswordUpdate();
  if (result) return result;
  return {};
}
