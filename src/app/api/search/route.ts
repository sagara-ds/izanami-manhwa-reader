import { searchManga } from "@/lib/shngm";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const rl = checkRateLimit(request, { limit: 30, windowS: 60, prefix: "api:search" });
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter);

  const raw = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  const q = raw.slice(0, 100);
  if (q.length < 2) return Response.json({ items: [] });
  const res = await searchManga(q, 1);
  const items = res.items.slice(0, 6).map((m) => ({
    manga_id: m.manga_id,
    title: m.title,
    subtitle:
      (m.taxonomy?.Author ?? []).map((a) => a.name).join(", ") ||
      m.alternative_title ||
      "",
    cover: m.cover_image_url || m.cover_portrait_url || "",
  }));
  return Response.json({ items });
}
