import type {
    ChecklistItem,
    ChecklistCategory,
    ProgressState,
} from "@/types";

/**
 * Progress storage uses the existing `useProgress` keys (`<processId>_<stepId>`).
 * For checklist items, we use the item id as `processId` and the sub-step
 * index as `stepId`. This keeps a single source of truth in localStorage
 * without needing a new bucket.
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

export type ChecklistItemStatus = "Not started" | "In progress" | "Complete";

export function getChecklistItemStatus(
    item: ChecklistItem,
    progress: ProgressState,
): ChecklistItemStatus {
    const { done, total } = getChecklistItemProgress(item, progress);
    if (total > 0 && done === total) return "Complete";
    if (done > 0) return "In progress";
    return "Not started";
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
        return getChecklistItemStatus(dep, progress) !== "Complete";
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
            !!dep && getChecklistItemStatus(dep, progress) !== "Complete",
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
