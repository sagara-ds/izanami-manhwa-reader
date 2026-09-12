import { searchManga } from "@/lib/shngm";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
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
