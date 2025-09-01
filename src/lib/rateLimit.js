// src/lib/rateLimit.js
const buckets = new Map();
const WINDOW = 60_000; // 60s
const CAP = 30;        // 30 req/min per key

export function rateLimit(key) {
  const now = Date.now();
  const b = buckets.get(key) || { tokens: CAP, ts: now };
  const elapsed = now - b.ts;
  const refill = Math.floor(elapsed / WINDOW) * CAP;
  b.tokens = Math.min(CAP, b.tokens + refill);
  b.ts = refill ? now : b.ts;

  if (b.tokens <= 0) {
    buckets.set(key, b);
    return { allowed: false, retryAfter: Math.ceil((WINDOW - (now - b.ts)) / 1000) };
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return { allowed: true };
}
