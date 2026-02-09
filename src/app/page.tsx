"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isOnboarded } from "@/lib/storage";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  const [dest, setDest] = useState("/onboarding");

  useEffect(() => {
    if (isOnboarded()) setDest("/home");
  }, []);

  return (
    <div className="min-h-screen">
      {/* Landing nav */}
      <header className="border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="mx-auto flex h-12 max-w-[960px] items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-[22px] w-[22px] items-center justify-center rounded-[5px] bg-[#2754C5]">
              <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              SnapStudy
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href={dest}
              className="inline-flex h-8 items-center rounded-lg bg-[#2754C5] px-3 text-[12px] font-medium text-white hover:bg-[#1e44a3] transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[960px] px-6 pt-20 pb-16 text-center animate-fade-in">
        <h1 className="text-[32px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-[40px]">
          Welcome to SnapStudy
        </h1>
        <p className="mx-auto mt-4 max-w-[480px] text-[16px] leading-relaxed text-zinc-500 dark:text-zinc-400">
          Upload an image of your notes, textbooks, or diagrams. Get AI-generated
          explanations, quizzes, and flashcards in seconds.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href={dest}
            className="inline-flex h-10 items-center rounded-lg bg-[#2754C5] px-5 text-[14px] font-medium text-white hover:bg-[#1e44a3] transition-colors"
          >
            Get started
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex h-10 items-center rounded-lg border border-zinc-200 dark:border-zinc-700 px-5 text-[14px] font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            See how it works
          </a>
        </div>
      </section>

      {/* Demo preview */}
      <section className="mx-auto max-w-[720px] px-6 pb-20 animate-fade-in-delay-1">
        <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 p-1 shadow-sm">
          <div className="flex h-8 items-center gap-1.5 px-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <span className="ml-2 text-[10px] text-zinc-400 dark:text-zinc-500">SnapStudy — Workspace</span>
          </div>
          <div className="grid grid-cols-[200px_1fr] gap-px bg-zinc-100 dark:bg-zinc-800">
            {/* Left mock */}
            <div className="bg-white dark:bg-zinc-900 p-4 space-y-3">
              <div className="h-16 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                <span className="text-[11px] text-zinc-300 dark:text-zinc-600">Drop image</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                <div className="flex gap-1">
                  <div className="h-6 flex-1 rounded bg-zinc-100 dark:bg-zinc-800" />
                  <div className="h-6 flex-1 rounded bg-zinc-100 dark:bg-zinc-800" />
                </div>
              </div>
              <div className="h-8 rounded-lg bg-[#2754C5]/15 flex items-center justify-center">
                <span className="text-[10px] font-medium text-[#2754C5]">Generate</span>
              </div>
            </div>
            {/* Right mock */}
            <div className="bg-white dark:bg-zinc-900 p-4 space-y-2">
              {[90, 100, 75, 95, 60, 85, 40].map((w, i) => (
                <div key={i} className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800" style={{ width: `${w}%` }} />
              ))}
              <div className="pt-2 grid grid-cols-2 gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 rounded border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-zinc-200/60 dark:border-zinc-800/60 py-20">
        <div className="mx-auto max-w-[960px] px-6">
          <h2 className="text-center text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-10">
            How it works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Upload an image",
                desc: "Snap a photo of your notes, textbook page, or diagram. Any image under 8 MB works.",
              },
              {
                step: "2",
                title: "AI analyzes it",
                desc: "Gemini reads your image and streams back a clear explanation, quiz questions, and flashcards.",
              },
              {
                step: "3",
                title: "Study and export",
                desc: "Review the material, copy the quiz, or download flashcards as CSV for Anki or Quizlet.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#2754C5]/10 text-[13px] font-semibold text-[#2754C5]">
                  {item.step}
                </div>
                <h3 className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200/60 dark:border-zinc-800/60 py-6">
        <p className="text-center text-[11px] text-zinc-300 dark:text-zinc-600">
          Built with Next.js, Tailwind CSS, and Google Gemini. No account required.
        </p>
      </footer>
    </div>
  );
}
