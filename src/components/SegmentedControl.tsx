"use client";

interface Option {
  value: string;
  label: string;
  sub?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-[7px] px-3.5 py-1.5 text-[12px] font-medium transition-all ${
            value === opt.value
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          {opt.label}
          {opt.sub && (
            <span className="ml-1 text-[10px] opacity-40">{opt.sub}</span>
          )}
        </button>
      ))}
    </div>
  );
}
