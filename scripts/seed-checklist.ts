/**
 * Seed `lib/data/steps.json` into Supabase.
 *
 * Usage:
 *   npm run seed:checklist                       # local supabase
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:checklist
 *
 * Requires `SUPABASE_SERVICE_ROLE_KEY` (the service-role key, NOT the
 * publishable/anon key) so the script can bypass RLS.
 *
 * Strategy:
 *   1. Upsert all parent rows in `checklist_items` (idempotent on `id`).
 *   2. For every child table, delete-and-reinsert rows for the seeded items.
 *      This is simpler than diffing and the data set is small.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import steps from "@/lib/data/steps.json";
import type { ChecklistItemJson, ChecklistStepSummaryJson } from "@/types";

const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
    console.error("Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL).");
    process.exit(1);
}
if (!serviceRoleKey) {
    console.error(
        "Missing SUPABASE_SERVICE_ROLE_KEY. This script writes past RLS — you need the service role key, not the publishable key.",
    );
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
});

const nullable = (value: string): string | null => {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
};

function normalizeStepSummary(entry: ChecklistStepSummaryJson): {
    summary: string;
    description: string | null;
} {
    if (typeof entry === "string") {
        return { summary: entry, description: null };
    }
    return {
        summary: entry.summary,
        description: nullable(entry.description ?? ""),
    };
}

async function replaceChildren<Row extends Record<string, unknown>>(
    client: SupabaseClient,
    table: string,
    itemIds: string[],
    rows: Row[],
): Promise<void> {
    if (itemIds.length === 0) return;

    const del = await client.from(table).delete().in("checklist_item_id", itemIds);
    if (del.error) {
        console.error(`✗ ${table}: failed to clear:`, del.error.message);
        process.exit(1);
    }

    if (rows.length === 0) {
        console.log(`✓ ${table}: cleared (no rows to insert)`);
        return;
    }

    // supabase-js `.insert()` types require a `Database` generic to type-check
    // payloads precisely; cast at the boundary to keep call sites strict.
    const ins = await client.from(table).insert(rows as never).select();
    if (ins.error) {
        console.error(`✗ ${table}: failed to insert:`, ins.error.message);
        process.exit(1);
    }
    console.log(`✓ ${table}: inserted ${ins.data?.length ?? 0} rows`);
}

async function main(): Promise<void> {
    const items = (steps as ChecklistItemJson[]).filter(
        (s) => typeof s.id === "string" && s.id.length > 0,
    );

    if (items.length === 0) {
        console.log("Nothing to seed (no items with non-empty id).");
        return;
    }

    console.log(`Seeding ${items.length} checklist item(s) into ${supabaseUrl}…`);

    // --- Phase 1: parent rows ---------------------------------------------
    const parents = items.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        short_description: s.short_description,
        category: s.category,
        estimated_time: nullable(s.estimated_time),
        difficulty: s.difficulty,
        priority: s.priority,
        is_required: s.is_required,
        applies_to_student_groups: s.applies_to.student_groups,
        applies_to_visa_types: s.applies_to.visa_types,
        deadline: nullable(s.deadline),
        last_verified_at: nullable(s.last_verified_at),
        status: s.status,
        order_index: s.order_index,
        common_options: s.common_options,
        recommended_timing: nullable(s.recommended_timing),
        why_this_matters: nullable(s.why_this_matters),
    }));

    const upsert = await supabase
        .from("checklist_items")
        .upsert(parents as never, { onConflict: "id" })
        .select("id");
    if (upsert.error) {
        console.error("✗ checklist_items: upsert failed:", upsert.error.message);
        process.exit(1);
    }
    console.log(`✓ checklist_items: upserted ${upsert.data?.length ?? 0} rows`);

    const itemIds = items.map((s) => s.id);

    // --- Phase 2: requirements --------------------------------------------
    await replaceChildren(
        supabase,
        "checklist_item_requirements",
        itemIds,
        items.flatMap((s) =>
            s.requirements
                .filter((r) => r.name.trim() !== "")
                .map((r, i) => ({
                    checklist_item_id: s.id,
                    name: r.name,
                    required: r.required,
                    sort_order: i,
                })),
        ),
    );

    // --- Phase 3: steps_summary -------------------------------------------
    await replaceChildren(
        supabase,
        "checklist_item_steps_summary",
        itemIds,
        items.flatMap((s) =>
            s.steps_summary
                .map(normalizeStepSummary)
                .filter((line) => line.summary.trim() !== "")
                .map((line, i) => ({
                    checklist_item_id: s.id,
                    summary: line.summary,
                    description: line.description,
                    sort_order: i,
                })),
        ),
    );

    // --- Phase 4: warnings -------------------------------------------------
    await replaceChildren(
        supabase,
        "checklist_item_warnings",
        itemIds,
        items.flatMap((s) =>
            s.warnings
                .filter((w) => w.trim() !== "")
                .map((warning, i) => ({
                    checklist_item_id: s.id,
                    warning,
                    sort_order: i,
                })),
        ),
    );

    // --- Phase 5: official_links ------------------------------------------
    await replaceChildren(
        supabase,
        "checklist_item_links",
        itemIds,
        items.flatMap((s) =>
            s.official_links
                .filter((l) => l.label.trim() !== "" || l.url.trim() !== "")
                .map((link, i) => ({
                    checklist_item_id: s.id,
                    label: link.label,
                    url: link.url,
                    sort_order: i,
                })),
        ),
    );

    // --- Phase 6: dependencies (last — needs all parents inserted) --------
    await replaceChildren(
        supabase,
        "checklist_item_dependencies",
        itemIds,
        items.flatMap((s) =>
            s.depends_on
                .filter((dep) => dep.trim() !== "")
                .map((dep, i) => ({
                    checklist_item_id: s.id,
                    depends_on_id: dep,
                    sort_order: i,
                })),
        ),
    );

    console.log("✓ done.");
}

main().catch((err: unknown) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
