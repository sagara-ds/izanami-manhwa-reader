"use client";
/* eslint-disable react-hooks/set-state-in-effect -- reset search query each time modal opens */

import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchIcon } from "./icons";

export interface ChapterOption {
  chapter_id: string;
  chapter_number: number;
}

export function ChapterSearchModal({
  open,
  onClose,
  chapters,
  currentChapterId,
}: {
  open: boolean;
  onClose: () => void;
  chapters: ChapterOption[];
  currentChapterId: string;
}) {
  const [query, setQuery] = useState("");
  const [desc, setDesc] = useState(true);

  useEffect(() => {
    if (!open) return;
    setQuery("");
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

  if (!open) return null;

  const q = query.trim();
  const filtered = chapters.filter((c) =>
    q ? String(c.chapter_number).includes(q) : true
  );
  const ordered = desc ? filtered : [...filtered].reverse();

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
          <h2 className="text-lg sm:text-xl font-extrabold text-white">Search Chapter</h2>
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
          {ordered.length === 0 ? (
            <p className="py-10 text-center text-sm text-zinc-500">Chapter tidak ditemukan</p>
          ) : (
            ordered.map((c) => {
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
        </div>
      </div>
    </div>
  );
}
