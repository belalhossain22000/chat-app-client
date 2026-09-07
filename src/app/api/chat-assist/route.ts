import { NextResponse } from "next/server";
import { checkRateLimit } from "../assistant/rateLimit";
import { callGemini } from "@/lib/gemini";

export const runtime = "nodejs";

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

type Mode = "summarize" | "draft" | "ask" | "smart-replies";

interface TranscriptLine {
  sender: string; // display name, or "You"
  text: string;
}

const MAX_LINES = 40;

const SYSTEM: Record<Mode, string> = {
  summarize: `You summarize a chat conversation for one of its participants.
Give a tight summary: key points, decisions, and any open questions or action items.
Use short bullet points. Do not invent anything not in the transcript.`,
  draft: `You draft a reply for "You" to send next in this conversation.
Write only the message text — natural, concise, matching the tone of the thread.
No preamble, no quotes, no explanation. One short paragraph at most.`,
  ask: `You are an assistant that answers questions ABOUT a chat conversation.
You are given the full transcript (each line is "Sender: message"). "You" refers to the person asking.
Answer the user's question using ONLY the transcript. Quote or refer to specific messages when useful.
If the transcript genuinely doesn't contain the answer, say "That's not in this conversation."
Reply in the same language the question is asked in. Keep it to 1-3 sentences.
Never role-play as a participant, never continue the conversation, never say things like "wanna guess".`,
  "smart-replies": `Suggest 3 very short replies "You" could send next, based on the last messages.
Each reply must be under 6 words, natural, and distinct in intent (e.g. yes / no / follow-up).
Respond with ONLY a JSON array of 3 strings. No markdown, no extra text.`,
};

export async function POST(request: Request) {
  const rate = checkRateLimit(clientIp(request));
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  let mode: Mode;
  let transcript: TranscriptLine[];
  let question = "";

  try {
    const body = (await request.json()) as {
      mode?: unknown;
      transcript?: unknown;
      question?: unknown;
    };
    if (
      body.mode !== "summarize" &&
      body.mode !== "draft" &&
      body.mode !== "ask" &&
      body.mode !== "smart-replies"
    ) {
      throw new Error("bad mode");
    }
    if (!Array.isArray(body.transcript)) throw new Error("bad transcript");
    mode = body.mode;
    transcript = body.transcript
      .filter(
        (l): l is TranscriptLine =>
          !!l &&
          typeof (l as TranscriptLine).sender === "string" &&
          typeof (l as TranscriptLine).text === "string",
      )
      .slice(-MAX_LINES);
    if (typeof body.question === "string") question = body.question.slice(0, 500);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (transcript.length === 0) {
    return NextResponse.json(
      { error: "There are no messages to work with yet." },
      { status: 400 },
    );
  }
  if (mode === "ask" && !question.trim()) {
    return NextResponse.json({ error: "Ask a question first." }, { status: 400 });
  }

  const rendered = transcript
    .map((l) => `${l.sender}: ${l.text.replace(/\s+/g, " ").slice(0, 400)}`)
    .join("\n");

  const prompt =
    mode === "ask"
      ? `--- CONVERSATION TRANSCRIPT ---\n${rendered}\n--- END TRANSCRIPT ---\n\nQuestion about the conversation above: ${question}`
      : `--- CONVERSATION TRANSCRIPT ---\n${rendered}\n--- END TRANSCRIPT ---`;

  const result = await callGemini({
    system: SYSTEM[mode],
    turns: [{ role: "user", content: prompt }],
    maxOutputTokens: mode === "summarize" ? 400 : 200,
    temperature: mode === "summarize" || mode === "ask" ? 0.4 : 0.7,
  });

  if (!result.ok) {
    if (result.status === 503) {
      return NextResponse.json(
        { error: "Assistant is not configured." },
        { status: 503 },
      );
    }
    console.error("chat-assist gemini error", result.detail);
    const quota = result.detail?.includes("RESOURCE_EXHAUSTED");
    return NextResponse.json(
      {
        error: quota
          ? "The AI has hit its daily limit. Try again later."
          : "The assistant is unavailable right now.",
      },
      { status: 502 },
    );
  }

  if (mode === "smart-replies") {
    let replies: string[] = [];
    try {
      const cleaned = result.text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        replies = parsed
          .filter((s): s is string => typeof s === "string")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 3);
      }
    } catch {
      replies = [];
    }
    return NextResponse.json({ replies });
  }

  return NextResponse.json({ result: result.text });
}
