"use client";

import { ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40";

const variants = {
  primary:
    "bg-[#2754C5] text-white hover:bg-[#1e44a3] focus-visible:ring-[#2754C5] rounded-lg text-[13px] h-9 px-4",
  secondary:
    "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 focus-visible:ring-zinc-400 rounded-lg text-[13px] h-9 px-4",
  ghost:
    "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 rounded-md text-[12px] h-8 px-2.5",
  destructive:
    "text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md text-[12px] h-8 px-2.5",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
