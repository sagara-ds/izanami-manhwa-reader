import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ComicGrid } from "@/components/ComicGrid";
import { searchComics } from "@/lib/shinigami";
import { MOCK_RECOMMENDATIONS } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cari Komik — Izanami",
  description: "Cari judul manga, manhwa, dan manhua berbahasa Indonesia di Izanami.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const live = q ? await searchComics(q, page) : null;

  const comics =
    live && live.length > 0
      ? live.map((c) => ({ ...c, views: "850K" }))
      : q
        ? MOCK_RECOMMENDATIONS.filter((c) =>
            c.title.toLowerCase().includes(q.toLowerCase()),
          )
        : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d]">
      <Nav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-2xl font-extrabold text-white tracking-tight mb-4 flex items-center gap-2.5">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-[#7c3aed] to-[#06b6d4]" aria-hidden="true" />
          {q ? `Hasil: “${q}”` : "Cari Komik"}
        </h1>

        {/* Search form (also usable mobile) */}
        <form action="/search" method="GET" className="relative mb-8 max-w-xl">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Ketik judul… misal: Solo Leveling"
            className="w-full bg-[#1a1a1a] border border-[#27272a] focus:border-[#7c3aed] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#f4f4f5] placeholder-[#52525b] outline-none"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] text-sm" aria-hidden="true">
            🔍
          </span>
        </form>

        {!q ? (
          <p className="text-xs text-[#71717a]">
            Ketik kata kunci di atas untuk mencari di katalog Shinigami.
          </p>
        ) : comics.length === 0 ? (
          <p className="text-xs text-[#71717a]">
            Tidak ada hasil untuk “{q}”. Coba kata kunci lain.
          </p>
        ) : (
          <>
            <p className="text-xs text-[#71717a] mb-4">
              {comics.length} hasil ditemukan.
            </p>
            <ComicGrid comics={comics} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
