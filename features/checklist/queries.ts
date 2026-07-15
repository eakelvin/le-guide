import { cache } from "react";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import { isAppLocale } from "@/lib/locale";
import type {
    ChecklistItem,
    ChecklistStepSummary,
    ChecklistRequirement,
    ChecklistOfficialLink,
    ChecklistCategory,
    ChecklistDifficulty,
    ChecklistPriority,
    ChecklistStatus,
    StudentGroup,
    VisaType,
} from "@/types";

/**
 * Raw shape returned by Supabase with nested children selected via PostgREST.
 * Each child relation is auto-resolved through its FK to `checklist_items.id`.
 */
type RawRow = {
    id: string;
    slug: string;
    locale: string;
    title: string;
    short_description: string;
    category: ChecklistCategory;
    order_index: number;
    estimated_time: string | null;
    difficulty: ChecklistDifficulty;
    priority: ChecklistPriority;
    is_required: boolean;
    applies_to_student_groups: StudentGroup[];
    applies_to_visa_types: VisaType[];
    deadline: string | null;
    last_verified_at: string | null;
    status: ChecklistStatus;
    why_this_matters: string | null;
    recommended_timing: string | null;
    common_options: string[];
    requirements: { name: string; required: boolean; sort_order: number }[];
    steps_summary: { summary: string; description: string | null; sort_order: number }[];
    warnings: { warning: string; sort_order: number }[];
    links: { label: string; url: string; sort_order: number }[];
    dependencies: { depends_on_id: string; sort_order: number }[];
};

const SELECT = `
    id, slug, locale, title, short_description, category, order_index,
    estimated_time, difficulty, priority, is_required,
    applies_to_student_groups, applies_to_visa_types,
    deadline, last_verified_at, status,
    why_this_matters, recommended_timing, common_options,
    requirements:checklist_item_requirements(name, required, sort_order),
    steps_summary:checklist_item_steps_summary(summary, description, sort_order),
    warnings:checklist_item_warnings(warning, sort_order),
    links:checklist_item_links(label, url, sort_order),
    dependencies:checklist_item_dependencies!checklist_item_dependencies_item_locale_fkey(depends_on_id, sort_order)
`;

function sortBy<T extends { sort_order: number }>(rows: T[]): T[] {
    return [...rows].sort((a, b) => a.sort_order - b.sort_order);
}

function toAppShape(row: RawRow): ChecklistItem {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        shortDescription: row.short_description,
        category: row.category,
        orderIndex: row.order_index,
        estimatedTime: row.estimated_time,
        difficulty: row.difficulty,
        priority: row.priority,
        isRequired: row.is_required,
        recommendedTiming: row.recommended_timing,
        whyThisMatters: row.why_this_matters,
        deadline: row.deadline,
        lastVerifiedAt: row.last_verified_at,
        status: row.status,
        dependsOn: sortBy(row.dependencies).map((d) => d.depends_on_id),
        requirements: sortBy(row.requirements).map<ChecklistRequirement>((r) => ({
            name: r.name,
            required: r.required,
        })),
        commonOptions: row.common_options,
        stepsSummary: sortBy(row.steps_summary).map<ChecklistStepSummary>((s) => ({
            summary: s.summary,
            ...(s.description ? { description: s.description } : {}),
        })),
        warnings: sortBy(row.warnings).map((w) => w.warning),
        appliesTo: {
            studentGroups: row.applies_to_student_groups,
            visaTypes: row.applies_to_visa_types,
        },
        officialLinks: sortBy(row.links)
            .filter((l) => l.url.trim() !== "")
            .map<ChecklistOfficialLink>((l) => ({
                label: l.label.trim() || l.url.trim(),
                url: l.url.trim(),
            })),
    };
}

async function resolveLocale(): Promise<(typeof routing.locales)[number]> {
    const localeRaw = await getLocale();
    return isAppLocale(localeRaw) ? localeRaw : routing.defaultLocale;
}

async function fetchChecklistRows(
    supabase: ReturnType<typeof createClient>,
    locale: (typeof routing.locales)[number],
) {
    return supabase
        .from("checklist_items")
        .select(SELECT)
        .eq("status", "active")
        .eq("locale", locale)
        .order("order_index", { ascending: true });
}

/**
 * Fetches every `active` checklist item for the current locale with nested children.
 * Falls back to English if the locale has not been seeded yet.
 * Memoised per request via `react.cache`.
 */
export const getActiveChecklist = cache(async function getActiveChecklist(): Promise<ChecklistItem[]> {
    const locale = await resolveLocale();
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    let { data, error } = await fetchChecklistRows(supabase, locale);

    if ((!data || data.length === 0) && locale !== routing.defaultLocale) {
        const fallback = await fetchChecklistRows(supabase, routing.defaultLocale);
        data = fallback.data;
        error = fallback.error;
    }

    if (error) {
        console.error("[checklist] fetch failed:", error.message);
        return [];
    }
    if (!data) return [];

    return (data as unknown as RawRow[]).map(toAppShape);
});

/** Look up one checklist item by slug for the current locale. */
export const getChecklistItemBySlug = cache(async function getChecklistItemBySlug(
    slug: string,
): Promise<ChecklistItem | null> {
    const items = await getActiveChecklist();
    return items.find((item) => item.slug === slug) ?? null;
});
