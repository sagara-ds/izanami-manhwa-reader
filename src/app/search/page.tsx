import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ComicGrid } from "@/components/ComicGrid";
import { searchManga } from "@/lib/shngm";
import { CompassIcon, SearchIcon } from "@/components/icons";
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

  const res = q ? await searchManga(q, page) : null;
  const comics = res?.items ?? [];
  const totalPage = res?.meta?.total_page;

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b]">
      <Nav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-2xl font-extrabold text-white tracking-tight mb-4 flex items-center gap-2.5">
          <span className="w-1 h-6 rounded-full bg-[#3b82f6]" aria-hidden="true" />
          <CompassIcon className="w-5 h-5 text-[#3b82f6]" />
          {q ? `Hasil: “${q}”` : "Cari Komik"}
        </h1>

        <form action="/search" method="GET" className="relative mb-8 max-w-xl">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Ketik judul… misal: Demonic Emperor"
            className="w-full bg-[#141417] border border-zinc-800 focus:border-[#3b82f6] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
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
              {res?.meta?.total_record ?? comics.length} hasil ditemukan.
            </p>
            <ComicGrid comics={comics} />
            <nav aria-label="Halaman" className="mt-8 flex items-center justify-center gap-3">
              {page > 1 ? (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}
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
                {totalPage ? ` / ${totalPage}` : ""}
              </span>
              {totalPage === undefined || page < totalPage ? (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}
                  className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#27272a] text-xs font-semibold text-[#f4f4f5] hover:border-[#3f3f46]"
                >
                  Berikutnya →
                </Link>
              ) : (
                <span className="px-4 py-2 rounded-lg bg-[#141414] border border-[#1f1f1f] text-xs text-[#52525b] cursor-not-allowed">
                  Berikutnya →
                </span>
              )}
            </nav>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
