import type { AppUser } from "@/lib/supabase/user";

export type TagVariant = "time" | "cost" | "docs" | "urgent";
export type TipVariant = "tip" | "warn" | "urgent";
export type StatusVariant = "urgent" | "in-progress" | "not-started" | "complete";

/** Yes / no answers for profile questions (empty = not answered). */
export type ProfileYesNo = "" | "yes" | "no";

export const STUDENT_TYPE_VALUES = ["degree-student", "exchange-student", "intern", "language-school"] as const;
export type StudentType = (typeof STUDENT_TYPE_VALUES)[number];

export const STUDENT_TYPE_OPTIONS: { value: StudentType; label: string }[] = [
    { value: "degree-student", label: "Degree student" },
    { value: "exchange-student", label: "Exchange student" },
    { value: "intern", label: "Intern" },
    { value: "language-school", label: "Language school" },
];

export interface Tag {
  variant: TagVariant;
  text: string;
}

export interface Tip {
  variant: TipVariant;
  message: string;
}

export interface ResourceLink {
  url: string;
  label: string;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  tags?: Tag[];
  tip?: Tip;
  documents?: string[];
  link?: ResourceLink;
  defaultDone?: boolean;
}

export interface Process {
  id: string;
  title: string;
  subtitle: string;
  colorKey: "coral" | "forest" | "azure" | "violet" | "gold";
  steps: Step[];
}

export interface UserProfile {
  /* Personal */
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  dateOfBirth: string;
  /* Academic */
  university: string;
  program: string;
  studentType: StudentType | "";
  campusCity: string;
  academicYear: string;           // e.g. "2024-2025"
  /* Stay in France */
  alreadyInFrance: ProfileYesNo;
  /** When `alreadyInFrance` is "yes": actual arrival. When "no": planned arrival. */
  arrivalDate: string;
  addressCity: string;
  hasAccommodation: ProfileYesNo;
}

/** One row in `public.profiles` (snake_case, matches Supabase columns). */
export interface ProfileRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  date_of_birth: string;
  university: string;
  program: string;
  student_type: string;
  campus_city: string;
  academic_year: string;
  already_in_france: string;
  has_accommodation: string;
  arrival_date: string;
  address_city: string;
  created_at?: string;
  updated_at?: string;
}

/** Form handlers for profile sections (personal / academic / stay). */
export type ProfileFieldKey = keyof UserProfile;
export type ProfileOnChange = (key: ProfileFieldKey, value: string) => void;

export interface ProfileSectionProps {
  draft: UserProfile;
  onChange: ProfileOnChange;
}

/** Result of persisting a profile row (server action or Supabase upsert). */
export type ProfileUpsertResult = { error?: string };

export interface ProfilePageProps {
  appUser: AppUser;
  initialProfile?: UserProfile | null;
}

export const DEFAULT_PROFILE: UserProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  dateOfBirth: "",
  university: "",
  program: "",
  studentType: "",
  campusCity: "",
  academicYear: "",
  alreadyInFrance: "",
  arrivalDate: "",
  addressCity: "",
  hasAccommodation: "",
};

export interface ProgressState {
  completedSteps: Record<string, boolean>;
  checkedDocs: Record<string, boolean>;
}

export type {
  ChecklistDifficulty,
  ChecklistPriority,
  ChecklistCategory,
  ChecklistStatus,
  StudentGroup,
  VisaType,
  ChecklistOfficialLink,
  ChecklistRequirement,
  ChecklistRequirementJson,
  ChecklistItemAppliesToJson,
  ChecklistItemAppliesTo,
  ChecklistItemJson,
  ChecklistItemRow,
  ChecklistItemRequirementRow,
  ChecklistItemStepsSummaryRow,
  ChecklistItemWarningRow,
  ChecklistItemLinkRow,
  ChecklistItemDependencyRow,
  ChecklistItem,
  ChecklistItemWithRelations,
} from "@/types/checklist";
