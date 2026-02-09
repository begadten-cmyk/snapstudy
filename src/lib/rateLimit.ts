// Sliding-window rate limiter (in-memory, per-process)

const windowMs = 60_000; // 1 minute
const maxRequests = 5;

const hits = new Map<string, number[]>();

/** Prune entries older than the window. Runs lazily on each check. */
function prune(ip: string, now: number) {
  const timestamps = hits.get(ip);
  if (!timestamps) return;
  const cutoff = now - windowMs;
  // Find first index within window
  let i = 0;
  while (i < timestamps.length && timestamps[i] <= cutoff) i++;
  if (i > 0) timestamps.splice(0, i);
  if (timestamps.length === 0) hits.delete(ip);
}

/**
 * Returns true if the request is allowed, false if rate-limited.
 * Automatically records the hit when allowed.
 */
export function rateLimit(ip: string): boolean {
  const now = Date.now();
  prune(ip, now);

  const timestamps = hits.get(ip);
  if (timestamps && timestamps.length >= maxRequests) {
    return false;
  }

  if (timestamps) {
    timestamps.push(now);
  } else {
    hits.set(ip, [now]);
  }
  return true;
}

/** Extract client IP from request headers. */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can be comma-separated; take the first (client) IP
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
}
