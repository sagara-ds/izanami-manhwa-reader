import { NextRequest, NextResponse } from "next/server";
import { getChapterListPaginated } from "@/lib/shngm";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const PAGE_MAX = 100;
const ID_RE = /^[0-9a-f-]{8,64}$/i;
const CURSOR_RE = /^[A-Za-z0-9_=-]{1,128}$/;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(req, { limit: 60, windowS: 60, prefix: "api:chapters" });
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter);

  const { id } = await params;
  const url = new URL(req.url);
  const qp = url.searchParams;

  if (!id || !ID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const limit = Math.min(Math.max(1, parseInt(qp.get("limit") || "60", 10) || 60), PAGE_MAX);
  const cursor = qp.get("cursor")?.trim() ?? "";
  if (cursor && !CURSOR_RE.test(cursor)) {
    return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
  }
  const order = qp.get("order") === "asc" ? "asc" : "desc";
  const search = (qp.get("search") ?? qp.get("q") ?? "").slice(0, 100);

  try {
    const { chapters, hasNext, nextCursor } = await getChapterListPaginated(id, limit, order, search, cursor);

    const res = NextResponse.json({
      chapters,
      done: !hasNext,
      hasNext,
      nextCursor,
    });
    res.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    return res;
  } catch {
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 });
  }
}
