import Link from "next/link";
import type { MangaItem } from "@/lib/shngm-types";
import { normalizeManga, formatCount } from "@/lib/format";
import { CountryBadge } from "./CountryBadge";

export function CardSlider({ manga, rank }: { manga: MangaItem; rank?: number }) {
  const m = normalizeManga(manga);
  return (
    <Link
      href={`/serie/${m.id}`}
      className="group relative flex-shrink-0 w-[124px] sm:w-[140px] md:w-[156px] rounded-xl overflow-hidden bg-[#141417] border border-zinc-800/60 hover:border-[#3b82f6]/50 hover:shadow-lg hover:shadow-[#3b82f6]/10 transition-all duration-300"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={m.portrait || m.cover}
          alt={m.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
        {rank != null && (
          <span className="absolute top-0 left-0 px-2 py-0.5 bg-[#3b82f6] text-white text-[11px] font-black rounded-br-xl leading-tight">
            #{rank}
          </span>
        )}
        <CountryBadge code={m.country} className="absolute top-1.5 right-1.5" />
        {m.rating ? (
          <span className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm">
            <span aria-hidden="true" className="text-yellow-400 text-[9px]">★</span>
            <span className="text-white text-[9px] font-bold leading-none">{m.rating}</span>
          </span>
        ) : null}
        {m.chapterNumber != null && (
          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-[#3b82f6]/90 backdrop-blur-sm text-white text-[9px] font-black leading-none">
            Ch {m.chapterNumber}
          </span>
        )}
      </div>
      <div className="p-2 flex flex-col gap-0.5">
        <p className="text-white text-[11px] sm:text-xs font-semibold line-clamp-2 leading-snug group-hover:text-[#3b82f6] transition-colors">
          {m.title}
        </p>
        {m.views > 0 && (
          <p className="text-zinc-500 text-[10px] leading-none">{formatCount(m.views)} views</p>
        )}
      </div>
    </Link>
  );
}

export function Rail({ items, rank = false }: { items: MangaItem[]; rank?: boolean }) {
  if (!items.length) return <p className="text-xs text-zinc-600 py-4">Belum ada data.</p>;
  return (
    <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
      {items.map((m, i) => (
        <CardSlider key={m.manga_id} manga={m} rank={rank ? i + 1 : undefined} />
      ))}
    </div>
  );
}
