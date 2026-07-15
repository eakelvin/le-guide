/**
 * Dump checklist content from Supabase into the seed JSON files.
 * Inverse of `scripts/seed-checklist.ts`.
 *
 * Usage:
 *   npm run dump:checklist
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run dump:checklist
 *
 * Overwrites:
 *   - lib/data/steps.json     ← locale `en`
 *   - lib/data/steps.fr.json  ← locale `fr`
 *
 * Requires `SUPABASE_SERVICE_ROLE_KEY` (service role, not anon key).
 *
 * Fetches parents and children in separate queries (avoids PostgREST embedding
 * ambiguity when checklist_item_dependencies has two FKs to checklist_items).
 */

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type {
  ChecklistCategory,
  ChecklistDifficulty,
  ChecklistItemJson,
  ChecklistOfficialLink,
  ChecklistPriority,
  ChecklistRequirementJson,
  ChecklistStatus,
  ChecklistStepSummaryJson,
  StudentGroup,
  VisaType,
} from "@/types";

type SeedLocale = "en" | "fr";

const LOCALES: { locale: SeedLocale; relativePath: string }[] = [
  { locale: "en", relativePath: "lib/data/steps.json" },
  { locale: "fr", relativePath: "lib/data/steps.fr.json" },
];

type Sorted = { sort_order: number };

type ParentRow = {
  id: string;
  slug: string;
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
};

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error("Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL).");
  process.exit(1);
}
if (!serviceRoleKey) {
  console.error(
    "Missing SUPABASE_SERVICE_ROLE_KEY. This script reads past RLS — you need the service role key, not the publishable key.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function sortByOrder<T extends Sorted>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.sort_order - b.sort_order);
}

function stringOrEmpty(value: string | null | undefined): string {
  return value ?? "";
}

function toStepSummary(entry: {
  summary: string;
  description: string | null;
}): ChecklistStepSummaryJson {
  const description = entry.description?.trim() ?? "";
  if (!description) return entry.summary;
  return { summary: entry.summary, description };
}

function groupByItemId<T extends { checklist_item_id: string }>(
  rows: T[],
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    const list = map.get(row.checklist_item_id);
    if (list) list.push(row);
    else map.set(row.checklist_item_id, [row]);
  }
  return map;
}

async function fetchChildRows<T>(
  table: string,
  locale: SeedLocale,
  itemIds: string[],
  columns: string,
): Promise<T[]> {
  if (itemIds.length === 0) return [];

  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .eq("locale", locale)
    .in("checklist_item_id", itemIds);

  if (error) {
    console.error(`✗ ${table} [${locale}]: fetch failed:`, error.message);
    process.exit(1);
  }

  return (data ?? []) as T[];
}

async function dumpLocale(locale: SeedLocale): Promise<ChecklistItemJson[]> {
  const { data: parents, error } = await supabase
    .from("checklist_items")
    .select(
      `
      id, slug, title, short_description, category, order_index,
      estimated_time, difficulty, priority, is_required,
      applies_to_student_groups, applies_to_visa_types,
      deadline, last_verified_at, status,
      why_this_matters, recommended_timing, common_options
    `,
    )
    .eq("locale", locale)
    .order("order_index", { ascending: true });

  if (error) {
    console.error(`✗ checklist_items [${locale}]: fetch failed:`, error.message);
    process.exit(1);
  }

  const items = (parents ?? []) as ParentRow[];
  const itemIds = items.map((item) => item.id);

  const [requirements, steps, warnings, links, dependencies] = await Promise.all([
    fetchChildRows<{
      checklist_item_id: string;
      name: string;
      required: boolean;
      sort_order: number;
    }>("checklist_item_requirements", locale, itemIds, "checklist_item_id, name, required, sort_order"),
    fetchChildRows<{
      checklist_item_id: string;
      summary: string;
      description: string | null;
      sort_order: number;
    }>(
      "checklist_item_steps_summary",
      locale,
      itemIds,
      "checklist_item_id, summary, description, sort_order",
    ),
    fetchChildRows<{
      checklist_item_id: string;
      warning: string;
      sort_order: number;
    }>("checklist_item_warnings", locale, itemIds, "checklist_item_id, warning, sort_order"),
    fetchChildRows<{
      checklist_item_id: string;
      label: string;
      url: string;
      sort_order: number;
    }>("checklist_item_links", locale, itemIds, "checklist_item_id, label, url, sort_order"),
    fetchChildRows<{
      checklist_item_id: string;
      depends_on_id: string;
      sort_order: number;
    }>(
      "checklist_item_dependencies",
      locale,
      itemIds,
      "checklist_item_id, depends_on_id, sort_order",
    ),
  ]);

  const requirementsById = groupByItemId(requirements);
  const stepsById = groupByItemId(steps);
  const warningsById = groupByItemId(warnings);
  const linksById = groupByItemId(links);
  const depsById = groupByItemId(dependencies);

  return items.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    short_description: item.short_description,
    category: item.category,
    order_index: item.order_index,
    estimated_time: stringOrEmpty(item.estimated_time),
    difficulty: item.difficulty,
    priority: item.priority,
    is_required: item.is_required,
    recommended_timing: stringOrEmpty(item.recommended_timing),
    why_this_matters: stringOrEmpty(item.why_this_matters),
    deadline: stringOrEmpty(item.deadline),
    last_verified_at: stringOrEmpty(item.last_verified_at),
    status: item.status,
    depends_on: sortByOrder(depsById.get(item.id) ?? []).map((d) => d.depends_on_id),
    requirements: sortByOrder(requirementsById.get(item.id) ?? []).map<ChecklistRequirementJson>(
      (r) => ({
        name: r.name,
        required: r.required,
      }),
    ),
    common_options: item.common_options ?? [],
    steps_summary: sortByOrder(stepsById.get(item.id) ?? []).map(toStepSummary),
    warnings: sortByOrder(warningsById.get(item.id) ?? []).map((w) => w.warning),
    applies_to: {
      student_groups: item.applies_to_student_groups ?? [],
      visa_types: item.applies_to_visa_types ?? [],
    },
    official_links: sortByOrder(linksById.get(item.id) ?? []).map<ChecklistOfficialLink>((l) => ({
      label: l.label,
      url: l.url,
    })),
  }));
}

async function writeJson(relativePath: string, items: ChecklistItemJson[]): Promise<void> {
  const absolutePath = path.join(process.cwd(), relativePath);
  const body = `${JSON.stringify(items, null, 4)}\n`;
  await writeFile(absolutePath, body, "utf8");
  console.log(`✓ wrote ${items.length} item(s) → ${relativePath}`);
}

async function main(): Promise<void> {
  console.log(`Dumping checklist content from ${supabaseUrl}…\n`);

  for (const { locale, relativePath } of LOCALES) {
    const items = await dumpLocale(locale);
    if (items.length === 0) {
      console.warn(
        `⚠ locale "${locale}": no rows in DB — leaving ${relativePath} unchanged (not overwriting with []).`,
      );
      continue;
    }
    await writeJson(relativePath, items);
  }

  console.log("\n✓ done.");
}

main().catch((err: unknown) => {
  console.error("Dump failed:", err);
  process.exit(1);
});
