import type { SupabaseClient, User as SupabaseAuthUser } from "@supabase/supabase-js";
import type { ProfileRow, ProfileUpsertResult, ProfileYesNo, UserProfile } from "@/types";
import { DEFAULT_PROFILE, STUDENT_TYPE_VALUES } from "@/types";

function yn(v: unknown): ProfileYesNo {
  return v === "yes" || v === "no" ? v : "";
}

function normalizeStudentType(v: unknown): UserProfile["studentType"] {
  return typeof v === "string" && (STUDENT_TYPE_VALUES as readonly string[]).includes(v)
    ? (v as UserProfile["studentType"])
    : "";
}

function metaString(meta: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const v = meta[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

/** Fill empty profile fields from auth user_metadata / email (signup leftovers). */
export function seedProfileFromAuthUser(
  profile: UserProfile,
  user: SupabaseAuthUser,
): { profile: UserProfile; changed: boolean } {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const next = { ...profile };
  let changed = false;

  const fill = (key: keyof UserProfile, value: string) => {
    if (!(next[key] ?? "").toString().trim() && value) {
      (next as Record<string, string>)[key] = value;
      changed = true;
    }
  };

  fill("firstName", metaString(meta, "first_name"));
  fill("lastName", metaString(meta, "last_name"));
  fill("email", (user.email ?? "").trim());
  fill("country", metaString(meta, "country", "nationality"));
  fill("university", metaString(meta, "university"));

  if (!(next.firstName ?? "").trim() && !(next.lastName ?? "").trim()) {
    const full = metaString(meta, "full_name", "name");
    if (full) {
      const parts = full.split(/\s+/);
      next.firstName = parts[0] ?? "";
      next.lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
      changed = true;
    }
  }

  return { profile: next, changed };
}

export function profileRowToUserProfile(row: ProfileRow | null): UserProfile {
  if (!row) return { ...DEFAULT_PROFILE };
  const p: UserProfile = {
    firstName: typeof row.first_name === "string" ? row.first_name : "",
    lastName: typeof row.last_name === "string" ? row.last_name : "",
    email: typeof row.email === "string" ? row.email : "",
    phone: typeof row.phone === "string" ? row.phone : "",
    country: typeof row.country === "string" ? row.country : "",
    dateOfBirth: typeof row.date_of_birth === "string" ? row.date_of_birth : "",
    university: typeof row.university === "string" ? row.university : "",
    program: typeof row.program === "string" ? row.program : "",
    studentType: normalizeStudentType(row.student_type),
    campusCity: typeof row.campus_city === "string" ? row.campus_city : "",
    academicYear: typeof row.academic_year === "string" ? row.academic_year : "",
    alreadyInFrance: yn(row.already_in_france),
    arrivalDate: typeof row.arrival_date === "string" ? row.arrival_date : "",
    addressCity: typeof row.address_city === "string" ? row.address_city : "",
    hasAccommodation: yn(row.has_accommodation),
  };
  return p;
}

export function userProfileToUpsertRow(userId: string, profile: UserProfile): ProfileRow {
  return {
    id: userId,
    first_name: profile.firstName ?? "",
    last_name: profile.lastName ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    country: profile.country ?? "",
    date_of_birth: profile.dateOfBirth ?? "",
    university: profile.university ?? "",
    program: profile.program ?? "",
    student_type: profile.studentType ?? "",
    campus_city: profile.campusCity ?? "",
    academic_year: profile.academicYear ?? "",
    already_in_france: yn(profile.alreadyInFrance),
    arrival_date: profile.arrivalDate ?? "",
    address_city: profile.addressCity ?? "",
    has_accommodation: yn(profile.hasAccommodation),
  };
}

export async function fetchProfileForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, first_name, last_name, email, phone, country, date_of_birth, university, program, student_type, campus_city, academic_year, already_in_france, arrival_date, address_city, has_accommodation",
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[profiles] fetch error", error.message);
    return { ...DEFAULT_PROFILE };
  }
  return profileRowToUserProfile(data as ProfileRow | null);
}

export async function upsertProfileForUser(
  supabase: SupabaseClient,
  userId: string,
  profile: UserProfile,
): Promise<ProfileUpsertResult> {
  const row = userProfileToUpsertRow(userId, profile);
  const { error } = await supabase.from("profiles").upsert(row, { onConflict: "id" });
  if (error) return { error: error.message };
  return {};
}
