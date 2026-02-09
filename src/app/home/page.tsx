"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { getRuns, type Run } from "@/lib/storage";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function HomePage() {
  const [recent, setRecent] = useState<Run[]>([]);

  useEffect(() => {
    setRecent(getRuns().slice(0, 3));
  }, []);

  return (
    <div className="min-h-screen">
      <Nav />

      <main className="mx-auto max-w-[960px] px-6 py-10 animate-fade-in">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-1">
            What are you studying?
          </h1>
          <p className="text-[14px] text-zinc-400 dark:text-zinc-500">
            Upload an image of notes, a textbook, or a diagram. Get an explanation, quiz, and flashcards.
          </p>
        </div>

        {/* Two entry cards */}
        <div className="grid gap-4 sm:grid-cols-2 mb-10">
          <Link
            href="/workspace?mode=speed"
            className="group rounded-xl border border-zinc-200/80 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950">
                <svg className="h-4 w-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-[#2754C5] transition-colors">
                  Quick Scan
                </h2>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              Fast analysis using Gemini Flash. Best for simple notes and quick review.
            </p>
            <div className="mt-3 text-[11px] font-medium text-zinc-400 dark:text-zinc-500 group-hover:text-[#2754C5] transition-colors">
              Speed mode &rarr;
            </div>
          </Link>

          <Link
            href="/workspace?mode=depth"
            className="group rounded-xl border border-zinc-200/80 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950">
                <svg className="h-4 w-4 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-[#2754C5] transition-colors">
                  Guided Study
                </h2>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              Deep analysis using Gemini Pro. Better for complex diagrams, formulas, and detailed material.
            </p>
            <div className="mt-3 text-[11px] font-medium text-zinc-400 dark:text-zinc-500 group-hover:text-[#2754C5] transition-colors">
              Depth mode &rarr;
            </div>
          </Link>
        </div>

        {/* Recent runs */}
        {recent.length > 0 && (
          <div className="animate-fade-in-delay-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Recent
              </h2>
              <Link href="/library" className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                View all &rarr;
              </Link>
            </div>
            <div className="space-y-1">
              {recent.map((run) => (
                <Link
                  key={run.id}
                  href={`/library/${run.id}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white dark:hover:bg-zinc-900"
                >
                  <div className={`h-1.5 w-1.5 rounded-full ${run.mode === "speed" ? "bg-amber-400" : "bg-violet-400"}`} />
                  <span className="min-w-0 flex-1 truncate text-[13px] text-zinc-700 dark:text-zinc-300">
                    {run.title}
                  </span>
                  <span className="shrink-0 text-[11px] text-zinc-400 dark:text-zinc-500">
                    {timeAgo(run.createdAt)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Privacy note */}
        <p className="mt-12 text-[11px] leading-relaxed text-zinc-300 dark:text-zinc-600">
          Images are sent to Google Gemini for analysis. Nothing is stored on our servers.
          Saved runs are kept locally in your browser.
        </p>
      </main>
    </div>
  );
}
