// Lightweight in-memory IP rate limiter for /api/assistant.
// Per serverless instance (resets on cold start) — fine for this scope;
// a shared store (Redis/Upstash) would be the production choice.

interface Bucket {
  minute: { count: number; resetAt: number };
  hour: { count: number; resetAt: number };
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const PER_MINUTE = 10;
const PER_HOUR = 40;

const buckets = new Map<string, Bucket>();

// occasional cleanup so the map doesn't grow unbounded
let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < HOUR) return;
  lastSweep = now;
  for (const [ip, b] of buckets) {
    if (b.hour.resetAt < now) buckets.delete(ip);
  }
}

export function checkRateLimit(ip: string): {
  ok: boolean;
  retryAfter: number;
} {
  const now = Date.now();
  sweep(now);

  let b = buckets.get(ip);
  if (!b) {
    b = {
      minute: { count: 0, resetAt: now + MINUTE },
      hour: { count: 0, resetAt: now + HOUR },
    };
    buckets.set(ip, b);
  }

  if (now >= b.minute.resetAt) {
    b.minute.count = 0;
    b.minute.resetAt = now + MINUTE;
  }
  if (now >= b.hour.resetAt) {
    b.hour.count = 0;
    b.hour.resetAt = now + HOUR;
  }

  if (b.minute.count >= PER_MINUTE) {
    return { ok: false, retryAfter: Math.ceil((b.minute.resetAt - now) / 1000) };
  }
  if (b.hour.count >= PER_HOUR) {
    return { ok: false, retryAfter: Math.ceil((b.hour.resetAt - now) / 1000) };
  }

  b.minute.count++;
  b.hour.count++;
  return { ok: true, retryAfter: 0 };
}
