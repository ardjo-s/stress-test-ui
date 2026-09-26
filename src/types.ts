export const SCENARIO_KINDS = ["members", "form", "table", "inbox"] as const;
export type ScenarioKind = (typeof SCENARIO_KINDS)[number];

export const DATA_MODES = ["demo", "worst"] as const;
export type DataMode = (typeof DATA_MODES)[number];

export const INTENSITIES = ["calm", "chaos", "catastrophe"] as const;
export type Intensity = (typeof INTENSITIES)[number];

export const STRESS_VECTORS = [
  "long-names",
  "unusual-emails",
  "edge-labels",
  "emoji",
  "rtl",
  "cjk",
  "massive-lists",
  "tiny-values",
  "unbroken-strings",
] as const;
export type StressVector = (typeof STRESS_VECTORS)[number];

export type MemberStatus = "active" | "invited" | "expired";

export type Member = {
  id: string;
  initials: string;
  name: string;
  role: string;
  status: MemberStatus;
  statusLabel: string;
};

export type FormField = {
  id: string;
  label: string;
  value: string;
  hint?: string;
  error?: string;
  multiline?: boolean;
};

export type TableRow = {
  id: string;
  cells: string[];
};

export type InboxMessage = {
  id: string;
  from: string;
  initials: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  dir: "ltr" | "rtl";
};

export type StressPack = {
  kind: ScenarioKind;
  title: string;
  eyebrow: string;
  totalCount: number;
  visibleLabel: string;
  members: Member[];
  profileName: string;
  profileEmail: string;
  profileTitle: string;
  fields: FormField[];
  columns: string[];
  rows: TableRow[];
  messages: InboxMessage[];
  notes: string[];
  vectors: StressVector[];
};
