"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setOnboarded } from "@/lib/storage";
import { Button } from "@/components/Button";

const steps = [
  {
    title: "Drop any image",
    desc: "Photo of notes, textbook page, diagram, or screenshot. SnapStudy accepts any image under 8 MB.",
    visual: (
      <div className="relative mx-auto h-28 w-40 rounded-xl border-2 border-dashed border-zinc-300 bg-white flex items-center justify-center">
        <div className="absolute -top-2 -right-2 h-10 w-14 rounded-lg bg-[#2754C5]/10 border border-[#2754C5]/20 rotate-6" />
        <svg className="h-8 w-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25c0 .828.672 1.5 1.5 1.5z" />
        </svg>
      </div>
    ),
  },
  {
    title: "Get an explanation and quiz",
    desc: "Gemini analyzes your image and streams back a clear explanation, 5 quiz questions, and 12 flashcards.",
    visual: (
      <div className="mx-auto w-48 space-y-1.5">
        {[85, 100, 60, 90, 45].map((w, i) => (
          <div
            key={i}
            className="h-2 rounded-full bg-zinc-200"
            style={{ width: `${w}%` }}
          />
        ))}
        <div className="mt-3 flex gap-1.5">
          <div className="h-6 flex-1 rounded bg-[#2754C5]/10 border border-[#2754C5]/20" />
          <div className="h-6 flex-1 rounded bg-[#2754C5]/10 border border-[#2754C5]/20" />
        </div>
      </div>
    ),
  },
  {
    title: "Export and study",
    desc: "Download flashcards as CSV for Anki or Quizlet. Copy the quiz. Review past runs in your library.",
    visual: (
      <div className="mx-auto w-44">
        <div className="rounded-lg border border-zinc-200 bg-white p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-emerald-400/60" />
            <div className="h-2 flex-1 rounded-full bg-zinc-200" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-emerald-400/60" />
            <div className="h-2 w-3/4 rounded-full bg-zinc-200" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-emerald-400/60" />
            <div className="h-2 w-5/6 rounded-full bg-zinc-200" />
          </div>
        </div>
        <div className="mt-2 mx-auto w-20 h-7 rounded-md bg-[#2754C5]/10 border border-[#2754C5]/20 flex items-center justify-center">
          <span className="text-[10px] font-medium text-[#2754C5]">.csv</span>
        </div>
      </div>
    ),
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const router = useRouter();

  function finish() {
    setOnboarded();
    router.replace("/home");
  }

  function next() {
    if (step === steps.length - 1) {
      finish();
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setAnimating(false);
    }, 200);
  }

  const current = steps[step];

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Step indicator */}
        <div className="mb-8 flex justify-center gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === step ? "w-6 bg-[#2754C5]" : i < step ? "w-3 bg-[#2754C5]/40" : "w-3 bg-zinc-200"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div
          className={`text-center ${animating ? "animate-slide-out" : "animate-slide-in"}`}
          key={step}
        >
          {/* Visual */}
          <div className="mb-8 flex justify-center">
            {current.visual}
          </div>

          {/* Text */}
          <h1 className="text-[20px] font-semibold tracking-tight text-zinc-900 mb-2">
            {current.title}
          </h1>
          <p className="text-[14px] leading-relaxed text-zinc-500 mb-8">
            {current.desc}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={finish}
            className="text-[12px] font-medium text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            Skip
          </button>
          <Button onClick={next}>
            {step === steps.length - 1 ? "Get started" : "Continue"}
          </Button>
        </div>

        {/* Step count */}
        <p className="mt-6 text-center text-[11px] text-zinc-300">
          {step + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}
