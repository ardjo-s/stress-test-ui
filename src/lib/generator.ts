import type {
  FormField,
  InboxMessage,
  Intensity,
  Member,
  ScenarioKind,
  StressPack,
  StressVector,
  TableRow,
} from "../types.ts";
import { createRng, pick, shuffle } from "./rng.ts";

const DEMO_MEMBERS: Member[] = [
  { id: "sc", initials: "SC", name: "Sarah Chen", role: "Design", status: "active", statusLabel: "Active" },
  { id: "mr", initials: "MR", name: "Marco Ruiz", role: "Engineering", status: "active", statusLabel: "Active" },
  { id: "ao", initials: "AO", name: "Ada Owens", role: "Product", status: "active", statusLabel: "Active" },
  { id: "tw", initials: "TW", name: "Tom Weber", role: "Marketing", status: "invited", statusLabel: "Invited" },
  { id: "lp", initials: "LP", name: "Lena Park", role: "Design", status: "active", statusLabel: "Active" },
];

const WORST_CORE: Member[] = [
  {
    id: "aw",
    initials: "AW",
    name: "Aleksandra Wiśniewska-Kowalczyk",
    role: "Senior Product Design Engineer, Platform Infrastructure",
    status: "active",
    statusLabel: "Active",
  },
  {
    id: "bf",
    initials: "BF",
    name: "bartholomew.fitzgerald@northwind-industries-holdings.example.com",
    role: "Contractor",
    status: "invited",
    statusLabel: "Invited",
  },
  {
    id: "jo",
    initials: "J",
    name: "Jo",
    role: "—",
    status: "expired",
    statusLabel: "Invitation expired 12 days ago",
  },
  {
    id: "cm",
    initials: "CM",
    name: "Christopher Alexander Montgomery III",
    role: "Interim Vice President of Customer Experience Operations",
    status: "active",
    statusLabel: "Active",
  },
];

const WORST_EXTRA: Member[] = [
  {
    id: "mh",
    initials: "مح",
    name: "محمد بن عبدالله القرشي",
    role: "مهندس برمجيات رئيسي — المنصة",
    status: "active",
    statusLabel: "نشط",
  },
  {
    id: "ls",
    initials: "🦄",
    name: "Luna-Starlight ✨ von Supercalifragilistic",
    role: "Head of Vibes 🌈 & Internal Tooling",
    status: "invited",
    statusLabel: "Invited (pending legal name review)",
  },
  {
    id: "tw2",
    initials: "高S",
    name: "高橋·Alexander·Smith-渡辺",
    role: "国際化 / i18n / ローカライゼーション",
    status: "active",
    statusLabel: "Active",
  },
  {
    id: "nt",
    initials: "NT",
    name: "Nguyễn Thị Phương Thảo-Trần",
    role: "Staff Engineer — Data Platform Reliability",
    status: "active",
    statusLabel: "Active",
  },
  {
    id: "zz",
    initials: "ZZ",
    name: "ZzyzxWolfeischwarzhauptmannschaftsleiter",
    role: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    status: "invited",
    statusLabel: "Needs-reconfirmation-before-Q4-offsite",
  },
];

const DEMO_FIELDS: FormField[] = [
  { id: "first", label: "First name", value: "Maya" },
  { id: "last", label: "Last name", value: "Okada" },
  { id: "email", label: "Email", value: "maya@studio.test" },
  { id: "title", label: "Title", value: "Designer" },
  { id: "company", label: "Company", value: "Northwind" },
  {
    id: "bio",
    label: "Bio",
    value: "Designs tools people actually finish using.",
    multiline: true,
  },
];

function worstFields(): FormField[] {
  return [
    {
      id: "first",
      label: "Preferred professional legal given name(s) as printed on invoices",
      value: "Aleksandra-María",
      hint: "Must match the government ID you uploaded last Tuesday.",
    },
    {
      id: "last",
      label: "Family / compound / generational surname",
      value: "Wiśniewska-Kowalczyk de la Cruz Montgomery",
      error: "This exceeds the 24-character badge width we promised in the mock.",
    },
    {
      id: "email",
      label: "Work email we will never let you change",
      value:
        "bartholomew.fitzgerald+newsletter.qa.staging@northwind-industries-holdings.example.com",
    },
    {
      id: "title",
      label: "Role that must fit on a 120px sidebar chip",
      value: "Senior Product Design Engineer, Platform Infrastructure",
    },
    {
      id: "company",
      label: "Organization",
      value: "北風ホールディングス株式会社 / Northwind Industries Holdings LLC",
    },
    {
      id: "bio",
      label: "About",
      value:
        "مرحبا ✨ I write CSS that only works on the happy path and then ask a model to invent the rest. This bio is intentionally a paragraph that designers never put in the Figma file because it would ruin the card.",
      multiline: true,
      hint: "Markdown, emoji, RTL, and a thesis statement are all legal here.",
    },
  ];
}

const DEMO_COLUMNS = ["Invoice", "Customer", "Plan", "Amount", "Status"];
const WORST_COLUMNS = [
  "Invoice reference that accounting will search for",
  "Customer legal name / email",
  "Entitlement SKU",
  "Amount (incl. surprise VAT)",
  "Lifecycle label",
];

const DEMO_ROWS: TableRow[] = [
  { id: "1", cells: ["INV-1042", "Lumen Labs", "Team", "$240.00", "Paid"] },
  { id: "2", cells: ["INV-1043", "Harbor", "Pro", "$80.00", "Open"] },
  { id: "3", cells: ["INV-1044", "Kite", "Team", "$240.00", "Paid"] },
  { id: "4", cells: ["INV-1045", "Sable", "Free", "$0.00", "Void"] },
];

function worstRows(rng: () => number): TableRow[] {
  const extras: TableRow[] = [
    {
      id: "w1",
      cells: [
        "INV-2026-09-NORTHWIND-HOLDINGS-Q3-RESTATEMENT",
        "bartholomew.fitzgerald@northwind-industries-holdings.example.com",
        "Enterprise-Plus-Platform-Seat-EU-VAT-Reverse",
        "€12,480.00 + ₩900,000",
        "Past due · collection hold",
      ],
    },
    {
      id: "w2",
      cells: [
        "فاتورة-٩٩١",
        "شركة النور للتجارة الدولية ذ.م.م",
        "خطة الفريق",
        "١٢٬٣٠٠ ر.س",
        "قيد المراجعة القانونية",
      ],
    },
    {
      id: "w3",
      cells: [
        "🦄-TIP-JAR",
        "Luna-Starlight von Supercalifragilistic ✨",
        "Vibes Unlimited",
        "∞",
        "Paid in compliments",
      ],
    },
    {
      id: "w4",
      cells: ["J", "Jo", "—", "$0.01", "Invitation expired 12 days ago"],
    },
  ];

  const filler = Array.from({ length: 10 }, (_, index) => ({
    id: `f${index}`,
    cells: [
      `INV-${1000 + index}-${pick(rng, ["Å", "Ø", "Ł", "Ż"])}`,
      pick(rng, [
        "高橋·Alexander·Smith-渡辺",
        "Nguyễn Thị Phương Thảo-Trần",
        "ZzyzxWolfeischwarzhauptmannschaftsleiter",
      ]),
      pick(rng, [
        "Pro",
        "Team (legacy grandfathered SKU)",
        "Custom-contract-cannot-fit-badge",
      ]),
      pick(rng, ["$1,280.00", "¥980,000", "₦4,500,000.00"]),
      pick(rng, ["Paid", "Needs-reconfirmation-before-Q4-offsite", "Open"]),
    ],
  }));

  return [...extras, ...filler];
}

const DEMO_MESSAGES: InboxMessage[] = [
  {
    id: "m1",
    from: "Nora Blake",
    initials: "NB",
    subject: "Invite to the Friday review",
    preview: "Can we look at the settings page together?",
    time: "2h",
    unread: true,
    dir: "ltr",
  },
  {
    id: "m2",
    from: "Jules",
    initials: "J",
    subject: "Re: copy pass",
    preview: "The empty state still feels loud.",
    time: "5h",
    unread: false,
    dir: "ltr",
  },
  {
    id: "m3",
    from: "Kai Ito",
    initials: "KI",
    subject: "Tokens",
    preview: "Pushed the radius update.",
    time: "1d",
    unread: false,
    dir: "ltr",
  },
];

function worstMessages(rng: () => number): InboxMessage[] {
  return [
    {
      id: "w1",
      from: "Aleksandra Wiśniewska-Kowalczyk",
      initials: "AW",
      subject:
        "URGENT: please confirm the invitation that expired 12 days ago before the Q4 offsite legal review",
      preview:
        "The badge says Active but the email bounced from northwind-industries-holdings.example.com and finance is watching.",
      time: "now",
      unread: true,
      dir: "ltr",
    },
    {
      id: "w2",
      from: "نورة العتيبي",
      initials: "ن",
      subject: "طلب تحديث الاسم القانوني على الفاتورة والشارة الجانبية",
      preview: "الاسم لا يظهر بالكامل في قائمة الأعضاء، هل يمكن توسيع العمود؟",
      time: "4د",
      unread: true,
      dir: "rtl",
    },
    {
      id: "w3",
      from: "🦄",
      initials: "✨",
      subject: "🎉🎉🎉",
      preview: "👍👍👍👍👍👍👍👍👍👍👍👍",
      time: "✨",
      unread: true,
      dir: "ltr",
    },
    {
      id: "w4",
      from: "bartholomew.fitzgerald@northwind-industries-holdings.example.com",
      initials: "BF",
      subject: "Re: Re: Re: Re: FW: contractor access",
      preview:
        "My display name is my email and I will not be changing it. Also I have 1284 unread seats.",
      time: "12d",
      unread: false,
      dir: "ltr",
    },
    ...Array.from({ length: 6 }, (_, index) => ({
      id: `x${index}`,
      from: pick(rng, [
        "Jo",
        "高橋·Alexander·Smith-渡辺",
        "Christopher Alexander Montgomery III",
      ]),
      initials: pick(rng, ["J", "高", "CM"]),
      subject: pick(rng, [
        "—",
        "can you make the pill wider",
        "this label is longer than the viewport on purpose",
      ]),
      preview: "The row height just became a short story.",
      time: `${index + 2}h`,
      unread: rng() > 0.5,
      dir: "ltr" as const,
    })),
  ];
}

function totals(intensity: Intensity): { total: number; visible: string } {
  switch (intensity) {
    case "calm":
      return { total: 48, visible: "Showing 8 of 48" };
    case "chaos":
      return { total: 1284, visible: "Showing 40 of 1,284" };
    case "catastrophe":
      return { total: 10048, visible: "Showing 40 of 10,048" };
    default: {
      const _exhaustive: never = intensity;
      return _exhaustive;
    }
  }
}

function vectorsFor(kind: ScenarioKind, intensity: Intensity): StressVector[] {
  const base: StressVector[] = ["long-names", "edge-labels"];
  if (kind === "members" || kind === "form" || kind === "table") {
    base.push("unusual-emails");
  }
  if (intensity !== "calm") {
    base.push("massive-lists", "tiny-values");
  }
  if (intensity === "catastrophe") {
    base.push("emoji", "rtl", "cjk", "unbroken-strings");
  }
  return [...new Set(base)];
}

function notesFor(kind: ScenarioKind, intensity: Intensity): string[] {
  const shared = [
    "Long compound names wrap into the status column.",
    "An email used as a display name will not hyphenate.",
    "The shortest name still has to share a row with the longest pill.",
  ];

  switch (kind) {
    case "members":
      return [
        ...shared,
        "1,284 members is a scrollbar, not a page.",
        intensity === "catastrophe"
          ? "RTL, CJK, and emoji initials all hit the same 36px avatar."
          : "Status copy like “Invitation expired 12 days ago” is not a badge.",
      ];
    case "form":
      return [
        "Labels that are sentences steal the first field’s vertical rhythm.",
        "Inputs hold the value, but the profile header above them will not.",
        "Error text plus helper text plus a long label is three competing captions.",
        "Company names in two scripts blow past the 320px card.",
      ];
    case "table":
      return [
        "Header labels longer than the column they title.",
        "Currency mixes (€ and ₩) change the number column’s width.",
        "A one-character customer still reserves a legal-name column.",
        "Horizontal scroll is the polite failure. Overlap is the real one.",
      ];
    case "inbox":
      return [
        "Unread counts above 999 become a different component.",
        "An emoji-only subject still needs a two-line clamp.",
        "RTL senders reverse the metadata row unless you isolate direction.",
        "Email-as-from overflows the timestamp.",
      ];
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function generatePack(input: {
  kind: ScenarioKind;
  intensity: Intensity;
  seed: number;
}): StressPack {
  const rng = createRng(input.seed + input.kind.length * 17);
  const { total, visible } = totals(input.intensity);
  const extraCount = input.intensity === "calm" ? 1 : input.intensity === "chaos" ? 3 : 5;
  const extras = shuffle(rng, WORST_EXTRA).slice(0, extraCount);
  const pool = [...WORST_CORE, ...WORST_EXTRA];
  const filler = Array.from({ length: input.intensity === "calm" ? 2 : 8 }, (_, index) => {
    const base = pick(rng, pool);
    return { ...base, id: `${base.id}-x${index}` };
  });

  const members = [...WORST_CORE, ...extras, ...filler];
  const fields = worstFields();
  const rows = worstRows(rng);
  const messages = worstMessages(rng);

  return {
    kind: input.kind,
    title:
      input.kind === "members"
        ? "Members"
        : input.kind === "form"
          ? "Profile"
          : input.kind === "table"
            ? "Invoices"
            : "Inbox",
    eyebrow: "Worst-case pack",
    totalCount: total,
    visibleLabel: visible,
    members,
    profileName: members[0]?.name ?? "Aleksandra Wiśniewska-Kowalczyk",
    profileEmail:
      "bartholomew.fitzgerald+newsletter.qa.staging@northwind-industries-holdings.example.com",
    profileTitle: members[0]?.role ?? "Senior Product Design Engineer",
    fields,
    columns: WORST_COLUMNS,
    rows,
    messages,
    notes: notesFor(input.kind, input.intensity),
    vectors: vectorsFor(input.kind, input.intensity),
  };
}

export function demoPack(kind: ScenarioKind): StressPack {
  return {
    kind,
    title:
      kind === "members"
        ? "Members"
        : kind === "form"
          ? "Profile"
          : kind === "table"
            ? "Invoices"
            : "Inbox",
    eyebrow: "Happy-path pack",
    totalCount: kind === "members" ? 5 : kind === "table" ? 4 : 3,
    visibleLabel:
      kind === "members"
        ? "Showing all 5"
        : kind === "table"
          ? "Showing 4 invoices"
          : "3 conversations",
    members: DEMO_MEMBERS,
    profileName: "Maya Okada",
    profileEmail: "maya@studio.test",
    profileTitle: "Designer",
    fields: DEMO_FIELDS,
    columns: DEMO_COLUMNS,
    rows: DEMO_ROWS,
    messages: DEMO_MESSAGES,
    notes: [
      "Short names, short labels, short lists.",
      "This is the screenshot that ships.",
      "Toggle Worst case to see what the file never included.",
    ],
    vectors: [],
  };
}
