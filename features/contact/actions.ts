"use server";

import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

export type ContactState = { error?: string; ok?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactAction(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const t = await getTranslations("contact");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) return { error: t("errorNameRequired") };
  if (!email || !EMAIL_RE.test(email)) return { error: t("errorEmailInvalid") };
  if (!message || message.length < 10) {
    return { error: t("errorMessageTooShort") };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("contact_submissions").insert({
    name,
    email,
    subject: subject || t("defaultSubject"),
    message,
  });

  if (error) {
    console.error("contact_submissions insert:", error.message);
    return { error: t("errorGeneric") };
  }

  return { ok: true };
}
