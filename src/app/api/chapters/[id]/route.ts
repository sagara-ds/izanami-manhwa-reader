import { NextRequest, NextResponse } from "next/server";
import { getChapterListPaginated } from "@/lib/shngm";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const PAGE_MAX = 100;
const PAGE_CAP = 1000;
const ID_RE = /^[0-9a-f-]{8,64}$/i;

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

  // Support both page-based (?page=&limit=) and legacy offset-based (?offset=&limit=) callers.
  const limit = Math.min(Math.max(1, parseInt(qp.get("limit") || "60", 10) || 60), PAGE_MAX);
  let page = Math.min(Math.max(1, parseInt(qp.get("page") || "1", 10) || 1), PAGE_CAP);
  if (qp.get("offset") !== null && qp.get("page") === null) {
    const offset = Math.min(Math.max(0, parseInt(qp.get("offset") || "0", 10) || 0), PAGE_CAP * PAGE_MAX);
    page = Math.floor(offset / limit) + 1;
  }
  const order = qp.get("order") === "asc" ? "asc" : "desc";
  const search = (qp.get("search") ?? qp.get("q") ?? "").slice(0, 100);

  try {
    const { chapters, total, totalPages } = await getChapterListPaginated(id, page, limit, order, search);
    const done = page >= totalPages || chapters.length === 0;

    const res = NextResponse.json({
      chapters,
      done,
      total,
      page,
      totalPages,
    });
    res.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    return res;
  } catch {
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 });
  }
}
