"use client";
/* eslint-disable react-hooks/set-state-in-effect -- sync localStorage once on mount */

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatCount, timeAgo, isRecent } from "@/lib/format";
import { CheckIcon, PlayIcon } from "./icons";
import { getLastRead, getReadMap, markChapterRead, saveHistory, toggleBookmark } from "@/lib/storage";
import { syncBookmarkToCloud, syncHistoryToCloud } from "@/lib/sync";
import type { ChapterEntry } from "@/lib/shngm-types";

export function Synopsis({ text }: { text: string }) {
  const [expand, setExpand] = useState(false);
  const long = text.length > 300;
  const show = long && !expand ? text.slice(0, 300) + "…" : text;
  return (
    <div className="bg-[#18181b] rounded-2xl p-4 sm:p-5 mb-5 border border-zinc-800/50">
      <h3 className="text-sm font-bold text-white mb-2.5">Sinopsis</h3>
      <p className="text-zinc-300 text-sm leading-relaxed text-justify whitespace-pre-line">{show}</p>
      {long && (
        <button
          onClick={() => setExpand(!expand)}
          className="text-[#3b82f6] text-xs mt-2 hover:underline cursor-pointer font-semibold"
        >
          {expand ? "Sembunyikan ↑" : "Selengkapnya ↓"}
        </button>
      )}
    </div>
  );
}

export function BookmarkButton({ mangaId }: { mangaId: string; firstChapterId?: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const bm: string[] = JSON.parse(localStorage.getItem("izanami_bookmarks") || "[]");
      setSaved(bm.includes(mangaId));
    } catch {}
  }, [mangaId]);

  return (
    <button
      onClick={() => {
        const next = toggleBookmark(mangaId);
        setSaved(next);
        void syncBookmarkToCloud(mangaId, next);
      }}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
        saved
          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40 hover:bg-yellow-500/30"
          : "bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:border-white/20"
      }`}
    >
      <span aria-hidden="true" className="text-xs">🔖</span>
      {saved ? "Tersimpan" : "Simpan"}
    </button>
  );
}

export function ReadButtons({
  mangaId,
  chapters,
}: {
  mangaId: string;
  chapters: ChapterEntry[];
}) {
  const [lastReadId, setLastReadId] = useState<string | null>(null);

  useEffect(() => {
    setLastReadId(getLastRead(mangaId));
  }, [mangaId]);

  const first = chapters[chapters.length - 1];
  const lastRead = chapters.find((c) => c.chapter_id === lastReadId);
  const target = lastRead ?? first;

  if (!target) return null;

  return (
    <Link
      href={`/read/${target.chapter_id}`}
      onClick={() => markChapterRead(target.chapter_id, mangaId)}
      className="flex items-center gap-2 px-5 py-2.5 bg-[#3b82f6] hover:bg-[#1d4ed8] text-white rounded-xl text-sm font-black transition-all shadow-lg shadow-[#3b82f6]/25"
    >
      <PlayIcon className="w-3.5 h-3.5" />
      {lastRead ? `Lanjut Ch.${lastRead.chapter_number}` : "Mulai Baca"}
    </Link>
  );
}

export function HistoryRecorder({
  mangaId,
  cover,
  title,
  chapterId,
  chapterNumber,
}: {
  mangaId: string;
  cover: string;
  title: string;
  chapterId: string;
  chapterNumber: number | null;
}) {
  useEffect(() => {
    try {
      const entry = { manga_id: mangaId, cover, title, chapter_number: chapterNumber, chapter_id: chapterId, ts: Date.now() };
      saveHistory(entry);
      markChapterRead(chapterId, mangaId);
      void syncHistoryToCloud(entry);
    } catch {}
  }, [mangaId, chapterId, chapterNumber, cover, title]);
  return null;
}

export function ChapterBrowser({
  mangaId,
  initialChapters,
  totalChapters,
}: {
  mangaId: string;
  initialChapters: ChapterEntry[];
  totalChapters: number;
}) {
  const [query, setQuery] = useState("");
  const [reversed, setReversed] = useState(false);
  const [readMap, setReadMap] = useState<Record<string, number>>({});
  const [allChapters, setAllChapters] = useState<ChapterEntry[]>(initialChapters);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setReadMap(getReadMap());
  }, []);

  const loadMore = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chapters/${mangaId}?offset=${allChapters.length}&limit=100`);
      if (res.ok) {
        const data = await res.json();
        setAllChapters((prev) => [...prev, ...data.chapters]);
        if (data.done || allChapters.length + data.chapters.length >= totalChapters) {
          setExpanded(true);
        }
      }
    } catch {}
    setLoading(false);
  }, [allChapters.length, mangaId, totalChapters]);

  const filtered = allChapters.filter((c) =>
    query ? String(c.chapter_number).includes(query.trim()) : true
  );
  const ordered = reversed ? [...filtered].reverse() : filtered;

  function openChapter(chapterId: string) {
    markChapterRead(chapterId, mangaId);
    setReadMap((p) => ({ ...p, [chapterId]: Date.now() }));
  }

  const hasMore = expanded && allChapters.length < totalChapters;
  const showLoadMore = !expanded || hasMore;

  return (
    <div className="bg-[#18181b] rounded-2xl border border-zinc-800/50 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 px-4 sm:px-5 py-3.5 border-b border-zinc-800/50 bg-zinc-900/40">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-[#3b82f6] text-sm">▤</span>
          <h3 className="font-bold text-sm sm:text-base text-white">Daftar Chapter</h3>
          <span className="px-2 py-0.5 bg-[#3b82f6]/15 text-[#3b82f6] text-xs font-bold rounded-lg border border-[#3b82f6]/20">
            {totalChapters}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Cari…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-1.5 bg-zinc-800/60 border border-zinc-700/40 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#3b82f6]/50 w-24 sm:w-32"
          />
          <button
            onClick={() => setReversed(!reversed)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              reversed
                ? "bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30"
                : "bg-zinc-800/60 text-zinc-400 border-zinc-700/40 hover:text-white"
            }`}
          >
            {reversed ? "Terlama" : "Terbaru"}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-600">Chapter tidak ditemukan</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 p-3.5">
          {ordered.slice(0, 100).map((ch) => {
            const read = !!readMap[ch.chapter_id];
            return (
              <Link
                key={ch.chapter_id}
                href={`/read/${ch.chapter_id}`}
                onClick={() => openChapter(ch.chapter_id)}
                className={`group relative flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 overflow-hidden ${
                  read
                    ? "bg-zinc-900/60 border-zinc-800/30 hover:border-zinc-700/50"
                    : "bg-zinc-800/20 border-zinc-800/50 hover:bg-[#3b82f6]/5 hover:border-[#3b82f6]/30"
                }`}
              >
                <span className={`absolute left-0 inset-y-0 w-[3px] ${read ? "bg-zinc-700/40" : "bg-[#3b82f6]"}`} />
                <div className="w-12 h-[68px] flex-shrink-0 rounded-xl overflow-hidden bg-zinc-900/80 ml-1">
                  {ch.thumbnail_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ch.thumbnail_image_url}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center">
                      <span className="text-zinc-400 font-black text-sm">{ch.chapter_number}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-sm font-bold leading-none transition-colors ${read ? "text-zinc-500" : "text-white group-hover:text-[#3b82f6]"}`}>
                      Ch.{ch.chapter_number}
                    </span>
                    {isRecent(ch.created_at, 7) && !read && (
                      <span className="px-1.5 py-0.5 bg-[#3b82f6] text-white text-[9px] font-black rounded tracking-wide leading-none">
                        BARU
                      </span>
                    )}
                    {read && <CheckIcon className="w-3 h-3 text-zinc-600" />}
                  </div>
                  {ch.chapter_title && (
                    <p className="text-zinc-400 text-[11px] truncate">{ch.chapter_title}</p>
                  )}
                  <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                    {ch.view_count ? <span>{formatCount(ch.view_count)}</span> : null}
                    {ch.view_count ? <span>•</span> : null}
                    <span>{timeAgo(ch.created_at)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {showLoadMore && !query && (
        <div className="flex justify-center pb-5">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-zinc-700/50 bg-[#18181b] text-zinc-300 hover:bg-[#3b82f6] hover:border-[#3b82f6] hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-default"
          >
            {loading ? "Memuat…" : hasMore ? "Muat Lebih Banyak" : "Lihat Semua Chapter"}
          </button>
        </div>
      )}
    </div>
  );
}
