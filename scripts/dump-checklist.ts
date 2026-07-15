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

const SELECT = `
  id, slug, title, short_description, category, order_index,
  estimated_time, difficulty, priority, is_required,
  applies_to_student_groups, applies_to_visa_types,
  deadline, last_verified_at, status,
  why_this_matters, recommended_timing, common_options,
  requirements:checklist_item_requirements(name, required, sort_order),
  steps_summary:checklist_item_steps_summary(summary, description, sort_order),
  warnings:checklist_item_warnings(warning, sort_order),
  links:checklist_item_links(label, url, sort_order),
  dependencies:checklist_item_dependencies!checklist_item_id(depends_on_id, sort_order)
`;

type RawChild<T> = T & { sort_order: number };

type RawRow = {
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
  requirements: RawChild<{ name: string; required: boolean }>[];
  steps_summary: RawChild<{ summary: string; description: string | null }>[];
  warnings: RawChild<{ warning: string }>[];
  links: RawChild<{ label: string; url: string }>[];
  dependencies: RawChild<{ depends_on_id: string }>[];
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

function sortByOrder<T extends { sort_order: number }>(rows: T[] | null | undefined): T[] {
  return [...(rows ?? [])].sort((a, b) => a.sort_order - b.sort_order);
}

/** Match seed input: DB nulls become empty strings in JSON. */
function stringOrEmpty(value: string | null | undefined): string {
  return value ?? "";
}

function toStepSummary(
  entry: RawChild<{ summary: string; description: string | null }>,
): ChecklistStepSummaryJson {
  const description = entry.description?.trim() ?? "";
  if (!description) return entry.summary;
  return { summary: entry.summary, description };
}

function toJsonItem(row: RawRow): ChecklistItemJson {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    short_description: row.short_description,
    category: row.category,
    order_index: row.order_index,
    estimated_time: stringOrEmpty(row.estimated_time),
    difficulty: row.difficulty,
    priority: row.priority,
    is_required: row.is_required,
    recommended_timing: stringOrEmpty(row.recommended_timing),
    why_this_matters: stringOrEmpty(row.why_this_matters),
    deadline: stringOrEmpty(row.deadline),
    last_verified_at: stringOrEmpty(row.last_verified_at),
    status: row.status,
    depends_on: sortByOrder(row.dependencies).map((d) => d.depends_on_id),
    requirements: sortByOrder(row.requirements).map<ChecklistRequirementJson>((r) => ({
      name: r.name,
      required: r.required,
    })),
    common_options: row.common_options ?? [],
    steps_summary: sortByOrder(row.steps_summary).map(toStepSummary),
    warnings: sortByOrder(row.warnings).map((w) => w.warning),
    applies_to: {
      student_groups: row.applies_to_student_groups ?? [],
      visa_types: row.applies_to_visa_types ?? [],
    },
    official_links: sortByOrder(row.links).map<ChecklistOfficialLink>((l) => ({
      label: l.label,
      url: l.url,
    })),
  };
}

async function dumpLocale(locale: SeedLocale): Promise<ChecklistItemJson[]> {
  const { data, error } = await supabase
    .from("checklist_items")
    .select(SELECT)
    .eq("locale", locale)
    .order("order_index", { ascending: true });

  if (error) {
    console.error(`✗ checklist_items [${locale}]: fetch failed:`, error.message);
    process.exit(1);
  }

  const rows = (data ?? []) as unknown as RawRow[];
  return rows.map(toJsonItem);
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
      console.warn(`⚠ locale "${locale}": no rows found — writing empty array.`);
    }
    await writeJson(relativePath, items);
  }

  console.log("\n✓ done.");
}

main().catch((err: unknown) => {
  console.error("Dump failed:", err);
  process.exit(1);
});
