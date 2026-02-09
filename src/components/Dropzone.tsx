"use client";

import { useRef, useState, DragEvent } from "react";

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

export function Dropzone({
  file,
  onFile,
  onRemove,
  onError,
}: {
  file: File | null;
  onFile: (f: File) => void;
  onRemove: () => void;
  onError: (msg: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function validate(f: File) {
    if (!f.type.startsWith("image/")) {
      onError("Please select an image file.");
      return;
    }
    if (f.size > MAX_SIZE) {
      onError("Image must be under 8 MB.");
      return;
    }
    onFile(f);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) validate(f);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) validate(f);
  }

  if (file) {
    return (
      <div className="flex h-10 items-center gap-2 rounded-lg bg-zinc-50 px-3 dark:bg-zinc-800">
        <svg
          className="h-3.5 w-3.5 shrink-0 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25c0 .828.672 1.5 1.5 1.5z"
          />
        </svg>
        <span className="min-w-0 flex-1 truncate text-[13px] text-zinc-700 dark:text-zinc-300">
          {file.name}
        </span>
        <span className="shrink-0 text-[11px] text-zinc-400 dark:text-zinc-500">
          {fmtSize(file.size)}
        </span>
        <button
          onClick={onRemove}
          className="ml-0.5 shrink-0 text-zinc-300 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`flex h-[72px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed transition-colors ${
        dragOver
          ? "border-[#2754C5]/40 bg-[#2754C5]/5 text-[#2754C5]"
          : "border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-500 dark:border-zinc-700 dark:text-zinc-500 dark:hover:border-zinc-600 dark:hover:text-zinc-400"
      }`}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
        />
      </svg>
      <span className="text-[13px]">
        {dragOver ? "Drop image" : "Choose image"}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
}
