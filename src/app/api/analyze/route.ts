export const runtime = "nodejs";

import { GoogleGenAI } from "@google/genai";

// ── Model IDs (update here when new versions ship) ──────────────
const MODELS = {
  speed: "gemini-2.0-flash",
  depth: "gemini-2.5-pro-preview-05-06",
} as const;

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  // ── Parse form data ───────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json({ error: "Invalid form data." }, { status: 400 });
  }

  const imageFile = formData.get("image") as File | null;
  const mode = formData.get("mode") as string;
  const goal = (formData.get("goal") as string) || "";

  if (!imageFile || !imageFile.type.startsWith("image/")) {
    return Response.json(
      { error: "A valid image file is required." },
      { status: 400 },
    );
  }
  if (mode !== "speed" && mode !== "depth") {
    return Response.json(
      { error: "Mode must be 'speed' or 'depth'." },
      { status: 400 },
    );
  }
  if (imageFile.size > MAX_FILE_SIZE) {
    return Response.json(
      { error: "Image must be under 20 MB." },
      { status: 400 },
    );
  }

  // ── Prepare image ─────────────────────────────────────────────
  const bytes = await imageFile.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  const goalClause = goal
    ? `\nThe student's specific goal: "${goal}". Tailor your explanation and questions toward this goal.`
    : "";

  const prompt = `You are an expert tutor. Analyze the provided image (which may be a photo of notes, a textbook page, a diagram, a screenshot, etc.) and produce study materials.${goalClause}

Your response MUST follow this exact structure:

## Explanation
Provide a clear, thorough explanation of the content shown in the image. Use paragraphs and sub-headings if needed.

## Quiz
Generate exactly 5 question-answer pairs. Format each as:
**Q1:** [question]
**A1:** [answer]

…through Q5/A5.

After the quiz, output this marker on its own line:
===JSON===
Then output a single valid JSON object with exactly 12 flashcards:
{"flashcards":[{"front":"...","back":"..."}]}
The flashcards should cover key concepts from the image. Keep front/back concise (1-2 sentences max). Do NOT output any text after the JSON object.`;

  // ── Call Gemini (streaming) ───────────────────────────────────
  const ai = new GoogleGenAI({ apiKey });
  const modelId = MODELS[mode];

  try {
    const response = await ai.models.generateContentStream({
      model: modelId,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: imageFile.type, data: base64 } },
            { text: prompt },
          ],
        },
      ],
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(encoder.encode(`\n\n[Error: ${msg}]`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gemini API error";
    return Response.json({ error: msg }, { status: 502 });
  }
}
