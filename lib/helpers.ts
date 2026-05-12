import { UserProfile } from "@/types";

export function getInitials(p: UserProfile) {
    const f = (p.firstName ?? "").trim()[0] ?? "";
    const l = (p.lastName ?? "").trim()[0] ?? "";
    return (f + l).toUpperCase() || "?";
}

export function getCompletionPct(p: UserProfile): number {
    const base: (keyof UserProfile)[] = [
        "firstName", "lastName", "email", "country",
        "university", "program", "studentType",
        "alreadyInFrance", "hasAccommodation", "arrivalDate",
    ];
    const filled = base.filter((k) => !!p[k]).length;
    const citySegment =
        p.alreadyInFrance === "yes" ? (p.addressCity?.trim() ? 1 : 0) : p.alreadyInFrance === "no" ? 1 : 0;
    const total = 11;
    return Math.round(((filled + citySegment) / total) * 100);
}

export function getStayCompletionCounts(p: UserProfile): { done: number; total: number } {
    const total = 4;
    let done = 0;
    if (p.alreadyInFrance) done++;
    if (p.hasAccommodation) done++;
    if (p.arrivalDate?.trim()) done++;
    if (p.alreadyInFrance === "yes") {
        if (p.addressCity?.trim()) done++;
    } else if (p.alreadyInFrance === "no") {
        done++;
    }
    return { done, total };
}

export function getCompletionBySection(p: UserProfile) {
    const stayQ = getStayCompletionCounts(p);
    return {
        personal: ["firstName", "lastName", "email", "phone", "country", "dateOfBirth"].filter((k) => !!p[k as keyof UserProfile]).length,
        personalTotal: 6,
        academic: ["university", "program", "studentType", "campusCity", "academicYear"].filter((k) => !!p[k as keyof UserProfile]).length,
        academicTotal: 5,
        stay: stayQ.done,
        stayTotal: stayQ.total,
        /** Sidebar only — not tied to profile fields */
        account: 1,
        accountTotal: 1,
    };
}

/** Matches the “Complete your profile” checklist: university + stay basics (arrival path + housing). */
export function isProfileMinimumComplete(profile: UserProfile): boolean {
    const u = profile.university?.trim();
    if (!u) return false;
    if (!profile.alreadyInFrance || !profile.hasAccommodation || !profile.arrivalDate?.trim()) return false;
    if (profile.alreadyInFrance === "yes") return !!profile.addressCity?.trim();
    return profile.alreadyInFrance === "no";
}