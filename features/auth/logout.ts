"use server";

import { cookies } from "next/headers";
import { redirectWithLocale } from "@/lib/locale-redirect";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { createClient } from "@/lib/supabase/server";

export async function logoutAction() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  return redirectWithLocale(`${AUTH_ROUTES.login}?signedOut=1`);
}

