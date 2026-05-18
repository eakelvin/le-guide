"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type ContactState = { error?: string; ok?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactAction(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) return { error: "Please enter your name." };
  if (!email || !EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (!message || message.length < 10) {
    return { error: "Please write a message of at least 10 characters." };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("contact_submissions").insert({
    name,
    email,
    subject: subject || "General enquiry",
    message,
  });

  if (error) {
    console.error("contact_submissions insert:", error.message);
    return { error: "Something went wrong. Please try again in a moment." };
  }

  return { ok: true };
}
