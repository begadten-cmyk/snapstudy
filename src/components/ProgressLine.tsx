"use client";

export function ProgressLine({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="h-0.5 w-full overflow-hidden bg-zinc-100">
      <div className="h-full w-1/3 animate-[progress_1.2s_ease-in-out_infinite] bg-[#2754C5]/60 rounded-full" />
    </div>
  );
}
