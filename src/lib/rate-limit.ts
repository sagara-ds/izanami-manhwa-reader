/**
 * Minimal in-memory sliding-window rate limiter for App Router route handlers.
 *
 * Good enough as a first line of defense on a single Node instance.
 * On Vercel serverless each isolate has its own map, so for production
 * abuse prevention also enable Vercel Firewall / Attack Challenge Mode
 * or swap this for Upstash Redis.
 */

type Bucket = { count: number; resetAt: number };

const store = (() => {
  const g = globalThis as unknown as { __izanamiRl?: Map<string, Bucket> };
  if (!g.__izanamiRl) g.__izanamiRl = new Map<string, Bucket>();
  return g.__izanamiRl;
})();

function getIp(req: Request): string {
  const h = (name: string) => req.headers.get(name) ?? "";
  const xff = h("x-forwarded-for").split(",")[0]?.trim();
  if (xff) return xff.slice(0, 64);
  const xr = h("x-real-ip").trim();
  if (xr) return xr.slice(0, 64);
  return "unknown";
}

export interface RateLimitOpts {
  /** max requests per window */
  limit: number;
  /** window in seconds */
  windowS: number;
  /** route prefix to isolate buckets, e.g. "api:search" */
  prefix: string;
}

export function checkRateLimit(
  req: Request,
  { limit, windowS, prefix }: RateLimitOpts,
): { allowed: boolean; retryAfter: number; remaining: number } {
  const now = Date.now();
  const windowMs = windowS * 1000;
  const key = `${prefix}:${getIp(req)}`;

  // opportunistic cleanup (1% chance)
  if (Math.random() < 0.01) {
    for (const [k, b] of store) if (b.resetAt <= now) store.delete(k);
  }

  const cur = store.get(key);
  if (!cur || cur.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0, remaining: limit - 1 };
  }
  if (cur.count < limit) {
    cur.count += 1;
    return { allowed: true, retryAfter: 0, remaining: limit - cur.count };
  }
  return {
    allowed: false,
    retryAfter: Math.ceil((cur.resetAt - now) / 1000),
    remaining: 0,
  };
}

export function rateLimitResponse(retryAfter: number) {
  return Response.json(
    { error: "Terlalu banyak permintaan. Coba lagi sebentar." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "Cache-Control": "no-store",
      },
    },
  );
}
