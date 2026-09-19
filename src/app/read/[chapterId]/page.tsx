import { notFound } from "next/navigation";
import { ReaderView } from "./ReaderView";
import { HistoryRecorder } from "@/components/DetailClient";
import { chapterImageUrls, getChapterDetail, getMangaDetail } from "@/lib/shngm";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}): Promise<Metadata> {
  const { chapterId } = await params;
  const ch = await getChapterDetail(chapterId);
  if (!ch) return { title: "Reader — Izanami", robots: { index: false, follow: false } };
  const detail = await getMangaDetail(ch.manga_id);
  const title = detail?.title ?? "Komik";
  return {
    title: `${title} Chapter ${ch.chapter_number} — Izanami Reader`,
    description: `Baca ${title} chapter ${ch.chapter_number} bahasa Indonesia dengan vertical scroll di Izanami.`,
    robots: { index: false, follow: false },
  };
}

export default async function ReadPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  if (!chapterId) notFound();

  const ch = await getChapterDetail(chapterId);
  if (!ch) notFound();
  const detail = await getMangaDetail(ch.manga_id);
  const images = chapterImageUrls(ch);

  const title = detail?.title ?? "Komik";

  return (
    <div className="min-h-screen bg-black">
      <main aria-label="Pembaca Komik" role="application">
        <HistoryRecorder
          mangaId={ch.manga_id}
          cover={detail?.cover_image_url || detail?.cover_portrait_url || ""}
          title={title}
          chapterId={ch.chapter_id}
          chapterNumber={ch.chapter_number}
        />
        <ReaderView
          title={title}
          chapterNumber={ch.chapter_number}
          images={images}
          prevHref={ch.prev_chapter_id ? `/read/${ch.prev_chapter_id}` : null}
          nextHref={ch.next_chapter_id ? `/read/${ch.next_chapter_id}` : null}
          mangaId={ch.manga_id}
          currentChapterId={ch.chapter_id}
        />
      </main>
    </div>
  );
}
