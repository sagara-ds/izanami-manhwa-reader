import { NextRequest, NextResponse } from "next/server";
import { getChapterList } from "@/lib/shngm";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(req.url);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100", 10), 200);

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const allChapters = await getChapterList(id);
    const sorted = [...allChapters].sort((a, b) => b.chapter_number - a.chapter_number);
    const slice = sorted.slice(offset, offset + limit);
    const done = offset + slice.length >= allChapters.length;

    const res = NextResponse.json({
      chapters: slice,
      done,
      total: allChapters.length,
    });
    res.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 });
  }
}
