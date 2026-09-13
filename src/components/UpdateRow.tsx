"use client";

import Link from "next/link";
import type { AnyManga } from "@/lib/shngm-types";
import { normalizeManga, timeAgoShort, isRecent } from "@/lib/format";
import { CountryBadge } from "./CountryBadge";

export function UpdateRow({ manga }: { manga: AnyManga }) {
  const m = normalizeManga(manga);
  const fresh = m.chapterTime && isRecent(m.chapterTime, 1);
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-[#141417] border border-zinc-800/60 hover:border-[#3b82f6]/40 transition-all duration-200">
      <Link href={`/serie/${m.id}`} className="relative flex-shrink-0 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={m.cover}
          alt={m.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-14 h-[76px] sm:w-16 sm:h-[88px] rounded-lg object-cover bg-zinc-900 group-hover:opacity-80 transition-opacity"
        />
        <CountryBadge code={m.country} className="absolute -bottom-1 -right-1" />
      </Link>
      <div className="flex flex-col min-w-0 flex-1 gap-1.5">
        <Link
          href={`/serie/${m.id}`}
          className="text-white text-xs sm:text-sm font-bold line-clamp-2 leading-snug hover:text-[#3b82f6] transition-colors"
        >
          {m.title}
        </Link>
        {m.chapterId && m.chapterNumber != null ? (
          <Link
            href={`/read/${m.chapterId}`}
            className="flex items-center justify-between gap-2 group/ch"
          >
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] text-zinc-400 group-hover/ch:text-[#3b82f6] transition-colors truncate">
                Chapter {m.chapterNumber}
              </span>
              {fresh ? (
                <span className="px-1 py-px rounded bg-[#3b82f6] text-white text-[8px] font-black leading-none flex-shrink-0">
                  NEW
                </span>
              ) : null}
            </span>
            <span className="text-[10px] text-zinc-600 flex-shrink-0">
              {timeAgoShort(m.chapterTime)}
            </span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
