export type ChecklistDifficulty = "easy" | "medium" | "hard";
export type ChecklistPriority = "low" | "medium" | "high";

export interface ChecklistOfficialLink {
  label: string;
  url: string;
}

export interface ChecklistItemAppliesToRow {
  non_eu_students: boolean;
  eu_students: boolean;
}

export interface ChecklistItemAppliesTo {
  nonEuStudents: boolean;
  euStudents: boolean;
}

/** Snake_case shape used in `lib/data/steps.json` and seed scripts. */
export interface ChecklistItemJson {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  category: string;
  order_index: number;
  requirements: string[];
  common_options: string[];
  recommended_timing: string;
  estimated_time: string;
  difficulty: ChecklistDifficulty;
  priority: ChecklistPriority;
  is_required: boolean;
  applies_to: ChecklistItemAppliesToRow;
  deadline: string;
  official_links: ChecklistOfficialLink[];
}

/** One row in `public.checklist_items` (snake_case, matches Supabase columns). */
export interface ChecklistItemRow {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  category: string;
  order_index: number;
  common_options: string[];
  recommended_timing: string | null;
  estimated_time: string | null;
  difficulty: ChecklistDifficulty;
  priority: ChecklistPriority;
  is_required: boolean;
  applies_to_non_eu_students: boolean;
  applies_to_eu_students: boolean;
  deadline: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ChecklistItemRequirementRow {
  id: string;
  checklist_item_id: string;
  requirement: string;
  sort_order: number;
}

export interface ChecklistItemLinkRow {
  id: string;
  checklist_item_id: string;
  label: string;
  url: string;
  sort_order: number;
}

/** Checklist item with nested requirements and links (app shape). */
export interface ChecklistItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  orderIndex: number;
  requirements: string[];
  commonOptions: string[];
  recommendedTiming: string | null;
  estimatedTime: string | null;
  difficulty: ChecklistDifficulty;
  priority: ChecklistPriority;
  isRequired: boolean;
  appliesTo: ChecklistItemAppliesTo;
  deadline: string | null;
  officialLinks: ChecklistOfficialLink[];
}

/** Result of loading a checklist item with child rows from Supabase. */
export interface ChecklistItemWithRelations {
  item: ChecklistItemRow;
  requirements: ChecklistItemRequirementRow[];
  links: ChecklistItemLinkRow[];
}
