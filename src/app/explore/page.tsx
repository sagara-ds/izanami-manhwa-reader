import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ComicGrid } from "@/components/ComicGrid";
import { getFilter, type FilterKind } from "@/lib/shinigami";
import { MOCK_POPULAR_ALL, MOCK_POPULAR_WEEKLY } from "@/lib/mock-data";
import type { EnrichedComic } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jelajahi Komik — Izanami",
  description: "Jelajahi katalog komik trending, rating tertinggi, dan update terbaru di Izanami.",
};

export const revalidate = 180;

const SORTS: { id: FilterKind; label: string }[] = [
  { id: "trending", label: "Trending" },
  { id: "rating", label: "Rating" },
  { id: "views", label: "Terbanyak Dilihat" },
  { id: "latest", label: "Update Terbaru" },
  { id: "new", label: "Baru Rilis" },
  { id: "az", label: "A-Z" },
];

const VALID_SORTS = new Set(SORTS.map((s) => s.id));

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const sort: FilterKind = VALID_SORTS.has(sp.sort as FilterKind)
    ? (sp.sort as FilterKind)
    : "trending";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const live = await getFilter(sort, page);

  let comics: (EnrichedComic & { views?: string })[] =
    page === 1 ? MOCK_POPULAR_ALL : MOCK_POPULAR_WEEKLY;
  if (live && live.length > 0) {
    comics = live.map((c) => ({ ...c, views: "1.2M" }));
  }

  const prevHref = page > 1 ? `/explore?sort=${sort}&page=${page - 1}` : null;
  const nextHref = `/explore?sort=${sort}&page=${page + 1}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d]">
      <Nav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-2xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-2.5">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-[#7c3aed] to-[#06b6d4]" aria-hidden="true" />
          Jelajahi Katalog
        </h1>
        <p className="text-xs text-[#71717a] mb-6">
          Filter katalog dari API Shinigami — trending, rating, dan update terbaru.
        </p>

        {/* Sort filter pills */}
        <nav aria-label="Urutkan" className="flex flex-wrap gap-2 mb-6">
          {SORTS.map((s) => {
            const active = sort === s.id;
            return (
              <Link
                key={s.id}
                href={`/explore?sort=${s.id}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  active
                    ? "bg-[#7c3aed]/20 text-[#ddd6fe] border border-[#7c3aed]/50 shadow-[0_0_12px_rgba(124,58,237,0.25)]"
                    : "bg-[#1a1a1a] text-[#a1a1aa] border border-[#27272a] hover:text-white hover:border-[#3f3f46]"
                }`}
              >
                {s.label}
              </Link>
            );
          })}
        </nav>

        <ComicGrid comics={comics} />

        {/* Pagination */}
        <nav aria-label="Halaman" className="mt-8 flex items-center justify-center gap-3">
          {prevHref ? (
            <Link
              href={prevHref}
              className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#27272a] text-xs font-semibold text-[#f4f4f5] hover:border-[#3f3f46]"
            >
              ← Sebelumnya
            </Link>
          ) : (
            <span className="px-4 py-2 rounded-lg bg-[#141414] border border-[#1f1f1f] text-xs text-[#52525b] cursor-not-allowed">
              ← Sebelumnya
            </span>
          )}
          <span className="text-xs text-[#71717a] tabular-nums">
            Halaman {page}
          </span>
          <Link
            href={nextHref}
            className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#27272a] text-xs font-semibold text-[#f4f4f5] hover:border-[#3f3f46]"
          >
            Berikutnya →
          </Link>
        </nav>
      </main>

      <Footer />
    </div>
  );
}
