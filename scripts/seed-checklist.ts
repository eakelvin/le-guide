/**
 * Seed checklist content into Supabase for each supported locale.
 *
 * Usage:
 *   npm run seed:checklist
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:checklist
 *
 * Sources (edit these files, then re-run seed to update Supabase):
 *   - lib/data/steps.json     → locale `en`
 *   - lib/data/steps.fr.json  → locale `fr`
 *
 * Inverse (DB → JSON): `npm run dump:checklist` (`scripts/dump-checklist.ts`).
 *
 * Requires `SUPABASE_SERVICE_ROLE_KEY` (service role, not anon key).
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import stepsEn from "@/lib/data/steps.json";
import stepsFr from "@/lib/data/steps.fr.json";
import type { ChecklistItemJson, ChecklistStepSummaryJson } from "@/types";

type SeedLocale = "en" | "fr";

const LOCALES: { locale: SeedLocale; file: ChecklistItemJson[] }[] = [
  { locale: "en", file: stepsEn as ChecklistItemJson[] },
  { locale: "fr", file: stepsFr as ChecklistItemJson[] },
];

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
  locale: SeedLocale,
  itemIds: string[],
  rows: Row[],
): Promise<void> {
  if (itemIds.length === 0) return;

  const del = await client
    .from(table)
    .delete()
    .eq("locale", locale)
    .in("checklist_item_id", itemIds);
  if (del.error) {
    console.error(`✗ ${table} [${locale}]: failed to clear:`, del.error.message);
    process.exit(1);
  }

  if (rows.length === 0) {
    console.log(`✓ ${table} [${locale}]: cleared (no rows to insert)`);
    return;
  }

  const ins = await client.from(table).insert(rows as never).select();
  if (ins.error) {
    console.error(`✗ ${table} [${locale}]: failed to insert:`, ins.error.message);
    process.exit(1);
  }
  console.log(`✓ ${table} [${locale}]: inserted ${ins.data?.length ?? 0} rows`);
}

async function seedLocale(locale: SeedLocale, items: ChecklistItemJson[]): Promise<void> {
  const valid = items.filter((s) => typeof s.id === "string" && s.id.length > 0);

  if (valid.length === 0) {
    console.log(`Nothing to seed for locale "${locale}".`);
    return;
  }

  console.log(`\n── locale: ${locale} (${valid.length} item(s)) ──`);

  const parents = valid.map((s) => ({
    id: s.id,
    locale,
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
    .upsert(parents as never, { onConflict: "id,locale" })
    .select("id");
  if (upsert.error) {
    console.error(`✗ checklist_items [${locale}]: upsert failed:`, upsert.error.message);
    process.exit(1);
  }
  console.log(`✓ checklist_items [${locale}]: upserted ${upsert.data?.length ?? 0} rows`);

  const itemIds = valid.map((s) => s.id);

  await replaceChildren(
    supabase,
    "checklist_item_requirements",
    locale,
    itemIds,
    valid.flatMap((s) =>
      s.requirements
        .filter((r) => r.name.trim() !== "")
        .map((r, i) => ({
          checklist_item_id: s.id,
          locale,
          name: r.name,
          required: r.required,
          sort_order: i,
        })),
    ),
  );

  await replaceChildren(
    supabase,
    "checklist_item_steps_summary",
    locale,
    itemIds,
    valid.flatMap((s) =>
      s.steps_summary
        .map(normalizeStepSummary)
        .filter((line) => line.summary.trim() !== "")
        .map((line, i) => ({
          checklist_item_id: s.id,
          locale,
          summary: line.summary,
          description: line.description,
          sort_order: i,
        })),
    ),
  );

  await replaceChildren(
    supabase,
    "checklist_item_warnings",
    locale,
    itemIds,
    valid.flatMap((s) =>
      s.warnings
        .filter((w) => w.trim() !== "")
        .map((warning, i) => ({
          checklist_item_id: s.id,
          locale,
          warning,
          sort_order: i,
        })),
    ),
  );

  await replaceChildren(
    supabase,
    "checklist_item_links",
    locale,
    itemIds,
    valid.flatMap((s) =>
      s.official_links
        .filter((l) => l.label.trim() !== "" || l.url.trim() !== "")
        .map((link, i) => ({
          checklist_item_id: s.id,
          locale,
          label: link.label,
          url: link.url,
          sort_order: i,
        })),
    ),
  );

  await replaceChildren(
    supabase,
    "checklist_item_dependencies",
    locale,
    itemIds,
    valid.flatMap((s) =>
      s.depends_on
        .filter((dep) => dep.trim() !== "")
        .map((dep, i) => ({
          checklist_item_id: s.id,
          locale,
          depends_on_id: dep,
          sort_order: i,
        })),
    ),
  );
}

async function main(): Promise<void> {
  console.log(`Seeding checklist content into ${supabaseUrl}…`);

  for (const { locale, file } of LOCALES) {
    await seedLocale(locale, file);
  }

  console.log("\n✓ done.");
}

main().catch((err: unknown) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
