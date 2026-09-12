import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Synopsis, BookmarkButton, ChapterBrowser, ReadButtons } from "@/components/DetailClient";
import { CountryBadge } from "@/components/CountryBadge";
import { getChapterList, getMangaDetail } from "@/lib/shngm";
import { formatCount, safeGenres } from "@/lib/format";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = await getMangaDetail(id);
  const title = detail?.title ?? "Detail Seri";
  return {
    title: `${title} — Izanami Reader`,
    description: detail?.description?.slice(0, 160) ?? `Baca ${title} bahasa Indonesia di Izanami.`,
  };
}

export default async function SeriePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();

  const detail = await getMangaDetail(id);
  if (!detail) notFound();
  const chapters = await getChapterList(id, 50);

  // Sort newest first
  const sortedChapters = [...chapters].sort((a, b) => b.chapter_number - a.chapter_number);

  const genres = safeGenres(detail.taxonomy?.Genre ?? []);
  const type = detail.taxonomy?.Type?.[0]?.name;
  const authors = (detail.taxonomy?.Author ?? []).map((a) => a.name).join(", ");
  const artists = (detail.taxonomy?.Artist ?? []).map((a) => a.name).join(", ");
  const status = detail.status === 1 ? "Ongoing" : "Selesai";
  const synopsis = detail.description || "";

  return (
    <div className="bg-[#09090b] text-white min-h-screen flex flex-col">
      <Nav />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-3xl opacity-[0.15]"
          style={{ backgroundImage: `url(${detail.cover_portrait_url || detail.cover_image_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/50 via-transparent to-[#09090b]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/55 to-transparent" />

        <div className="relative max-w-screen-xl mx-auto px-4 py-8 sm:py-12">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-zinc-500 flex items-center gap-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/explore" className="hover:text-white">Series</Link>
            <span>/</span>
            <span className="text-white truncate max-w-xs">{detail.title}</span>
          </nav>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-7">
            <div className="relative flex-shrink-0 mx-auto sm:mx-0">
              <div className="absolute -inset-2 rounded-3xl bg-[#3b82f6]/15 blur-xl" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={detail.cover_image_url || detail.cover_portrait_url}
                alt={detail.title}
                referrerPolicy="no-referrer"
                className="relative w-28 sm:w-40 md:w-48 rounded-2xl border border-white/10 shadow-2xl shadow-black/70"
              />
              {detail.status === 1 && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-full whitespace-nowrap shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  ONGOING
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-3 text-center sm:text-left">
              {type && (
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                  <span className="px-2 py-0.5 bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30 rounded text-[10px] font-black uppercase tracking-widest">
                    {type}
                  </span>
                </div>
              )}

              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight">
                  {detail.title}
                </h1>
                {detail.alternative_title && (
                  <p className="text-zinc-500 text-xs sm:text-sm mt-1 truncate">{detail.alternative_title}</p>
                )}
              </div>

              {(authors || artists) && (
                <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-zinc-400">
                  {authors && <span>✎ {authors}</span>}
                  {artists && <span>🖌 {artists}</span>}
                </div>
              )}

              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {detail.user_rate ? (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 rounded-full text-xs font-bold">
                    <span aria-hidden="true" className="text-yellow-400 text-[10px]">★</span>
                    {detail.user_rate}
                  </span>
                ) : null}
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${
                  detail.status === 1
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-zinc-800/60 border-zinc-700/40 text-zinc-400"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${detail.status === 1 ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
                  {status}
                </span>
                {chapters.length > 0 && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-zinc-300">
                    <span aria-hidden="true" className="text-[#3b82f6] text-[10px]">▤</span>
                    {chapters.length} Chapter
                  </span>
                )}
                {detail.view_count > 0 && (
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-zinc-300">
                    👁 {formatCount(detail.view_count)}
                  </span>
                )}
                {detail.bookmark_count > 0 && (
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-zinc-300">
                    🔖 {formatCount(detail.bookmark_count)}
                  </span>
                )}
                {detail.release_year && (
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-zinc-300">
                    {detail.release_year}
                  </span>
                )}
                {detail.country_id && (
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-zinc-300">
                    <CountryBadge code={detail.country_id} />
                  </span>
                )}
              </div>

              {genres.length > 0 && (
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                  {genres.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/explore?genre=${encodeURIComponent(g.slug)}`}
                      className="px-2 py-0.5 bg-zinc-800/70 hover:bg-[#3b82f6]/15 hover:text-[#3b82f6] hover:border-[#3b82f6]/30 text-zinc-400 border border-zinc-700/40 rounded-full text-[10px] transition-all"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-0.5">
                <ReadButtons mangaId={id} chapters={sortedChapters} />
                <BookmarkButton mangaId={id} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 pb-10 w-full flex-1 mt-5">
        {synopsis && <Synopsis text={synopsis} />}
        <ChapterBrowser mangaId={id} initialChapters={sortedChapters} totalChapters={chapters.length} />
      </div>

      <Footer />
    </div>
  );
}
