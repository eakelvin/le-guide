"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { createClient } from "@/lib/supabase/server";

type RegisterState = { error?: string };

function isUserAlreadyRegistered(message: string) {
  const m = message.toLowerCase();
  return m.includes("already registered") || m.includes("user already exists") || m.includes("already exists");
}

export async function registerAction(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const university = String(formData.get("university") ?? "").trim();
  const nationality = String(formData.get("nationality") ?? "").trim();

  if (!firstName || !lastName || !email || !password) return { error: "Please fill in all fields." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const h = await headers();
  const origin = h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}${AUTH_ROUTES.login}?confirmed=1`,
      data: {
        first_name: firstName,
        last_name: lastName,
        ...(university ? { university } : {}),
        ...(nationality ? { nationality } : {}),
      },
    },
  });

  if (error) {
    if (isUserAlreadyRegistered(error.message)) {
      return { error: "An account with this email already exists. Please sign in instead." };
    }
    return { error: error.message };
  }

  // Supabase may return "success" for an email that already exists, but with no identities.
  // In that case, it won't send a confirmation email (prevents account enumeration).
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return { error: "An account with this email already exists. Please sign in instead." };
  }

  // If email confirmations are enabled, there may be no session yet.
  if (!data.session) {
    redirect(`${AUTH_ROUTES.login}?checkEmail=1&email=${encodeURIComponent(email)}&fromSignup=1`);
  }

  redirect("/dashboard?signedIn=1");
}

