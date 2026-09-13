"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ButtonCorner } from "@/components/ButtonCorner";
import { HistoryIcon, PlayIcon } from "@/components/icons";
import { timeAgo } from "@/lib/format";
import { clearHistory, getHistory, removeHistory, type HistoryEntry } from "@/lib/storage";
import { cloudRemoveHistory, isCloudAvailable } from "@/lib/cloud";
import { syncNow } from "@/lib/sync";

export function HistoryView() {
  const [items, setItems] = useState<HistoryEntry[]>([]);
  const [syncError, setSyncError] = useState<string | null>(null);

  function load() {
    setItems(getHistory());
  }

  async function removeOne(mangaId: string) {
    removeHistory(mangaId);
    load();
    if (await isCloudAvailable()) {
      try {
        await cloudRemoveHistory(mangaId);
      } catch (e) {
        setSyncError(e instanceof Error ? e.message : "Gagal hapus di cloud");
      }
    }
  }

  async function clear() {
    const prev = getHistory();
    clearHistory();
    load();
    if (await isCloudAvailable()) {
      try {
        await Promise.all(prev.map((it) => cloudRemoveHistory(it.manga_id)));
      } catch (e) {
        setSyncError(e instanceof Error ? e.message : "Gagal bersihkan cloud");
      }
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await syncNow();
      if (cancelled) return;
      if (res && res.errors.length > 0) setSyncError(res.errors[0]);
      load();
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-[#09090b] text-white min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-screen-xl mx-auto px-4 py-5 flex-1 w-full">
        <div className="flex items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="w-1 h-6 bg-[#3b82f6] rounded-full" />
            <HistoryIcon className="w-4 h-4 text-[#3b82f6]" />
            <h1 className="text-xl font-bold">Riwayat Baca</h1>
            {items.length > 0 && (
              <span className="px-2.5 py-1 bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30 rounded-full text-xs font-semibold">
                {items.length}
              </span>
            )}
          </div>
          {items.length > 0 && (
            <button
              onClick={() => void clear()}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800/60 border border-zinc-700/40 text-zinc-400 hover:text-[#3b82f6] hover:border-[#3b82f6]/30 transition-all cursor-pointer flex-shrink-0"
            >
              Bersihkan
            </button>
          )}
        </div>

        {syncError && (
          <p className="mb-4 text-xs text-red-400">
            Sinkron cloud gagal sebagian: {syncError}
          </p>
        )}

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-zinc-600">
            <HistoryIcon className="w-12 h-12 opacity-40" />
            <p className="text-sm text-zinc-500">Belum ada riwayat baca</p>
            <Link href="/" className="text-xs text-[#3b82f6] hover:underline font-semibold">
              Mulai baca →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {items.map((it) => (
              <div
                key={it.manga_id}
                className="group flex items-center gap-3 p-2.5 sm:p-3 bg-[#18181b] rounded-2xl border border-zinc-800/50 hover:border-[#3b82f6]/30 transition-all"
              >
                <Link href={`/serie/${it.manga_id}`} className="flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.cover}
                    alt={it.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-12 h-16 sm:w-14 sm:h-20 rounded-lg object-cover bg-zinc-900"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/serie/${it.manga_id}`}
                    className="text-white text-sm font-semibold line-clamp-1 hover:text-[#3b82f6] transition-colors"
                  >
                    {it.title}
                  </Link>
                  <p className="text-zinc-400 text-xs mt-0.5">Chapter {it.chapter_number ?? "–"}</p>
                  <p className="text-zinc-600 text-[11px] mt-0.5">{timeAgo(new Date(it.ts).toISOString())}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {it.chapter_id && (
                    <Link
                      href={`/read/${it.chapter_id}`}
                      className="flex items-center gap-1.5 px-3 py-2 bg-[#3b82f6] hover:bg-[#1d4ed8] text-white rounded-xl text-xs font-bold transition-all"
                    >
                      <PlayIcon className="w-3 h-3" />
                      <span className="hidden sm:inline">Lanjut</span>
                    </Link>
                  )}
                  <button
                    onClick={() => void removeOne(it.manga_id)}
                    aria-label="Hapus dari riwayat"
                    className="px-2.5 py-2 rounded-xl text-zinc-500 hover:text-[#3b82f6] bg-zinc-800/50 border border-zinc-700/40 hover:border-[#3b82f6]/30 transition-all cursor-pointer text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <ButtonCorner />
      <Footer />
    </div>
  );
}
