import type { Intensity, ScenarioKind, StressVector } from "../types.ts";

export type ParsedPrompt = {
  kind: ScenarioKind;
  intensity: Intensity;
  vectors: StressVector[];
};

const KIND_HINTS: Record<ScenarioKind, string[]> = {
  members: [
    "member",
    "team",
    "people",
    "roster",
    "user list",
    "users",
    "invite",
    "avatar",
  ],
  form: [
    "form",
    "signup",
    "sign up",
    "register",
    "profile",
    "settings",
    "onboarding",
    "checkout",
    "input",
  ],
  table: [
    "table",
    "grid",
    "spreadsheet",
    "invoice",
    "billing",
    "dashboard",
    "column",
    "rows",
  ],
  inbox: [
    "inbox",
    "chat",
    "comment",
    "message",
    "thread",
    "support",
    "ticket",
    "email list",
  ],
};

const VECTOR_HINTS: Record<StressVector, string[]> = {
  "long-names": ["long name", "names", "hyphen", "compound"],
  "unusual-emails": ["email", "plus alias", "unusual"],
  "edge-labels": ["label", "badge", "status", "pill"],
  emoji: ["emoji", "unicode", "🎉", "unicorn"],
  rtl: ["rtl", "arabic", "hebrew", "arabic", "rtl"],
  cjk: ["cjk", "chinese", "japanese", "korean", "kanji"],
  "massive-lists": ["many", "lots", "thousand", "huge", "list", "massive"],
  "tiny-values": ["empty", "tiny", "short", "one letter"],
  "unbroken-strings": ["nowrap", "unbroken", "overflow", "ellipsis"],
};

function scoreHints(text: string, hints: string[]): number {
  return hints.reduce((score, hint) => (text.includes(hint) ? score + 1 : score), 0);
}

export function parsePrompt(
  prompt: string,
  fallback: ScenarioKind = "members",
): ParsedPrompt {
  const text = prompt.trim().toLowerCase();
  if (!text) {
    return { kind: fallback, intensity: "chaos", vectors: [] };
  }

  let kind: ScenarioKind = fallback;
  let best = 0;
  for (const candidate of ["members", "form", "table", "inbox"] as const) {
    const score = scoreHints(text, KIND_HINTS[candidate]);
    if (score > best) {
      best = score;
      kind = candidate;
    }
  }

  const vectors = (Object.keys(VECTOR_HINTS) as StressVector[]).filter(
    (vector) => scoreHints(text, VECTOR_HINTS[vector]) > 0,
  );

  const intensity: Intensity = /catastroph|nuclear|destroy|insane|max/.test(text)
    ? "catastrophe"
    : /calm|mild|gentle|light/.test(text)
      ? "calm"
      : "chaos";

  return { kind, intensity, vectors };
}
