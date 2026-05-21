export type ChecklistDifficulty = "easy" | "medium" | "hard";
export type ChecklistPriority = "low" | "medium" | "high";

export type StudentGroup = "eu_students" | "non_eu_students";
export type VisaType = "long_stay" | "short_stay" | "none";

export interface ChecklistOfficialLink {
  label: string;
  url: string;
}

export interface ChecklistRequirementJson {
  name: string;
  required: boolean;
}

export interface ChecklistRequirement {
  name: string;
  required: boolean;
}

export interface ChecklistItemAppliesToJson {
  student_groups: StudentGroup[];
  visa_types: VisaType[];
}

export interface ChecklistItemAppliesTo {
  studentGroups: StudentGroup[];
  visaTypes: VisaType[];
}

/** Snake_case shape used in `lib/data/steps.json` and seed scripts. */
export interface ChecklistItemJson {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  category: string;
  order_index: number;
  estimated_time: string;
  difficulty: ChecklistDifficulty;
  priority: ChecklistPriority;
  is_required: boolean;
  recommended_timing: string;
  why_this_matters: string;
  what_happens_if_you_dont_complete?: string;
  deadline: string;
  last_verified_at: string;
  requirements: ChecklistRequirementJson[];
  common_options: string[];
  steps_summary: string[];
  warnings: string[];
  applies_to: ChecklistItemAppliesToJson;
  depends_on: string[];
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
  applies_to_student_groups: StudentGroup[];
  applies_to_visa_types: VisaType[];
  deadline: string | null;
  last_verified_at: string | null;
  why_this_matters: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ChecklistItemRequirementRow {
  id: string;
  checklist_item_id: string;
  name: string;
  required: boolean;
  sort_order: number;
}

export interface ChecklistItemStepsSummaryRow {
  id: string;
  checklist_item_id: string;
  summary: string;
  sort_order: number;
}

export interface ChecklistItemWarningRow {
  id: string;
  checklist_item_id: string;
  warning: string;
  sort_order: number;
}

export interface ChecklistItemLinkRow {
  id: string;
  checklist_item_id: string;
  label: string;
  url: string;
  sort_order: number;
}

export interface ChecklistItemDependencyRow {
  checklist_item_id: string;
  depends_on_id: string;
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
  estimatedTime: string | null;
  difficulty: ChecklistDifficulty;
  priority: ChecklistPriority;
  isRequired: boolean;
  recommendedTiming: string | null;
  whyThisMatters: string | null;
  deadline: string | null;
  lastVerifiedAt: string | null;
  requirements: ChecklistRequirement[];
  commonOptions: string[];
  stepsSummary: string[];
  warnings: string[];
  appliesTo: ChecklistItemAppliesTo;
  dependsOn: string[];
  officialLinks: ChecklistOfficialLink[];
}

/** Result of loading a checklist item with child rows from Supabase. */
export interface ChecklistItemWithRelations {
  item: ChecklistItemRow;
  requirements: ChecklistItemRequirementRow[];
  stepsSummary: ChecklistItemStepsSummaryRow[];
  warnings: ChecklistItemWarningRow[];
  links: ChecklistItemLinkRow[];
  dependencies: ChecklistItemDependencyRow[];
}
