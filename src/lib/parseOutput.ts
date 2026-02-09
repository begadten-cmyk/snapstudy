import type { Flashcard } from "./storage";

export interface ParsedOutput {
  explanation: string;
  quiz: string;
  flashcards: Flashcard[];
  raw: string;
  jsonError: boolean;
}

export function parseOutput(full: string): ParsedOutput {
  const marker = "===JSON===";
  const markerIdx = full.indexOf(marker);

  let textPart = full;
  let flashcards: Flashcard[] = [];
  let jsonError = false;

  if (markerIdx !== -1) {
    textPart = full.slice(0, markerIdx).trim();
    const jsonStr = full.slice(markerIdx + marker.length).trim();
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.flashcards)) {
        flashcards = parsed.flashcards;
      }
    } catch {
      jsonError = true;
    }
  }

  // Split into explanation and quiz
  const quizIdx = textPart.indexOf("## Quiz");
  let explanation: string;
  let quiz: string;

  if (quizIdx !== -1) {
    explanation = textPart.slice(0, quizIdx).trim();
    quiz = textPart.slice(quizIdx).trim();
  } else {
    // Fallback: first 60% / last 40%
    const splitPoint = Math.floor(textPart.length * 0.6);
    explanation = textPart.slice(0, splitPoint).trim();
    quiz = textPart.slice(splitPoint).trim();
  }

  // Clean "## Explanation" header from explanation
  explanation = explanation.replace(/^## Explanation\s*/i, "").trim();

  return { explanation, quiz, flashcards, raw: textPart, jsonError };
}
