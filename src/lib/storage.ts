export type Flashcard = { front: string; back: string };

export interface Run {
  id: string;
  createdAt: number;
  mode: "speed" | "depth";
  goal: string;
  title: string;
  rawText: string;
  explanation: string;
  quiz: string;
  flashcards: Flashcard[];
}

const RUNS_KEY = "snapstudy_runs";
const ONBOARDED_KEY = "snapstudy_onboarded";
const MAX_RUNS = 10;

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function titleFromText(text: string): string {
  const first = text.replace(/^#+\s*/gm, "").trim().split(/\n/)[0] || "";
  const words = first.split(/\s+/).slice(0, 8).join(" ");
  return words.length > 60 ? words.slice(0, 57) + "…" : words || "Untitled";
}

export function getRuns(): Run[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RUNS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getRun(id: string): Run | undefined {
  return getRuns().find((r) => r.id === id);
}

export function saveRun(
  data: Omit<Run, "id" | "createdAt" | "title">,
): Run {
  const run: Run = {
    ...data,
    id: genId(),
    createdAt: Date.now(),
    title: titleFromText(data.explanation || data.rawText),
  };
  const runs = [run, ...getRuns()].slice(0, MAX_RUNS);
  localStorage.setItem(RUNS_KEY, JSON.stringify(runs));
  return run;
}

export function deleteRun(id: string): void {
  const runs = getRuns().filter((r) => r.id !== id);
  localStorage.setItem(RUNS_KEY, JSON.stringify(runs));
}

export function clearRuns(): void {
  localStorage.removeItem(RUNS_KEY);
}

export function isOnboarded(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDED_KEY) === "true";
}

export function setOnboarded(): void {
  localStorage.setItem(ONBOARDED_KEY, "true");
}
