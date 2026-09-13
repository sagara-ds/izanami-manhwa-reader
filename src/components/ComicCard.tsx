"use client";

import Link from "next/link";
import type { AnyManga } from "@/lib/shngm-types";
import { normalizeManga, formatCount, timeAgoShort, isRecent } from "@/lib/format";
import { CountryBadge } from "./CountryBadge";

export function ComicCard({
  comic,
  priority = false,
}: {
  comic: AnyManga;
  priority?: boolean;
}) {
  const m = normalizeManga(comic);
  const fresh = m.chapterTime && isRecent(m.chapterTime, 3);

  return (
    <Link
      href={`/serie/${m.id}`}
      aria-label={m.title}
      className="manga-card group flex flex-col rounded-xl overflow-hidden bg-[#141417] border border-zinc-800/60 hover:border-[#3b82f6]/50 hover:shadow-lg hover:shadow-[#3b82f6]/10 transition-all duration-300"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={m.cover}
          alt={m.title}
          loading={priority ? "eager" : "lazy"}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40" />

        <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
          {m.chapterTime && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[9px] font-bold text-zinc-200 leading-none">
              <span aria-hidden="true" className="text-[#3b82f6]">◷</span>
              {timeAgoShort(m.chapterTime)}
            </span>
          )}
          {fresh && (
            <span className="px-1.5 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-black leading-none tracking-wide">
              UP
            </span>
          )}
        </div>

        <CountryBadge code={m.country} className="absolute top-1.5 right-1.5" />
      </div>

      <div className="p-2 flex flex-col gap-1.5 items-center text-center">
        <p className="text-white text-xs sm:text-sm font-medium line-clamp-2 leading-snug group-hover:text-[#3b82f6] transition-colors">
          {m.title}
        </p>
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {m.views > 0 && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-zinc-300">
              <span aria-hidden="true">👁</span>
              {formatCount(m.views)}
            </span>
          )}
          {m.chapterNumber != null && (
            <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-black text-zinc-200">
              CH.{m.chapterNumber}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
