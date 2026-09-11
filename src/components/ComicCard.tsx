import Link from "next/link";
import type { EnrichedComic } from "@/lib/types";
import { seriesHref } from "@/lib/shinigami";

export function ComicCard({
  comic,
  priority = false,
}: {
  comic: EnrichedComic & { views?: string };
  priority?: boolean;
}) {
  const badgeGenre = comic.comicType
    ? comic.comicType.toUpperCase()
    : comic.genres?.[0] ?? "MANGA";

  const views = comic.views ?? "850K";
  const rating = (comic.rating && comic.rating > 0 ? comic.rating : 4.8).toFixed(1);

  return (
    <article className="group">
      <Link
        href={seriesHref(comic.url)}
        className="manga-card block bg-[#1f1f1f] border border-[#27272a] rounded-xl overflow-hidden relative cursor-pointer"
        aria-label={comic.title}
      >
        {/* Cover image container (aspect 3:4.2) */}
        <div className="relative aspect-[3/4.2] w-full overflow-hidden bg-[#18181b]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={comic.cover}
            alt={comic.title}
            loading={priority ? "eager" : "lazy"}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter contrast-[1.03] saturate-[0.95] group-hover:scale-105 transition-transform duration-300"
          />

          {/* Rating overlay badge top-right */}
          <div className="absolute top-1.5 right-1.5 bg-black/75 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-amber-400 px-1.5 py-0.5 rounded flex items-center gap-1 shadow">
            <span aria-hidden="true">★</span>
            <span>{rating}</span>
          </div>

          {/* Type / Genre badge top-left */}
          <div className="absolute top-1.5 left-1.5 bg-[#7c3aed]/85 backdrop-blur-sm text-[9px] font-extrabold uppercase tracking-wider text-white px-1.5 py-0.5 rounded shadow">
            {badgeGenre}
          </div>
        </div>

        {/* Info footer */}
        <div className="p-2 sm:p-2.5">
          <h3
            title={comic.title}
            className="font-display font-bold text-xs text-[#f4f4f5] leading-tight line-clamp-1 group-hover:text-white"
          >
            {comic.title}
          </h3>

          <div className="mt-1 flex items-center justify-between text-[10px] text-[#71717a]">
            <span className="truncate max-w-[65%] text-[#a1a1aa]">
              {comic.latestChapter || "Ch. Terkini"}
            </span>
            <span className="font-medium flex items-center gap-0.5">
              <span aria-hidden="true">👁</span>
              {views}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
