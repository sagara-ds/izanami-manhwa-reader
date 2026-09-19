import { NextResponse } from "next/server";
import {
  getGenres,
  getHomeCompleted,
  getHomeRecommended,
  getHomeUpdates,
} from "@/lib/shngm";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** Batched homepage payload for CSR sections (hero + sidebar stay SSR). */
export async function GET(req: Request) {
  // Heavy fan-out (9 upstream calls) — stricter bucket.
  const rl = checkRateLimit(req, { limit: 20, windowS: 60, prefix: "api:homepage" });
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter);
  const [manhwa, manga, manhua, completed, updAll, updManhwa, updManga, updManhua, genres] =
    await Promise.all([
      getHomeRecommended("manhwa", 12),
      getHomeRecommended("manga", 12),
      getHomeRecommended("manhua", 12),
      getHomeCompleted(12),
      getHomeUpdates("all", 18),
      getHomeUpdates("manhwa", 18),
      getHomeUpdates("manga", 18),
      getHomeUpdates("manhua", 18),
      getGenres().catch(() => []),
    ]);

  const res = NextResponse.json({
    recommendations: { manhwa, manga, manhua },
    completed,
    updates: { all: updAll, manhwa: updManhwa, manga: updManga, manhua: updManhua },
    genres,
  });
  res.headers.set("Cache-Control", "public, max-age=120, stale-while-revalidate=300");
  return res;
}
