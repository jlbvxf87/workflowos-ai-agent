// In-memory rate limiter for /api/ask.
//
// Constraints on a Vercel Function are real: each invocation is a fresh warm
// container (or cold), and there's no cross-instance shared memory. This means
// the limiter is best-effort — burst traffic across regions could exceed the
// nominal budget. For a portfolio demo that's acceptable; if the app ever
// takes off we swap to Upstash Redis.
//
// Two orthogonal caps:
//   1. Per-IP: N requests per hour, keyed by x-forwarded-for
//   2. Global: N requests per hour, one shared bucket
// The global cap is the real cost brake — even if every IP hits its own cap,
// a wide-net attack can't blow past the global ceiling.

const HOUR_MS = 60 * 60 * 1000;

const PER_IP_LIMIT = 3;
const GLOBAL_LIMIT = 40;

type Bucket = { count: number; resetAt: number };

const ipBuckets = new Map<string, Bucket>();
let globalBucket: Bucket = { count: 0, resetAt: Date.now() + HOUR_MS };

function tick(bucket: Bucket): Bucket {
  if (Date.now() >= bucket.resetAt) {
    return { count: 0, resetAt: Date.now() + HOUR_MS };
  }
  return bucket;
}

export type LimitVerdict =
  | { ok: true }
  | { ok: false; reason: "per-ip" | "global"; retryAfterSec: number };

export function checkLimits(ip: string): LimitVerdict {
  globalBucket = tick(globalBucket);
  if (globalBucket.count >= GLOBAL_LIMIT) {
    return {
      ok: false,
      reason: "global",
      retryAfterSec: Math.max(1, Math.ceil((globalBucket.resetAt - Date.now()) / 1000)),
    };
  }

  const existing = ipBuckets.get(ip);
  const ipBucket = existing ? tick(existing) : { count: 0, resetAt: Date.now() + HOUR_MS };
  if (ipBucket.count >= PER_IP_LIMIT) {
    ipBuckets.set(ip, ipBucket);
    return {
      ok: false,
      reason: "per-ip",
      retryAfterSec: Math.max(1, Math.ceil((ipBucket.resetAt - Date.now()) / 1000)),
    };
  }

  ipBucket.count += 1;
  globalBucket.count += 1;
  ipBuckets.set(ip, ipBucket);

  // Occasional GC of expired IP buckets so the Map doesn't grow forever.
  if (ipBuckets.size > 500) {
    const now = Date.now();
    for (const [key, b] of ipBuckets) {
      if (now >= b.resetAt) ipBuckets.delete(key);
    }
  }

  return { ok: true };
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
