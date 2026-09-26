import type { DataMode } from "../types.ts";

type ModeToggleProps = {
  mode: DataMode;
  onChange: (mode: DataMode) => void;
};

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-line bg-paper p-1 shadow-sm">
      <button
        type="button"
        onClick={() => onChange("demo")}
        className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
          mode === "demo" ? "bg-ink text-canvas" : "text-mute hover:text-ink"
        }`}
      >
        Demo data
      </button>
      <button
        type="button"
        onClick={() => onChange("worst")}
        className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
          mode === "worst" ? "bg-ink text-canvas" : "text-mute hover:text-ink"
        }`}
      >
        Worst case
      </button>
    </div>
  );
}
