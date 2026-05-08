export type TagVariant = "time" | "cost" | "docs" | "urgent";
export type TipVariant = "tip" | "warn" | "urgent";
export type StatusVariant = "urgent" | "in-progress" | "not-started" | "complete";
export type VisaType = "student-d" | "student-vls-ts" | "student-vls-ts-campus-france" | "other";
export type StudyLevel = "licence-1" | "licence-2" | "licence-3" | "master-1" | "master-2" | "doctorat" | "exchange" | "other";

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
  nationality: string;
  dateOfBirth: string;
  /* Academic */
  university: string;
  program: string;
  studyLevel: StudyLevel | "";
  studentId: string;
  campusCity: string;
  academicYear: string;           // e.g. "2024-2025"
  /* Stay in France */
  arrivalDate: string;
  plannedDepartureDate: string;
  visaType: VisaType | "";
  currentAddress: string;
  addressCity: string;
  addressPostalCode: string;
  /* Emergency */
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  nationality: "",
  dateOfBirth: "",
  university: "",
  program: "",
  studyLevel: "",
  studentId: "",
  campusCity: "",
  academicYear: "",
  arrivalDate: "",
  plannedDepartureDate: "",
  visaType: "",
  currentAddress: "",
  addressCity: "",
  addressPostalCode: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",
};

export interface ProgressState {
  completedSteps: Record<string, boolean>;
  checkedDocs: Record<string, boolean>;
}
