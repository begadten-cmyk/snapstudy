# SnapStudy

Upload an image of notes, textbooks, or diagrams. Get AI-generated explanations, quizzes, and flashcards (CSV export).

Built with Next.js 16 (App Router), Tailwind CSS 4, and Google Gemini.

## Setup

```bash
npm install
```

Create `.env.local` in the project root:

```
GEMINI_API_KEY=your_key_here
```

Get an API key from [Google AI Studio](https://aistudio.google.com/apikey).

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

- `/onboarding` — 3-step animated intro (shown once)
- `/home` — Dashboard with Quick Scan and Guided Study entry points
- `/workspace` — Upload image, stream analysis, view structured results
- `/library` — Saved runs (localStorage, max 10)
- `/library/[id]` — Detail view for a saved run

## Deploy (Vercel)

1. Push to GitHub.
2. Import into [Vercel](https://vercel.com/new).
3. Add `GEMINI_API_KEY` as an environment variable.
4. Deploy.

No database or auth required. All state is client-side (localStorage).
