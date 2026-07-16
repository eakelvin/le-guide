import type {
    ChecklistItem,
    ChecklistCategory,
    DbProgress,
    ProgressState,
    UserProfile,
} from "@/types";

/**
 * Item-id constants for completions that are derived from profile fields.
 * Keep these centralised so the derivation rule and any UI special-cases
 * agree on the same id.
 */
export const PROFILE_DERIVED_ITEM_IDS = {
    accommodation: "find-housing",
} as const;

/** Checklist items that surface `officialLinks` under step 1. */
export const STEP_ONE_OFFICIAL_LINK_ITEM_IDS = new Set([
    "visa-validation",
    "caf-application",
    "declaration-of-tax",
    "student-social-security",
    "navigo",
]);

export function showsOfficialLinksOnStepOne(itemId: string): boolean {
    return STEP_ONE_OFFICIAL_LINK_ITEM_IDS.has(itemId);
}

export type ProfileDerivedReasonKey = "profileDerivedAccommodation";

export function getProfileDerivedCompletionReason(
    itemId: string,
    profile: UserProfile,
): ProfileDerivedReasonKey | null {
    if (
        itemId === PROFILE_DERIVED_ITEM_IDS.accommodation &&
        profile.hasAccommodation === "yes"
    ) {
        return "profileDerivedAccommodation";
    }
    return null;
}

export interface ArrivalSnapshot {
    /** Whole days between `arrivalDate` and `now` (always non-negative). */
    days: number;
}

/**
 * Diff between an arrival date and "now".
 * Returns `null` if the arrival date is missing or unparseable.
 *
 * Sign of the diff is intentionally discarded — callers decide whether to
 * read it as "ago" or "in" using `profile.alreadyInFrance`, and format
 * `days` with locale-aware copy at the UI boundary.
 */
export function getArrivalSnapshot(
    arrivalDate: string | null | undefined,
    now: Date = new Date(),
): ArrivalSnapshot | null {
    if (!arrivalDate) return null;
    const arrival = new Date(arrivalDate);
    if (Number.isNaN(arrival.getTime())) return null;

    const dayMs = 1000 * 60 * 60 * 24;
    const days = Math.abs(Math.floor((now.getTime() - arrival.getTime()) / dayMs));
    return { days };
}

export interface OfiiCountdown {
    /** Whole 30-day "months" remaining until the deadline. */
    months: number;
    /** Days remaining within the partial month (0–29). */
    days: number;
    /** True when the 3-month deadline has already elapsed. */
    overdue: boolean;
    /** Days past the deadline when overdue (0 otherwise). */
    daysOverdue: number;
}

/**
 * The OFII visa validation must be completed within 3 months of arrival.
 * Returns null when `arrivalDate` is missing or unparseable so callers can
 * decide whether to render a banner at all.
 *
 * Month math is intentionally approximate (30-day buckets) since the banner
 * copy says "approximately X months Y days" — exact calendar arithmetic isn't
 * meaningful at that level of precision.
 */
export function getOfiiCountdown(
    arrivalDate: string | null | undefined,
    now: Date = new Date(),
): OfiiCountdown | null {
    if (!arrivalDate) return null;
    const arrival = new Date(arrivalDate);
    if (Number.isNaN(arrival.getTime())) return null;

    const deadline = new Date(arrival);
    deadline.setMonth(deadline.getMonth() + 3);

    const dayMs = 1000 * 60 * 60 * 24;
    const diffMs = deadline.getTime() - now.getTime();

    if (diffMs <= 0) {
        const daysOverdue = Math.ceil(-diffMs / dayMs);
        return { months: 0, days: 0, overdue: true, daysOverdue };
    }
    const totalDays = Math.ceil(diffMs / dayMs);
    const months = Math.floor(totalDays / 30);
    const days = totalDays - months * 30;
    return { months, days, overdue: false, daysOverdue: 0 };
}

/**
 * Pure server-side derivation: layer profile-driven completions on top of the
 * DB-fetched progress map. Used in the dashboard SSR path so the user doesn't
 * have to manually mark items the profile already implies as done.
 *
 * Rules:
 *   - `hasAccommodation === "yes"` ⇒ `find-housing` is complete.
 *
 * No DB writes — the profile field stays the source of truth. If the user
 * changes the profile back, the derivation goes away on the next render.
 */
export function applyProfileDerivedCompletions(
    progress: DbProgress,
    profile: UserProfile,
): DbProgress {
    const completedItems = { ...progress.completedItems };
    if (profile.hasAccommodation === "yes") {
        completedItems[PROFILE_DERIVED_ITEM_IDS.accommodation] = true;
    }
    return { ...progress, completedItems };
}

/**
 * Client/server display layer: profile-derived completions behave like complete
 * checklist items, including their step ticks, without writing synthetic rows.
 */
export function applyProfileDerivedProgress(
    progress: ProgressState,
    profile: UserProfile,
    items: ChecklistItem[],
): ProgressState {
    const derived = applyProfileDerivedCompletions(progress, profile);
    const completedSteps = { ...derived.completedSteps };

    for (const item of items) {
        if (!getProfileDerivedCompletionReason(item.id, profile)) continue;
        item.stepsSummary.forEach((_, index) => {
            completedSteps[getChecklistStepKey(item.id, index)] = true;
        });
    }

    return { ...derived, completedSteps };
}

/**
 * Composite key for a sub-step inside `progress.completedSteps`. Mirrors the
 * shape persisted in `checklist_step_progress` (item_id + sub_step_index).
 */
export function getChecklistStepKey(itemId: string, subStepIndex: number): string {
    return `${itemId}_${subStepIndex}`;
}

export function isChecklistStepDone(
    itemId: string,
    subStepIndex: number,
    progress: ProgressState,
): boolean {
    return progress.completedSteps[getChecklistStepKey(itemId, subStepIndex)] === true;
}

export interface ChecklistItemProgress {
    done: number;
    total: number;
    pct: number;
}

export function getChecklistItemProgress(
    item: ChecklistItem,
    progress: ProgressState,
): ChecklistItemProgress {
    const total = item.stepsSummary.length;
    if (total === 0) return { done: 0, total: 0, pct: 0 };
    const done = item.stepsSummary.reduce(
        (acc, _, i) => acc + (isChecklistStepDone(item.id, i, progress) ? 1 : 0),
        0,
    );
    return { done, total, pct: Math.round((done / total) * 100) };
}

export type ChecklistItemStatus = "notStarted" | "inProgress" | "complete";

/**
 * Item completion is the source of truth for "Done". Sub-step ticks drive the
 * in-progress %. Marking an item done ticks all sub-steps; ticking every
 * sub-step marks the item done; unticking a step clears item completion.
 */
export function isChecklistItemDone(item: ChecklistItem, progress: ProgressState): boolean {
    return progress.completedItems[item.id] === true;
}

export function getChecklistItemStatus(
    item: ChecklistItem,
    progress: ProgressState,
): ChecklistItemStatus {
    if (isChecklistItemDone(item, progress)) return "complete";
    const { done } = getChecklistItemProgress(item, progress);
    if (done > 0) return "inProgress";
    return "notStarted";
}

/**
 * An item is locked when any of its prerequisites (`dependsOn`) is not yet
 * complete. Unknown prerequisite ids are ignored (treated as satisfied) so a
 * data hiccup doesn't permanently lock the UI.
 */
export function isChecklistItemLocked(
    item: ChecklistItem,
    allItems: ChecklistItem[],
    progress: ProgressState,
): boolean {
    if (item.dependsOn.length === 0) return false;
    const byId = new Map(allItems.map((it) => [it.id, it]));
    return item.dependsOn.some((depId) => {
        const dep = byId.get(depId);
        if (!dep) return false;
        return getChecklistItemStatus(dep, progress) !== "complete";
    });
}

/** Returns the list of dependency items still required to unlock this item. */
export function getUnmetDependencies(
    item: ChecklistItem,
    allItems: ChecklistItem[],
    progress: ProgressState,
): ChecklistItem[] {
    if (item.dependsOn.length === 0) return [];
    const byId = new Map(allItems.map((it) => [it.id, it]));
    return item.dependsOn
        .map((id) => byId.get(id))
        .filter((dep): dep is ChecklistItem =>
            !!dep && getChecklistItemStatus(dep, progress) !== "complete",
        );
}

export function getChecklistTotalProgress(
    items: ChecklistItem[],
    progress: ProgressState,
): ChecklistItemProgress {
    let done = 0;
    let total = 0;
    for (const item of items) {
        const p = getChecklistItemProgress(item, progress);
        done += p.done;
        total += p.total;
    }
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

/**
 * Map a `ChecklistCategory` to a `colorKey` used by `COLOR_CONFIG`. Reusing the
 * existing palette (coral, azure, forest, gold) lets us keep visual cohesion
 * with the rest of the dashboard. Violet stays unused.
 */
const CATEGORY_COLOR_MAP: Record<ChecklistCategory, "coral" | "azure" | "forest" | "gold"> = {
    arrival: "coral",
    "first-days": "azure",
    settling: "forest",
    "long-term": "gold",
};

export function getCategoryColorKey(category: ChecklistCategory): "coral" | "azure" | "forest" | "gold" {
    return CATEGORY_COLOR_MAP[category];
}
