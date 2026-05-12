"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { fetchProfileForUser, upsertProfileForUser } from "@/lib/supabase/profile";
import type { ProfileUpsertResult, UserProfile } from "@/types";
import { DEFAULT_PROFILE } from "@/types";

/** Server-only: load profile for the current session (RSC or server action). */
export async function getMyProfileAction(): Promise<UserProfile> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return { ...DEFAULT_PROFILE };
  return fetchProfileForUser(supabase, userId);
}

export async function saveMyProfileAction(profile: UserProfile): Promise<ProfileUpsertResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return { error: "Not signed in." };
  return upsertProfileForUser(supabase, userId, profile);
}
