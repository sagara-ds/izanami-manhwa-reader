"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { MangaItem } from "@/lib/shngm-types";
import { normalizeManga, formatCount } from "@/lib/format";
import { CountryBadge } from "./CountryBadge";

export function Hero({ items }: { items: MangaItem[] }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const paused = useRef(false);
  const list = items.slice(0, 8);

  const start = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (list.length < 2) return;
    timer.current = setInterval(() => {
      if (!paused.current) setIdx((p) => (p + 1) % list.length);
    }, 6000);
  }, [list.length]);

  useEffect(() => {
    start();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [start]);

  function go(n: number) {
    setIdx((n + list.length) % list.length);
    start();
  }

  if (!list.length) return null;
  const raw = list[idx];
  const m = normalizeManga(raw);

  return (
    <section
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
        start();
      }}
      className="relative w-full h-[220px] sm:h-[300px] md:h-[360px] rounded-2xl overflow-hidden border border-zinc-800/60 group"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={m.id}
        src={m.cover}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover scale-105 blur-[2px] opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />

      <div
        key={`${m.id}-copy`}
        className="animate-hero-rise relative h-full flex items-center gap-4 sm:gap-6 px-4 sm:px-8"
      >
        <Link href={`/serie/${m.id}`} className="flex-shrink-0 hidden sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.portrait || m.cover}
            alt={m.title}
            referrerPolicy="no-referrer"
            className="w-[112px] md:w-[140px] aspect-[2/3] object-cover rounded-xl border border-white/10 shadow-2xl shadow-black/60"
          />
        </Link>

        <div className="flex flex-col gap-2 min-w-0 max-w-xl">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-[#3b82f6] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
              Featured
            </span>
            {m.format && (
              <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-200 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide">
                {m.format}
              </span>
            )}
            <CountryBadge code={m.country} />
          </div>

          <Link
            href={`/serie/${m.id}`}
            className="text-lg sm:text-2xl md:text-3xl font-black leading-tight line-clamp-2 hover:text-[#3b82f6] transition-colors text-white"
          >
            {m.title}
          </Link>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-zinc-400">
            {m.rating ? (
              <span className="flex items-center gap-1 text-yellow-400 font-bold">
                <span aria-hidden="true" className="text-[10px]">★</span>
                {m.rating}
              </span>
            ) : null}
            {m.views > 0 && <span>{formatCount(m.views)} views</span>}
            {m.chapterNumber != null && <span>Ch {m.chapterNumber}</span>}
            {m.year && <span>{m.year}</span>}
          </div>

          {raw.description && (
            <p className="hidden md:block text-zinc-400 text-xs leading-relaxed line-clamp-2">
              {raw.description.replace(/\s+/g, " ").trim()}
            </p>
          )}

          <div className="flex items-center gap-2 mt-1">
            <Link
              href={m.chapterId ? `/read/${m.chapterId}` : `/serie/${m.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] hover:bg-[#1d4ed8] text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-lg shadow-[#3b82f6]/25"
            >
              <span aria-hidden="true" className="text-[10px]">▶</span>
              Baca
            </Link>
            <Link
              href={`/serie/${m.id}`}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all"
            >
              Detail
            </Link>
          </div>
        </div>
      </div>

      <button
        onClick={() => go(idx - 1)}
        aria-label="Sebelumnya"
        className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center rounded-full bg-black/50 hover:bg-[#3b82f6] text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
      >
        ‹
      </button>
      <button
        onClick={() => go(idx + 1)}
        aria-label="Berikutnya"
        className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center rounded-full bg-black/50 hover:bg-[#3b82f6] text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
      >
        ›
      </button>

      <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
        {list.map((s, i) => (
          <button
            key={s.manga_id}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              i === idx ? "w-5 bg-[#3b82f6]" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
