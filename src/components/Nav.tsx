"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/home", label: "Home" },
  { href: "/workspace", label: "Workspace" },
  { href: "/library", label: "Library" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-200/60 dark:border-zinc-800/60">
      <div className="mx-auto flex h-12 max-w-[960px] items-center gap-6 px-6">
        <Link
          href="/home"
          className="flex items-center gap-2 mr-2"
        >
          <div className="flex h-[22px] w-[22px] items-center justify-center rounded-[5px] bg-[#2754C5]">
            <svg
              className="h-3 w-3 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
              />
            </svg>
          </div>
          <span className="text-[13px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            SnapStudy
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href === "/library" && pathname.startsWith("/library"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
                  active
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
