export type TagVariant = "time" | "cost" | "docs" | "urgent";
export type TipVariant = "tip" | "warn" | "urgent";
export type StatusVariant = "urgent" | "in-progress" | "not-started" | "complete";

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
  name: string;
  university: string;
  program: string;
  arrivalDate: string;
}

export interface ProgressState {
  completedSteps: Record<string, boolean>;   // `${processId}_${stepId}`
  checkedDocs: Record<string, boolean>;       // `doc_${processId}_${stepId}_${index}`
}
