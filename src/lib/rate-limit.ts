import { headers } from "next/headers";

const buckets = new Map<string, { count: number; resetAt: number }>();

/**
 * In-memory sliding-window limiter. Per-server-instance only (resets on
 * restart, not shared across instances) — sufficient for this single-instance
 * deployment; swap for a shared store (e.g. Upstash) if scaled horizontally.
 */
export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}
