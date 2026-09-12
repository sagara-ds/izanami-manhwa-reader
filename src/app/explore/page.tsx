import { Suspense } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ButtonCorner } from "@/components/ButtonCorner";
import { ComicGrid } from "@/components/ComicGrid";
import { ExploreFilters } from "@/components/ExploreFilters";
import { ExploreListCard } from "@/components/ExploreListCard";
import { ExploreToolbar } from "@/components/ExploreToolbar";
import { getExplore, getGenres } from "@/lib/shngm";
import { safeGenreItems } from "@/lib/format";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jelajahi Komik — Izanami",
  description: "Jelajahi katalog komik trending, rating tertinggi, dan update terbaru di Izanami.",
};

export const revalidate = 120;

type SP = {
  q?: string | string[];
  genre?: string | string[];
  xgenre?: string | string[];
  inc?: string | string[];
  exc?: string | string[];
  format?: string | string[];
  type?: string | string[];
  status?: string | string[];
  author?: string | string[];
  sort?: string | string[];
  order?: string | string[];
  page?: string | string[];
};

function first(v?: string | string[]): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

function allGenres(v?: string | string[]): string[] {
  const raw = Array.isArray(v) ? v : v ? [v] : [];
  return raw
    .flatMap((g) => g.split(","))
    .map((g) => g.trim())
    .filter(Boolean)
    .filter((g, i, a) => a.indexOf(g) === i);
}

function pageHref(args: { q: string; genres: string[]; excludeGenres: string[]; includeMode: string; excludeMode: string; format: string; type: string; status: string; author: string; sort: string; order: string; page: number }): string {
  const qs = new URLSearchParams();
  if (args.q) qs.set("q", args.q);
  for (const g of args.genres) qs.append("genre", g);
  for (const g of args.excludeGenres) qs.append("xgenre", g);
  if (args.includeMode && args.includeMode !== "or") qs.set("inc", args.includeMode);
  if (args.excludeMode && args.excludeMode !== "or") qs.set("exc", args.excludeMode);
  if (args.format && args.format !== "all") qs.set("format", args.format);
  if (args.type) qs.set("type", args.type);
  if (args.status) qs.set("status", args.status);
  if (args.author) qs.set("author", args.author);
  if (args.sort && args.sort !== "latest") qs.set("sort", args.sort);
  if (args.order && args.order !== "desc") qs.set("order", args.order);
  if (args.page > 1) qs.set("page", String(args.page));
  const s = qs.toString();
  return s ? `/explore?${s}` : "/explore";
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const q = first(sp.q).trim();
  const genres = allGenres(sp.genre);
  const excludeGenres = allGenres(sp.xgenre);
  const includeMode = first(sp.inc) === "and" ? "and" : "or";
  const excludeMode = first(sp.exc) === "and" ? "and" : "or";
  const format = first(sp.format);
  const type = first(sp.type);
  const status = first(sp.status);
  const author = first(sp.author).trim();
  const sortRaw = first(sp.sort);
  const sort: "latest" | "popularity" | "rating" | "az" = ["latest", "popularity", "rating", "az"].includes(sortRaw) ? (sortRaw as "latest" | "popularity" | "rating" | "az") : "latest";
  const order: "asc" | "desc" = first(sp.order) === "asc" ? "asc" : "desc";
  const page = Math.max(1, parseInt(first(sp.page) || "1", 10) || 1);

  const [res, all] = await Promise.all([
    getExplore({
      page,
      pageSize: 24,
      genres,
      status,
      format,
      type,
      author,
      sort: sort === "az" ? "latest" : sort,
      sortOrder: sort === "az" ? "desc" : order,
      keyword: q,
      includeMode,
      excludeMode,
      excludeGenres,
    }),
    getGenres(),
  ]);

  const items = sort === "az"
    ? [...res.items].sort((a, b) =>
        order === "asc"
          ? a.title.localeCompare(b.title, "id")
          : b.title.localeCompare(a.title, "id")
      )
    : res.items;

  const safe = safeGenreItems(all);
  const count = res.meta?.total_record ?? res.items.length;
  const totalPage = res.meta?.total_page;
  const hasFilters = q || genres.length > 0 || excludeGenres.length > 0 || format || type || status || author;

  const base = { q, genres, excludeGenres, includeMode, excludeMode, format, type, status, author, sort, order };
  const prevHref = page > 1 ? pageHref({ ...base, page: page - 1 }) : null;
  const nextHref =
    totalPage === undefined || page < totalPage
      ? pageHref({ ...base, page: page + 1 })
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-white">
      <Nav />

      <main className="max-w-screen-xl mx-auto px-4 pt-0 pb-5 w-full flex-1">
        <Suspense>
          <ExploreFilters genres={safe}>
            <div className="sticky top-[117px] lg:top-[60px] z-20 bg-[#09090b]/95 backdrop-blur-md -mx-1 px-1 py-2">
              <Suspense>
                <ExploreToolbar />
              </Suspense>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-zinc-500">
                {count > 0 ? `${count.toLocaleString("id-ID")} judul` : "Jelajahi"}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-600">
                <p className="text-sm text-zinc-500">Tidak ada hasil ditemukan</p>
                {hasFilters && (
                  <Link href="/explore" className="text-xs text-[#3b82f6] hover:underline font-semibold">
                    Reset semua filter
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div id="explore-grid">
                  <ComicGrid comics={items} />
                </div>
                <div id="explore-list" className="hidden flex-col gap-4">
                  {items.map((m) => (
                    <ExploreListCard key={m.manga_id} comic={m} />
                  ))}
                </div>
              </>
            )}

          {items.length > 0 && (
            <div className="flex justify-center items-center gap-1.5 flex-wrap">
              {prevHref ? (
                <Link
                  href={prevHref}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#18181b] border border-zinc-700/50 text-zinc-300 text-sm hover:bg-[#3b82f6] hover:border-[#3b82f6] hover:text-white transition-all"
                >
                  ←
                </Link>
              ) : (
                <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#18181b] border border-zinc-700/50 text-sm opacity-30">
                  ←
                </span>
              )}
              <span className="text-xs text-zinc-500 tabular-nums px-2">
                {page}
                {totalPage ? ` / ${totalPage}` : ""}
              </span>
              {nextHref ? (
                <Link
                  href={nextHref}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#18181b] border border-zinc-700/50 text-zinc-300 text-sm hover:bg-[#3b82f6] hover:border-[#3b82f6] hover:text-white transition-all"
                >
                  →
                </Link>
              ) : (
                <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#18181b] border border-zinc-700/50 text-sm opacity-30">
                  →
                </span>
              )}
            </div>
          )}
          </ExploreFilters>
        </Suspense>
      </main>

      <ButtonCorner />
      <Footer />
    </div>
  );
}
