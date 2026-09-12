"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ButtonCorner } from "@/components/ButtonCorner";
import { ComicGrid } from "@/components/ComicGrid";
import { BookmarkIcon } from "@/components/icons";
import { getMangaDetail } from "@/lib/shngm";
import type { MangaItem } from "@/lib/shngm-types";
import { getBookmarks, setBookmarks } from "@/lib/storage";
import { cloudRemoveFavorite, isCloudAvailable } from "@/lib/cloud";
import { pullCloudBookmarks } from "@/lib/sync";

export function BookmarkView() {
  const [ids, setIds] = useState<string[]>([]);
  const [items, setItems] = useState<MangaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const merged = await pullCloudBookmarks();
      const bm = merged ?? getBookmarks();
      if (cancelled) return;
      setIds(bm);
      if (bm.length === 0) {
        setLoading(false);
        return;
      }
      const res = await Promise.all(bm.map((id) => getMangaDetail(id)));
      if (cancelled) return;
      setItems(res.filter((d): d is NonNullable<typeof d> => d !== null));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function clearAll() {
    const prev = [...ids];
    setBookmarks([]);
    setIds([]);
    setItems([]);
    void (async () => {
      if (!(await isCloudAvailable())) return;
      await Promise.all(prev.map((id) => cloudRemoveFavorite(id).catch(() => {})));
    })();
  }

  return (
    <div className="bg-[#09090b] text-white min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-screen-2xl mx-auto px-4 py-5 flex-1 w-full">
        <div className="flex items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="w-1 h-6 bg-[#3b82f6] rounded-full" />
            <BookmarkIcon className="w-4 h-4 text-[#3b82f6]" />
            <h1 className="text-xl font-bold">Bookmark</h1>
            {ids.length > 0 && (
              <span className="px-2.5 py-1 bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30 rounded-full text-xs font-semibold">
                {ids.length}
              </span>
            )}
          </div>
          {ids.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800/60 border border-zinc-700/40 text-zinc-400 hover:text-[#3b82f6] hover:border-[#3b82f6]/30 transition-all cursor-pointer flex-shrink-0"
            >
              Hapus semua
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-xl bg-[#141417] border border-zinc-800/60 animate-pulse" />
              ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-zinc-600">
            <BookmarkIcon className="w-12 h-12 opacity-40" />
            <p className="text-sm text-zinc-500">Belum ada bookmark tersimpan</p>
            <Link href="/explore" className="text-xs text-[#3b82f6] hover:underline font-semibold">
              Jelajahi manga →
            </Link>
          </div>
        ) : (
          <ComicGrid comics={items} />
        )}
      </main>
      <ButtonCorner />
      <Footer />
    </div>
  );
}
