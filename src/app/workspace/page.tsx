"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Dropzone } from "@/components/Dropzone";
import { SegmentedControl } from "@/components/SegmentedControl";
import { ProgressLine } from "@/components/ProgressLine";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/Button";
import { parseOutput, type ParsedOutput } from "@/lib/parseOutput";
import { saveRun, type Flashcard } from "@/lib/storage";

type Mode = "speed" | "depth";
type Tab = "live" | "explanation" | "quiz" | "flashcards";

function WorkspaceInner() {
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") === "depth" ? "depth" : "speed") as Mode;

  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [goal, setGoal] = useState("");
  const [rawOutput, setRawOutput] = useState("");
  const [parsed, setParsed] = useState<ParsedOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [tab, setTab] = useState<Tab>("live");
  const [saved, setSaved] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);

  // Auto-scroll with user override
  const handleScroll = useCallback(() => {
    const el = outputRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    userScrolledRef.current = !atBottom;
  }, []);

  useEffect(() => {
    if (loading && outputRef.current && !userScrolledRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [rawOutput, loading]);

  // ── Generate (stream) ────────────────────────────────────────
  async function generate() {
    if (!file || loading) return;
    setLoading(true);
    setRawOutput("");
    setParsed(null);
    setError(null);
    setDone(false);
    setSaved(false);
    setTab("live");
    userScrolledRef.current = false;

    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("mode", mode);
      if (goal.trim()) fd.append("goal", goal.trim());

      const res = await fetch("/api/analyze", { method: "POST", body: fd });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Request failed" }));
        const msg = errData.error || `Request failed (${res.status})`;
        // Friendly error messages
        if (res.status === 500 && msg.includes("API_KEY")) {
          throw new Error("Server missing API key. If running locally, add GEMINI_API_KEY to .env.local");
        }
        if (res.status === 429 || msg.includes("quota") || msg.includes("rate")) {
          throw new Error("Rate limit reached. Try Speed mode or wait a minute.");
        }
        throw new Error(msg);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        full += decoder.decode(value, { stream: true });
        setRawOutput(full);
      }

      // Parse
      const result = parseOutput(full);
      setParsed(result);
      if (result.jsonError) {
        setError("Couldn't parse flashcards. Try again.");
      }

      // Auto-save
      try {
        saveRun({
          mode,
          goal,
          rawText: result.raw,
          explanation: result.explanation,
          quiz: result.quiz,
          flashcards: result.flashcards,
        });
        setSaved(true);
      } catch {
        // localStorage might be full, not critical
      }

      setDone(true);
      setTab("explanation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // ── CSV download ─────────────────────────────────────────────
  function downloadCSV(flashcards: Flashcard[]) {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const csv = [
      "Front,Back",
      ...flashcards.map((c) => `${esc(c.front)},${esc(c.back)}`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flashcards.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: "live", label: "Live output", show: true },
    { key: "explanation", label: "Explanation", show: done },
    { key: "quiz", label: "Quiz", show: done },
    { key: "flashcards", label: `Flashcards${parsed?.flashcards.length ? ` (${parsed.flashcards.length})` : ""}`, show: done && !!parsed?.flashcards.length },
  ];

  return (
    <div className="min-h-screen">
      <Nav />
      <ProgressLine active={loading} />

      <main className="mx-auto max-w-[960px] px-6 py-8 animate-fade-in">
        <div className="grid gap-8 lg:grid-cols-[272px_1fr] lg:gap-10">
          {/* ── Left: Input controls ─────────────────────── */}
          <div className="space-y-4">
            <Dropzone
              file={file}
              onFile={setFile}
              onRemove={() => setFile(null)}
              onError={setError}
            />

            <div>
              <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Mode
              </div>
              <SegmentedControl
                options={[
                  { value: "speed", label: "Speed", sub: "Flash" },
                  { value: "depth", label: "Depth", sub: "Pro" },
                ]}
                value={mode}
                onChange={(v) => setMode(v as Mode)}
              />
            </div>

            <div>
              <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Focus{" "}
                <span className="normal-case tracking-normal opacity-50">
                  optional
                </span>
              </div>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. calculus steps"
                className="h-9 w-full rounded-lg border border-zinc-200 bg-transparent px-3 text-[13px] text-zinc-900 placeholder:text-zinc-300 focus:border-[#2754C5] focus:outline-none focus:ring-1 focus:ring-[#2754C5]/20"
              />
            </div>

            <Button
              onClick={generate}
              disabled={!file || loading}
              className="w-full"
            >
              {loading && (
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? "Analyzing\u2026" : "Generate"}
            </Button>

            {error && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-700">
                {error}
              </div>
            )}

            {saved && (
              <p className="text-[11px] text-zinc-400">Saved to library.</p>
            )}
          </div>

          {/* ── Right: Output ────────────────────────────── */}
          <div className="flex min-h-[480px] flex-col overflow-hidden rounded-xl border border-zinc-100 bg-white">
            {/* Tabs */}
            <div className="flex h-10 shrink-0 items-center gap-1 border-b border-zinc-100 px-3">
              {tabs.filter((t) => t.show).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    tab === t.key
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  {t.label}
                </button>
              ))}

              {loading && (
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2754C5]" />
                  <span className="text-[11px] text-zinc-400">Streaming</span>
                </div>
              )}
            </div>

            {/* Content area */}
            <div
              ref={outputRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4"
            >
              {/* Live output */}
              {tab === "live" && (
                <div className="font-[family-name:var(--font-geist-mono)] text-[13px] leading-[1.75] whitespace-pre-wrap text-zinc-600">
                  {rawOutput || (
                    <div className="flex h-64 flex-col items-center justify-center gap-2">
                      <svg className="h-6 w-6 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <p className="text-[13px] text-zinc-300">
                        Upload an image and click Generate.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Explanation */}
              {tab === "explanation" && parsed && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[15px] font-semibold text-zinc-900">Explanation</h2>
                    <CopyButton text={parsed.explanation} label="Copy" />
                  </div>
                  <div className="text-[13px] leading-[1.8] text-zinc-600 whitespace-pre-wrap">
                    {parsed.explanation}
                  </div>
                </div>
              )}

              {/* Quiz */}
              {tab === "quiz" && parsed && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[15px] font-semibold text-zinc-900">Quiz</h2>
                    <CopyButton text={parsed.quiz} label="Copy quiz" />
                  </div>
                  <div className="text-[13px] leading-[1.8] text-zinc-600 whitespace-pre-wrap">
                    {parsed.quiz}
                  </div>
                </div>
              )}

              {/* Flashcards */}
              {tab === "flashcards" && parsed && parsed.flashcards.length > 0 && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[15px] font-semibold text-zinc-900">Flashcards</h2>
                    <Button
                      variant="ghost"
                      onClick={() => downloadCSV(parsed.flashcards)}
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      Download CSV
                    </Button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {parsed.flashcards.map((fc, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-zinc-100 bg-zinc-50 p-3"
                      >
                        <p className="text-[12px] font-medium text-zinc-900 mb-1">
                          {fc.front}
                        </p>
                        <p className="text-[12px] text-zinc-500">
                          {fc.back}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Raw output disclosure */}
            {done && tab !== "live" && (
              <div className="shrink-0 border-t border-zinc-100 px-4 py-2">
                <button
                  onClick={() => setTab("live")}
                  className="text-[11px] font-medium text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  View raw output &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense>
      <WorkspaceInner />
    </Suspense>
  );
}
