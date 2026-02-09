"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/Button";
import { getRun, type Run, type Flashcard } from "@/lib/storage";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

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

export default function RunDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [run, setRun] = useState<Run | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const found = getRun(id);
    if (found) {
      setRun(found);
    } else {
      setNotFound(true);
    }
  }, [params.id]);

  if (notFound) {
    return (
      <div className="min-h-screen">
        <Nav />
        <main className="mx-auto max-w-[960px] px-6 py-20 text-center">
          <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mb-4">Run not found.</p>
          <Link href="/library">
            <Button variant="secondary">Back to Library</Button>
          </Link>
        </main>
      </div>
    );
  }

  if (!run) return null;

  return (
    <div className="min-h-screen">
      <Nav />

      <main className="mx-auto max-w-[960px] px-6 py-10 animate-fade-in">
        {/* Back + header */}
        <button
          onClick={() => router.back()}
          className="mb-4 text-[12px] font-medium text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
        >
          &larr; Back
        </button>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-[20px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {run.title}
            </h1>
            <p className="text-[12px] text-zinc-400 dark:text-zinc-500 mt-1">
              {formatDate(run.createdAt)}
              <span className="ml-2 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                {run.mode}
              </span>
              {run.goal && (
                <span className="ml-2 text-zinc-300 dark:text-zinc-600">&middot; {run.goal}</span>
              )}
            </p>
          </div>
        </div>

        {/* Explanation */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">
              Explanation
            </h2>
            <CopyButton text={run.explanation} />
          </div>
          <div className="rounded-xl border border-zinc-100 bg-white p-5 text-[13px] leading-[1.8] text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap dark:border-zinc-800 dark:bg-zinc-900">
            {run.explanation}
          </div>
        </section>

        {/* Quiz */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">Quiz</h2>
            <CopyButton text={run.quiz} label="Copy quiz" />
          </div>
          <div className="rounded-xl border border-zinc-100 bg-white p-5 text-[13px] leading-[1.8] text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap dark:border-zinc-800 dark:bg-zinc-900">
            {run.quiz}
          </div>
        </section>

        {/* Flashcards */}
        {run.flashcards.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">
                Flashcards ({run.flashcards.length})
              </h2>
              <Button
                variant="ghost"
                onClick={() => downloadCSV(run.flashcards)}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download CSV
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {run.flashcards.map((fc, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-zinc-100 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <p className="text-[12px] font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                    {fc.front}
                  </p>
                  <p className="text-[12px] text-zinc-500 dark:text-zinc-400">{fc.back}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Raw output */}
        <details className="group">
          <summary className="cursor-pointer text-[11px] font-medium uppercase tracking-wider text-zinc-300 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors">
            Raw output
          </summary>
          <div className="mt-3 rounded-xl border border-zinc-100 bg-white p-4 font-[family-name:var(--font-geist-mono)] text-[12px] leading-[1.75] text-zinc-500 dark:text-zinc-400 whitespace-pre-wrap max-h-80 overflow-y-auto dark:border-zinc-800 dark:bg-zinc-900">
            {run.rawText}
          </div>
        </details>
      </main>
    </div>
  );
}
