import { NextResponse } from "next/server";
import { checkRateLimit } from "./rateLimit";
import { callGemini, type GeminiTurn } from "@/lib/gemini";

export const runtime = "nodejs";

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

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

export async function POST(request: Request) {
  const rate = checkRateLimit(clientIp(request));
  if (!rate.ok) {
    return NextResponse.json(
      { error: "You've asked a lot in a short time. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  let turns: GeminiTurn[];
  try {
    const body = (await request.json()) as { messages?: unknown };
    if (!Array.isArray(body.messages)) throw new Error("bad body");
    turns = body.messages
      .slice(-12)
      .filter(
        (m): m is GeminiTurn =>
          !!m &&
          typeof (m as GeminiTurn).content === "string" &&
          ((m as GeminiTurn).role === "user" ||
            (m as GeminiTurn).role === "assistant"),
      );
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (turns.length === 0) {
    return NextResponse.json({ error: "No message provided." }, { status: 400 });
  }

  const result = await callGemini({ system: SYSTEM_PROMPT, turns });

  if (!result.ok) {
    if (result.status === 503) {
      return NextResponse.json(
        { error: "Assistant is not configured." },
        { status: 503 },
      );
    }
    console.error("assistant gemini error", result.detail);
    const quota = result.detail?.includes("RESOURCE_EXHAUSTED");
    return NextResponse.json(
      {
        error: quota
          ? "The assistant has hit its daily limit. Please try again later."
          : "The assistant is unavailable right now.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ reply: result.text });
}
