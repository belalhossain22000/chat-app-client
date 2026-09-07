// Shared server-side Gemini caller. Key stays in GEMINI_API_KEY (no NEXT_PUBLIC_).

// gemini-flash-lite has a more generous free-tier request-per-day quota.
// It also has no "thinking" mode, so we must NOT send thinkingConfig to it.
const MODEL = "gemini-flash-lite-latest";
const SUPPORTS_THINKING = /^(gemini-2\.5-flash|gemini-3|gemini-flash-latest)/.test(
  MODEL,
);
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export interface GeminiTurn {
  role: "user" | "assistant";
  content: string;
}

interface GeminiOptions {
  system: string;
  turns: GeminiTurn[];
  maxOutputTokens?: number;
  temperature?: number;
}

export type GeminiResult =
  | { ok: true; text: string }
  | { ok: false; status: number; detail?: string };

export async function callGemini({
  system,
  turns,
  maxOutputTokens = 500,
  temperature = 0.5,
}: GeminiOptions): Promise<GeminiResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { ok: false, status: 503 };

  const contents = turns.map((t) => ({
    role: t.role === "assistant" ? "model" : "user",
    parts: [{ text: t.content.slice(0, 6000) }],
  }));

  try {
    const res = await fetch(`${ENDPOINT}?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: system }] },
        generationConfig: {
          temperature,
          maxOutputTokens,
          ...(SUPPORTS_THINKING
            ? { thinkingConfig: { thinkingBudget: 0 } }
            : {}),
        },
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, status: 502, detail: detail.slice(0, 500) };
    }

    const data = await res.json();
    const text: string =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? "")
        .join("")
        .trim() || "";

    if (!text) return { ok: false, status: 502, detail: "empty response" };
    return { ok: true, text };
  } catch {
    return { ok: false, status: 502, detail: "fetch failed" };
  }
}
