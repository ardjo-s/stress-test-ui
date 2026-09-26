import type { Intensity, ScenarioKind } from "../types.ts";

export type ScenarioMeta = {
  kind: ScenarioKind;
  label: string;
  prompt: string;
  blurb: string;
};

export const SCENARIOS: ScenarioMeta[] = [
  {
    kind: "members",
    label: "Members list",
    prompt: "A team members list with avatars, roles, and status pills.",
    blurb: "The Emil special — names, emails, and labels that refuse to fit.",
  },
  {
    kind: "form",
    label: "Profile form",
    prompt: "A profile settings form with long labels, emails, and a bio.",
    blurb: "Fields, hints, and a hero name that eat the layout.",
  },
  {
    kind: "table",
    label: "Billing table",
    prompt: "A billing table with invoices, emails, plans, and notes.",
    blurb: "Columns collide. Notes never wrap when you need them to.",
  },
  {
    kind: "inbox",
    label: "Support inbox",
    prompt: "A support inbox with subjects, RTL names, and emoji-only replies.",
    blurb: "Subjects, senders, and unread counts go feral.",
  },
];

export const INTENSITY_COPY: Record<
  Intensity,
  { label: string; detail: string }
> = {
  calm: {
    label: "Calm",
    detail: "A few long names. Still polite.",
  },
  chaos: {
    label: "Chaos",
    detail: "Emil-level worst case.",
  },
  catastrophe: {
    label: "Catastrophe",
    detail: "RTL, emoji, CJK, unbroken strings.",
  },
};
