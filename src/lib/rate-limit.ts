interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// Module-level map — persists across warm serverless invocations.
// For multi-instance deployments, replace with Upstash Redis.
const store = new Map<string, RateLimitRecord>();

// Clean up expired entries periodically to avoid memory growth
function cleanup() {
  const now = Date.now();
  for (const [key, record] of store) {
    if (now > record.resetAt) store.delete(key);
  }
}

let lastCleanup = Date.now();

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();

  if (now - lastCleanup > 60_000) {
    cleanup();
    lastCleanup = now;
  }

  const record = store.get(key);

  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}
