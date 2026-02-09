"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Button } from "@/components/Button";
import { getRuns, clearRuns, deleteRun, type Run } from "@/lib/storage";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function LibraryPage() {
  const [runs, setRuns] = useState<Run[]>([]);

  useEffect(() => {
    setRuns(getRuns());
  }, []);

  function handleClearAll() {
    clearRuns();
    setRuns([]);
  }

  function handleDelete(id: string) {
    deleteRun(id);
    setRuns(getRuns());
  }

  return (
    <div className="min-h-screen">
      <Nav />

      <main className="mx-auto max-w-[960px] px-6 py-10 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[20px] font-semibold tracking-tight text-zinc-900">
              Library
            </h1>
            <p className="text-[13px] text-zinc-400 mt-0.5">
              {runs.length === 0
                ? "No saved runs yet."
                : `${runs.length} saved run${runs.length > 1 ? "s" : ""}`}
            </p>
          </div>
          {runs.length > 0 && (
            <Button variant="destructive" onClick={handleClearAll}>
              Clear all
            </Button>
          )}
        </div>

        {runs.length > 0 && (
          <div className="rounded-xl border border-zinc-100 bg-white overflow-hidden">
            {runs.map((run, i) => (
              <div
                key={run.id}
                className={`flex items-center gap-4 px-4 py-3 transition-colors hover:bg-zinc-50 ${
                  i > 0 ? "border-t border-zinc-100" : ""
                }`}
              >
                <div
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    run.mode === "speed" ? "bg-amber-400" : "bg-violet-400"
                  }`}
                />
                <Link
                  href={`/library/${run.id}`}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-[13px] font-medium text-zinc-800 hover:text-[#2754C5] transition-colors">
                    {run.title}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {formatDate(run.createdAt)}
                    {run.goal && (
                      <span className="ml-2 text-zinc-300">
                        &middot; {run.goal}
                      </span>
                    )}
                  </p>
                </Link>
                <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                  {run.mode}
                </span>
                <button
                  onClick={() => handleDelete(run.id)}
                  className="shrink-0 text-zinc-300 hover:text-red-500 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {runs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="h-8 w-8 text-zinc-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
            <p className="text-[13px] text-zinc-400 mb-4">
              Runs are saved automatically when you generate study materials.
            </p>
            <Link href="/workspace">
              <Button>Go to Workspace</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
