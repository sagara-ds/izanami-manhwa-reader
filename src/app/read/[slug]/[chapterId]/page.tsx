import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { ReaderView } from "./ReaderView";
import { chapterApiUrl, getChapterImages } from "@/lib/shinigami";
import { MOCK_CHAPTER_IMAGES } from "@/lib/mock-data";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; chapterId: string }>;
}): Promise<Metadata> {
  const { slug, chapterId } = await params;
  const pretty = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    title: `${pretty} Chapter ${chapterId} — Izanami Reader`,
    description: `Baca ${pretty} chapter ${chapterId} bahasa Indonesia dengan vertical scroll di Izanami.`,
  };
}

export default async function ReadPage({
  params,
}: {
  params: Promise<{ slug: string; chapterId: string }>;
}) {
  const { slug, chapterId } = await params;

  if (!slug || !chapterId) notFound();

  // Try live API: chapterApiUrl = SITE/series/{slug}/chapter/{id}/
  const apiUrl = chapterApiUrl(slug, chapterId);
  const liveImages = await getChapterImages(apiUrl);

  const images = liveImages.length > 0 ? liveImages : MOCK_CHAPTER_IMAGES;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const chapterLabel = `Ch ${chapterId}`;
  const serieHref = `/serie/${slug}`;

  return (
    <div className="min-h-screen bg-black">
      <nav aria-label="Kembali" className="bg-[#0d0d0d] border-b border-[#27272a] px-3 sm:px-4 h-14 flex items-center gap-3 max-w-none">
        <Link
          href={serieHref}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-zinc-200 hover:bg-white/10 text-sm"
          aria-label="Kembali ke detail"
        >
          ←
        </Link>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate">{title}</p>
          <p className="text-[11px] text-zinc-500">{chapterLabel}</p>
        </div>
      </nav>

      <main aria-label="Pembaca Komik" role="application">
        <ReaderView
          title={title}
          chapterLabel={chapterLabel}
          serieHref={serieHref}
          images={images}
        />
      </main>

      <Nav />
    </div>
  );
}
