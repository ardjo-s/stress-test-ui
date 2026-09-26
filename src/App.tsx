import { useMemo, useState } from "react";
import { ModeToggle } from "./components/ModeToggle.tsx";
import { PreviewStage } from "./components/PreviewStage.tsx";
import { demoPack, generatePack } from "./lib/generator.ts";
import { parsePrompt } from "./lib/parsePrompt.ts";
import { INTENSITY_COPY, SCENARIOS } from "./lib/scenarios.ts";
import type { Intensity, ScenarioKind } from "./types.ts";

const DEFAULT_PROMPT = SCENARIOS[0]?.prompt ?? "";

export default function App() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [kind, setKind] = useState<ScenarioKind>("members");
  const [intensity, setIntensity] = useState<Intensity>("chaos");
  const [mode, setMode] = useState<"demo" | "worst">("demo");
  const [seed, setSeed] = useState(7);
  const [composing, setComposing] = useState(false);
  const [inspect, setInspect] = useState(true);

  const pack = useMemo(() => {
    return mode === "demo"
      ? demoPack(kind)
      : generatePack({ kind, intensity, seed });
  }, [kind, intensity, mode, seed]);

  function applyScenario(next: ScenarioKind, nextPrompt?: string) {
    setKind(next);
    if (nextPrompt !== undefined) setPrompt(nextPrompt);
  }

  function compose(nextPrompt = prompt) {
    const parsed = parsePrompt(nextPrompt, kind);
    setPrompt(nextPrompt);
    setKind(parsed.kind);
    if (parsed.intensity !== "chaos" || /calm|catastroph|nuclear|destroy|insane|max/.test(nextPrompt.toLowerCase())) {
      setIntensity(parsed.intensity);
    }
    setMode("worst");
    setComposing(true);
    window.setTimeout(() => {
      setSeed((value) => value + 1);
      setComposing(false);
    }, 900);
  }

  return (
    <div className="min-h-svh bg-canvas text-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-8 md:px-8 md:py-12">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="font-mono text-[11px] tracking-[0.22em] text-mute">
              THEWHATIF.COMPANY
            </p>
            <h1 className="text-[40px] font-medium leading-[1.05] tracking-tight md:text-[52px]">
              Stress Lab
            </h1>
            <p className="max-w-md text-[15px] leading-6 text-mute">
              Ask it to break the stuff you built. Paste a UI, or describe a
              form, table, or list — we invent the worst-case names, emails,
              labels, and lists, then drop them into a live preview.
            </p>
          </div>
          <p className="max-w-xs text-[12px] leading-5 text-soft">
            Inspired by{" "}
            <a
              className="underline decoration-line underline-offset-2 hover:text-ink"
              href="https://x.com/emilkowalski/status/2103516287452483885"
              target="_blank"
              rel="noreferrer"
            >
              Emil Kowalski’s vibe-coded demo
            </a>
            . Same joke: demo data looks finished until it isn’t.
          </p>
        </header>

        <section className="rounded-[28px] border border-line bg-paper p-4 shadow-sm md:p-5">
          <label className="block">
            <span className="mb-2 block font-mono text-[11px] tracking-[0.16em] text-mute">
              DESCRIBE THE UI
            </span>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-2xl border border-line bg-canvas px-4 py-3 text-[14px] leading-6 outline-none focus:border-ink"
              placeholder="A team members list with avatars, roles, and status pills."
            />
          </label>
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {SCENARIOS.map((scenario) => (
                <button
                  key={scenario.kind}
                  type="button"
                  onClick={() => {
                    applyScenario(scenario.kind, scenario.prompt);
                    setMode("demo");
                  }}
                  className={`rounded-full border px-3 py-1.5 text-[12px] ${
                    kind === scenario.kind
                      ? "border-ink bg-ink text-canvas"
                      : "border-line text-mute hover:text-ink"
                  }`}
                >
                  {scenario.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => compose()}
              className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-canvas"
            >
              Generate worst case
            </button>
          </div>
        </section>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <ModeToggle mode={mode} onChange={setMode} />
              <div className="flex items-center gap-2">
                {(Object.keys(INTENSITY_COPY) as Intensity[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setIntensity(value);
                      setMode("worst");
                    }}
                    className={`rounded-full px-3 py-1 text-[12px] ${
                      intensity === value && mode === "worst"
                        ? "bg-ink text-canvas"
                        : "text-mute hover:text-ink"
                    }`}
                  >
                    {INTENSITY_COPY[value].label}
                  </button>
                ))}
              </div>
            </div>

            <PreviewStage
              kind={kind}
              mode={mode}
              pack={pack}
              composing={composing}
              inspect={inspect}
            />

            <p className="text-center text-[12px] text-soft">
              {SCENARIOS.find((scenario) => scenario.kind === kind)?.blurb}
            </p>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[24px] border border-line bg-paper p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[14px] font-medium">What breaks</h2>
                <label className="flex items-center gap-2 text-[11px] text-mute">
                  <input
                    type="checkbox"
                    checked={inspect}
                    onChange={(event) => setInspect(event.target.checked)}
                  />
                  Outline overflows
                </label>
              </div>
              <ol className="mt-3 list-decimal space-y-2 pl-4 text-[13px] leading-5 text-mute">
                {pack.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ol>
              {pack.vectors.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {pack.vectors.map((vector) => (
                    <span
                      key={vector}
                      className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-mute"
                    >
                      {vector}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-[24px] border border-line bg-paper p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-medium">Dataset</h2>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(JSON.stringify(pack, null, 2));
                  }}
                  className="text-[12px] text-mute hover:text-ink"
                >
                  Copy JSON
                </button>
              </div>
              <pre className="mt-3 max-h-56 overflow-auto rounded-2xl bg-canvas p-3 font-mono text-[10px] leading-4 text-neutral-600">
                {JSON.stringify(
                  {
                    kind: pack.kind,
                    total: pack.totalCount,
                    vectors: pack.vectors,
                    sample:
                      pack.kind === "members"
                        ? pack.members[0]
                        : pack.kind === "form"
                          ? pack.fields[0]
                          : pack.kind === "table"
                            ? pack.rows[0]
                            : pack.messages[0],
                  },
                  null,
                  2,
                )}
              </pre>
              <button
                type="button"
                onClick={() => compose()}
                className="mt-3 text-[12px] text-mute hover:text-ink"
              >
                Reroll the pack
              </button>
            </div>
          </aside>
        </div>

        <footer className="border-t border-line pt-6 text-[12px] text-soft">
          <p>
            Local composer — no API key. It reads your prompt, picks a surface,
            and generates stress data in the browser. Built for{" "}
            <span className="text-ink">THEWHATIF.COMPANY</span>.
          </p>
        </footer>
      </div>
    </div>
  );
}
