import Link from "next/link";
import type { MangaItem } from "@/lib/shngm-types";
import { normalizeManga, formatCount } from "@/lib/format";

export function ExploreListCard({ comic }: { comic: MangaItem }) {
  const m = normalizeManga(comic);
  const ongoing = m.status === 1;

  return (
    <Link
      href={`/serie/${m.id}`}
      className="group flex gap-3 sm:gap-4 p-2 rounded-xl border border-transparent hover:bg-white/5 hover:border-zinc-800/60 transition-all"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={m.cover}
        alt={m.title}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="w-24 sm:w-32 shrink-0 aspect-[2/3] rounded-lg object-cover bg-zinc-900"
      />
      <div className="flex flex-col min-w-0 gap-1 py-0.5">
        <p className="text-white text-sm sm:text-lg font-bold leading-snug line-clamp-2 group-hover:text-[#3b82f6] transition-colors">
          {m.title}
        </p>
        {m.chapterNumber != null && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300">
            <span>Chapter {m.chapterNumber}</span>
            <span
              className={`px-2 py-0.5 rounded-lg border text-[10px] sm:text-xs font-semibold ${
                ongoing
                  ? "bg-[#3b82f6]/10 border-[#3b82f6]/40 text-[#3b82f6]"
                  : "bg-zinc-800/60 border-zinc-700/40 text-zinc-400"
              }`}
            >
              {ongoing ? "Ongoing" : "Selesai"}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300">
          {m.rating ? (
            <span className="flex items-center gap-1">
              <span aria-hidden="true" className="text-orange-400">★</span>
              {m.rating}
            </span>
          ) : null}
          {m.views > 0 && (
            <span className="flex items-center gap-1 text-zinc-400">
              <span aria-hidden="true">👁</span>
              {formatCount(m.views)}
            </span>
          )}
          {m.bookmarks > 0 && (
            <span className="flex items-center gap-1 text-zinc-400">
              <span aria-hidden="true" className="text-cyan-400">🔖</span>
              {formatCount(m.bookmarks)}
            </span>
          )}
        </div>
        {comic.description && (
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
            {comic.description.replace(/\s+/g, " ").trim()}
          </p>
        )}
      </div>
    </Link>
  );
}
