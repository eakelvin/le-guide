"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { fetchProfileForUser, seedProfileFromAuthUser, upsertProfileForUser } from "./queries";
import type { ProfileUpsertResult, UserProfile } from "@/types";
import { DEFAULT_PROFILE } from "@/types";

/** Server-only: load profile for the current session (RSC or server action). */
export async function getMyProfileAction(): Promise<UserProfile> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return { ...DEFAULT_PROFILE };

  const fetched = await fetchProfileForUser(supabase, user.id);
  const { profile, changed } = seedProfileFromAuthUser(fetched, user);

  // Persist seeded signup fields so profile stays filled after refresh.
  if (changed) {
    await upsertProfileForUser(supabase, user.id, profile);
  }

  return profile;
}

export async function saveMyProfileAction(profile: UserProfile): Promise<ProfileUpsertResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return { error: "Not signed in." };
  return upsertProfileForUser(supabase, userId, profile);
}
