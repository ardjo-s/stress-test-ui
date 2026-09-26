import { useOverflowHits } from "../hooks/useOverflowHits.ts";
import type { DataMode, ScenarioKind, StressPack } from "../types.ts";
import { FormPreview } from "./FormPreview.tsx";
import { InboxPreview } from "./InboxPreview.tsx";
import { MembersPreview } from "./MembersPreview.tsx";
import { TablePreview } from "./TablePreview.tsx";

type PreviewStageProps = {
  kind: ScenarioKind;
  mode: DataMode;
  pack: StressPack;
  composing: boolean;
  inspect: boolean;
};

function renderPreview(kind: ScenarioKind, pack: StressPack, worst: boolean) {
  switch (kind) {
    case "members":
      return <MembersPreview pack={pack} worst={worst} />;
    case "form":
      return <FormPreview pack={pack} worst={worst} />;
    case "table":
      return <TablePreview pack={pack} worst={worst} />;
    case "inbox":
      return <InboxPreview pack={pack} worst={worst} />;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

const COMPOSER_STEPS = [
  "Reading the layout…",
  "Inventing impossible names…",
  "Stretching labels past the gutter…",
  "Dropping them into the preview…",
];

export function PreviewStage({
  kind,
  mode,
  pack,
  composing,
  inspect,
}: PreviewStageProps) {
  const worst = mode === "worst";
  const rootRef = useOverflowHits(`${kind}-${mode}-${pack.totalCount}-${inspect}-${pack.members.map((m) => m.id).join(",")}`);

  return (
    <div
      ref={rootRef}
      className={`relative mx-auto w-full max-w-[440px] transition-all ${
        inspect && worst ? "inspect-on" : ""
      }`}
    >
      {composing ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[28px] bg-paper/80 backdrop-blur-sm">
          <div className="space-y-2 text-center">
            {COMPOSER_STEPS.map((step, index) => (
              <p
                key={step}
                className="text-[13px] text-mute"
                style={{ animation: `pulse-dot 1.2s ${index * 90}ms infinite` }}
              >
                {step}
              </p>
            ))}
          </div>
        </div>
      ) : null}
      <div className="animate-rise" key={`${kind}-${mode}-${pack.profileName}`}>
        {renderPreview(kind, pack, worst)}
      </div>
    </div>
  );
}
