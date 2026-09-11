import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ComicGrid } from "@/components/ComicGrid";
import {
  chapterHref,
  getComicFull,
  lastSegment,
  seriesApiUrl,
} from "@/lib/shinigami";
import {
  MOCK_RECOMMENDATIONS,
  MOCK_SERIE_DETAIL,
  MOCK_SERIE_META,
} from "@/lib/mock-data";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pretty = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    title: `${pretty} — Izanami Reader`,
    description: `Baca komik ${pretty} bahasa Indonesia gratis dan update terbaru di Izanami.`,
  };
}

export default async function SeriePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) notFound();

  // Try live API
  const url = seriesApiUrl(slug);
  const live = await getComicFull(url);

  // Fallback mock
  const fallbackComic =
    MOCK_RECOMMENDATIONS.find((c) => lastSegment(c.url) === slug) ??
    MOCK_SERIE_META;
  const comic = live?.comicModel ?? {
    ...fallbackComic,
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
  };
  const detail = live?.comicDetailModel ?? MOCK_SERIE_DETAIL;

  const chapters = detail.chapterList ?? [];
  const firstChapter = chapters[chapters.length - 1];
  const latestChapter = chapters[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d]">
      <Nav />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#71717a] flex items-center gap-2">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span>/</span>
          <Link href="/explore" className="hover:text-white">
            Series
          </Link>
          <span>/</span>
          <span className="text-[#f4f4f5] truncate max-w-xs">{comic.title}</span>
        </nav>

        {/* Hero Serie detail */}
        <section aria-label="Informasi Seri" className="bg-[#1a1a1a] border border-[#27272a] rounded-2xl p-4 sm:p-6 mb-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Cover */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="relative aspect-[3/4.2] w-full max-w-[240px] rounded-xl overflow-hidden border border-[#27272a] bg-[#141414] shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={comic.cover}
                  alt={comic.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm border border-white/10 text-xs font-bold text-amber-400 px-2 py-0.5 rounded shadow">
                  ★ {comic.rating ? comic.rating.toFixed(1) : "4.9"}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full max-w-[240px] mt-4 flex flex-col gap-2">
                {firstChapter && (
                  <Link
                    href={chapterHref(slug, firstChapter.url)}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white text-xs font-bold text-center shadow-lg hover:opacity-95 transition-opacity"
                  >
                    Baca Awal (Ch. 1)
                  </Link>
                )}
                {latestChapter && (
                  <Link
                    href={chapterHref(slug, latestChapter.url)}
                    className="w-full py-2 rounded-lg bg-[#27272a] text-[#f4f4f5] text-xs font-semibold text-center border border-[#3f3f46] hover:bg-[#3f3f46] transition-colors"
                  >
                    Chapter Terbaru
                  </Link>
                )}
              </div>
            </div>

            {/* Info details */}
            <div className="md:col-span-3 flex flex-col justify-between">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                  {comic.title}
                </h1>

                {/* Meta details chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {detail.detailList?.map((d, i) => (
                    <div
                      key={i}
                      className="bg-[#1f1f1f] border border-[#27272a] px-2.5 py-1 rounded-md text-[11px] text-[#a1a1aa]"
                    >
                      <span className="text-[#71717a] font-medium mr-1">
                        {d.name}:
                      </span>
                      <span className="text-[#f4f4f5] font-semibold">
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Synopsis */}
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] mb-1.5">
                    Sinopsis
                  </h2>
                  <p className="text-xs sm:text-sm text-[#d4d4d8] leading-relaxed whitespace-pre-line bg-[#141414] p-3.5 rounded-lg border border-[#27272a]/60">
                    {detail.synopsis || "Sinopsis belum tersedia."}
                  </p>
                </div>
              </div>

              {/* Bookmark & share tools */}
              <div className="flex items-center gap-3 pt-3 border-t border-[#27272a] text-xs text-[#a1a1aa]">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded bg-[#1f1f1f] border border-[#27272a] hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <span aria-hidden="true">★</span> Favorit
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded bg-[#1f1f1f] border border-[#27272a] hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <span aria-hidden="true">↗</span> Bagikan
                </button>
                <span className="text-[11px] text-[#52525b] ml-auto">
                  {chapters.length} Chapter tersedia
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter List Section */}
        <section aria-label="Daftar Chapter" className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span
                className="w-1 h-4 rounded-full bg-[#7c3aed]"
                aria-hidden="true"
              />
              Daftar Chapter
            </h2>
            <span className="text-xs text-[#71717a]">Urutan: Terkini</span>
          </div>

          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-xl overflow-hidden divide-y divide-[#27272a]">
            {chapters.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#71717a]">
                Belum ada chapter yang diunggah.
              </div>
            ) : (
              chapters.map((ch, idx) => (
                <Link
                  key={ch.url || idx}
                  href={chapterHref(slug, ch.url)}
                  className="px-4 py-3 flex items-center justify-between text-xs hover:bg-[#1f1f1f] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-[#71717a] w-8">
                      #{chapters.length - idx}
                    </span>
                    <span className="font-medium text-[#f4f4f5] group-hover:text-[#06b6d4] transition-colors">
                      {ch.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#71717a]">
                    <span>{ch.releaseDate || "Baru saja"}</span>
                    <span className="text-[#52525b] group-hover:text-white transition-colors" aria-hidden="true">
                      →
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Related comics */}
        {detail.related && detail.related.length > 0 && (
          <section aria-label="Komik Terkait" className="mb-8">
            <h2 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span
                className="w-1 h-4 rounded-full bg-[#06b6d4]"
                aria-hidden="true"
              />
              Komik Terkait
            </h2>
            <ComicGrid comics={detail.related.slice(0, 6)} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
