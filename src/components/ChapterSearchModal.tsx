"use client";
/* eslint-disable react-hooks/set-state-in-effect -- reset search query each time modal opens */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchIcon } from "./icons";

export interface ChapterOption {
  chapter_id: string;
  chapter_number: number;
}

const PAGE_SIZE = 60;

export function ChapterSearchModal({
  open,
  onClose,
  mangaId,
  currentChapterId,
}: {
  open: boolean;
  onClose: () => void;
  mangaId: string;
  currentChapterId: string;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [desc, setDesc] = useState(true);
  const [chapters, setChapters] = useState<ChapterOption[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const firstRun = useRef(true);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setDebouncedQuery("");
    setDesc(true);
    setPage(1);
    setTotal(0);
    firstRun.current = true;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const fetchPage = useCallback(
    async (p: number, q: string, d: boolean, append: boolean) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/chapters/${mangaId}?page=${p}&limit=${PAGE_SIZE}&order=${d ? "desc" : "asc"}&search=${encodeURIComponent(q)}`
        );
        if (res.ok) {
          const data = await res.json();
          setChapters((prev) => (append ? [...prev, ...(data.chapters ?? [])] : (data.chapters ?? [])));
          setTotal(data.total ?? 0);
          setPage(p);
        }
      } catch {}
      setLoading(false);
    },
    [mangaId]
  );

  // Initial load on open + refetch page 1 on search/sort change (debounced search).
  useEffect(() => {
    if (!open) return;
    if (firstRun.current) {
      firstRun.current = false;
      void fetchPage(1, "", true, false);
      return;
    }
    const t = setTimeout(() => {
      void fetchPage(1, debouncedQuery, desc, false);
    }, debouncedQuery ? 400 : 0);
    return () => clearTimeout(t);
  }, [open, debouncedQuery, desc, fetchPage]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query, open]);

  if (!open) return null;

  const hasMore = chapters.length < total;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Chapter"
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[80dvh] flex flex-col bg-[#111114] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-white">
            Search Chapter{total > 0 && <span className="ml-2 text-xs font-bold text-zinc-500">{total}</span>}
          </h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 grid place-items-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="h-px bg-white/5 mb-4" />

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-transparent rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#3b82f6]/50"
            />
          </div>
          <button
            onClick={() => setDesc((d) => !d)}
            aria-label={desc ? "Urutkan menaik" : "Urutkan menurun"}
            className="w-11 h-11 shrink-0 grid place-items-center rounded-xl bg-white/5 border border-transparent text-zinc-200 hover:bg-white/10 cursor-pointer"
          >
            {desc ? "↓" : "↑"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5">
          {chapters.length === 0 && !loading ? (
            <p className="py-10 text-center text-sm text-zinc-500">Chapter tidak ditemukan</p>
          ) : (
            chapters.map((c) => {
              const active = c.chapter_id === currentChapterId;
              return (
                <Link
                  key={c.chapter_id}
                  href={`/read/${c.chapter_id}`}
                  onClick={onClose}
                  className={`px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-[#3b82f6]/15 border border-[#3b82f6]/40 text-white"
                      : "bg-white/5 border border-transparent text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  Chapter {c.chapter_number}
                </Link>
              );
            })
          )}
          {loading && <p className="py-4 text-center text-xs text-zinc-500">Memuat…</p>}
          {hasMore && !loading && (
            <button
              onClick={() => void fetchPage(page + 1, debouncedQuery, desc, true)}
              className="px-4 py-3 rounded-2xl text-xs font-bold text-[#3b82f6] bg-[#3b82f6]/10 border border-[#3b82f6]/20 hover:bg-[#3b82f6]/20 transition-all cursor-pointer"
            >
              Muat Lebih Banyak ({chapters.length}/{total})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
