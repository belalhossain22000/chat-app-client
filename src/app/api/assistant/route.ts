import { NextResponse } from "next/server";
import { checkRateLimit } from "./rateLimit";

export const runtime = "nodejs";

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

const MODEL = "gemini-flash-latest";

const SYSTEM_PROMPT = `You are the ChatFlow assistant, a friendly helper on the ChatFlow marketing site.
ChatFlow is a real-time chat web app. Key facts you may share:
- One-to-one and group conversations.
- Real-time delivery over WebSocket (Socket.IO); messages appear instantly, no refresh.
- Optimistic sending with retry on failure; messages are deduplicated by id.
- Smart auto-scroll: follows new messages but never yanks the user down while they read; a "new messages" pill appears instead.
- Cursor-based message history pagination that preserves scroll position.
- Group management: create groups, add/remove members, promote admins, rename, leave.
- Login is just a phone number + name — a new number registers automatically.
- Installable as a PWA; works on desktop, tablet, and mobile.
- Built with Next.js, React, Redux Toolkit + RTK Query, and Socket.IO.
Rules:
- Only answer questions about ChatFlow, its features, or how to use it.
- If asked something unrelated, politely say you can only help with ChatFlow.
- Keep replies short (1-3 sentences), warm, and concrete.
- Never invent features that aren't listed above.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Assistant is not configured." },
      { status: 503 },
    );
  }

  const rate = checkRateLimit(clientIp(request));
  if (!rate.ok) {
    return NextResponse.json(
      { error: "You've asked a lot in a short time. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  let messages: ChatMessage[];
  try {
    const body = (await request.json()) as { messages?: unknown };
    if (!Array.isArray(body.messages)) throw new Error("bad body");
    messages = body.messages
      .slice(-12)
      .filter(
        (m): m is ChatMessage =>
          !!m &&
          typeof (m as ChatMessage).content === "string" &&
          ((m as ChatMessage).role === "user" ||
            (m as ChatMessage).role === "assistant"),
      );
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (messages.length === 0) {
    return NextResponse.json({ error: "No message provided." }, { status: 400 });
  }

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content.slice(0, 2000) }],
  }));

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 500,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      },
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Gemini error", res.status, detail.slice(0, 500));
      return NextResponse.json(
        { error: "The assistant is unavailable right now." },
        { status: 502 },
      );
    }

    const data = await res.json();
    const reply: string =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? "")
        .join("")
        .trim() || "Sorry, I couldn't come up with an answer.";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach the assistant." },
      { status: 502 },
    );
  }
}
