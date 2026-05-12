import type { UserProfile } from "@/types";

/** Matches the “Complete your profile” checklist: university + stay basics (arrival path + housing). */
export function isProfileMinimumComplete(profile: UserProfile): boolean {
    const u = profile.university?.trim();
    if (!u) return false;
    if (!profile.alreadyInFrance || !profile.hasAccommodation || !profile.arrivalDate?.trim()) return false;
    if (profile.alreadyInFrance === "yes") return !!profile.addressCity?.trim();
    return profile.alreadyInFrance === "no";
}
