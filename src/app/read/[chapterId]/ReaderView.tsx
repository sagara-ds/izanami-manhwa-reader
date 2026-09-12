"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChapterSearchModal, type ChapterOption } from "@/components/ChapterSearchModal";

export function ReaderView({
  title,
  chapterNumber,
  images,
  prevHref,
  nextHref,
  chapters,
  currentChapterId,
}: {
  title: string;
  chapterNumber: number;
  images: string[];
  prevHref: string | null;
  nextHref: string | null;
  chapters: ChapterOption[];
  currentChapterId: string;
}) {
  const [uiHidden, setUiHidden] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const surfaceRef = useRef<HTMLDivElement>(null);

  function scrollTop() {
    surfaceRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (images.length === 0) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center gap-3 bg-black text-center px-4">
        <p className="text-sm text-zinc-300">Gambar chapter belum tersedia.</p>
        <Link href="/" className="text-xs text-[#3b82f6] hover:underline">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  const bar = uiHidden ? "hidden" : "flex";

  return (
    <div className="h-dvh flex flex-col bg-black text-zinc-100">
      <header
        className={`${bar} shrink-0 h-14 items-center gap-2 px-3 sm:px-4 bg-black border-b border-white/10`}
      >
        <Link
          href="/"
          aria-label="Beranda"
          className="w-10 h-10 shrink-0 grid place-items-center rounded-xl bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10 text-base"
        >
          ⌂
        </Link>
        <button
          onClick={() => setModalOpen(true)}
          aria-label="Daftar chapter"
          className="w-10 h-10 shrink-0 grid place-items-center rounded-xl bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10 cursor-pointer text-sm"
        >
          ☰
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white truncate leading-tight">{title}</p>
          <p className="text-xs font-semibold text-[#3b82f6] leading-tight">
            Chapter {chapterNumber}
          </p>
        </div>
        {prevHref ? (
          <Link
            href={prevHref}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-zinc-200 hover:bg-white/10 shrink-0"
          >
            ← Prev
          </Link>
        ) : (
          <span className="px-4 py-2 rounded-full text-xs font-bold text-zinc-700 shrink-0">
            ← Prev
          </span>
        )}
        {nextHref ? (
          <Link
            href={nextHref}
            className="px-4 py-2 rounded-full bg-[#3b82f6] text-xs font-bold text-white hover:bg-[#1d4ed8] transition-colors shrink-0"
          >
            Next →
          </Link>
        ) : (
          <span className="px-4 py-2 rounded-full text-xs font-bold text-zinc-700 shrink-0">
            Next →
          </span>
        )}
      </header>

      <div
        ref={surfaceRef}
        onClick={() => setUiHidden((v) => !v)}
        className="flex-1 overflow-y-auto bg-black"
      >
        {images.map((src, i) => (
          <div key={i} className="flex justify-center bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${title} — Halaman ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              referrerPolicy="no-referrer"
              draggable={false}
              className="w-full max-w-[820px] object-contain select-none"
            />
          </div>
        ))}
      </div>

      <footer
        className={`${bar} shrink-0 h-16 items-center justify-between gap-2 px-3 sm:px-4 bg-black border-t border-white/10`}
      >
        {prevHref ? (
          <Link
            href={prevHref}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-zinc-200 hover:bg-white/10"
          >
            ← Prev
          </Link>
        ) : (
          <span className="px-4 py-2 rounded-full text-xs font-bold text-zinc-700">← Prev</span>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-300">Ch {chapterNumber}</span>
          <button
            onClick={scrollTop}
            aria-label="Kembali ke atas"
            className="w-10 h-10 grid place-items-center rounded-xl bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10 cursor-pointer text-sm"
          >
            ＾
          </button>
        </div>
        {nextHref ? (
          <Link
            href={nextHref}
            className="px-4 py-2 rounded-full bg-[#3b82f6] text-xs font-bold text-white hover:bg-[#1d4ed8] transition-colors"
          >
            Next →
          </Link>
        ) : (
          <span className="px-4 py-2 rounded-full text-xs font-bold text-zinc-700">Next →</span>
        )}
      </footer>

      <ChapterSearchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        chapters={chapters}
        currentChapterId={currentChapterId}
      />
    </div>
  );
}
