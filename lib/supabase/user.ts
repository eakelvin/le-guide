import { cache } from "react";
import { cookies } from "next/headers";
import type { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type AppUser = {
  name?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  /** From `user_metadata` (e.g. signup). Legacy key `nationality` still read. */
  country?: string | null;
  /** From Supabase identities — affects password / account UI. */
  hasEmailPasswordIdentity: boolean;
};

function mapAuthUser(u: SupabaseAuthUser): Omit<AppUser, "hasEmailPasswordIdentity"> {
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  const first = typeof meta.first_name === "string" ? meta.first_name : "";
  const last = typeof meta.last_name === "string" ? meta.last_name : "";
  const full = typeof meta.full_name === "string" ? meta.full_name : "";
  const name =
    (first || last)
      ? `${first} ${last}`.trim()
      : full || (typeof meta.name === "string" ? meta.name : "") || null;

  const imageUrl =
    (typeof meta.avatar_url === "string" ? meta.avatar_url : null) ??
    (typeof meta.picture === "string" ? meta.picture : null);

  const country =
    (typeof meta.country === "string" ? meta.country : null) ??
    (typeof meta.nationality === "string" ? meta.nationality : null);

  return { name, email: u.email ?? null, imageUrl, country };
}

export const getAppUser = cache(async function getAppUser(): Promise<AppUser | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.auth.getUser();
  const u = data.user;
  if (!u) return null;

  const hasEmailPasswordIdentity = (u.identities ?? []).some((i) => i.provider === "email");

  return {
    ...mapAuthUser(u),
    hasEmailPasswordIdentity,
  };
});

