"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export function ReaderView({
  title,
  chapterLabel,
  serieHref,
  images,
}: {
  title: string;
  chapterLabel: string;
  serieHref: string;
  images: string[];
}) {
  const [uiHidden, setUiHidden] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [clock, setClock] = useState("--:--");
  const [toast, setToast] = useState<string | null>(null);

  const surfaceRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef(0);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalPages = images.length;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 1200);
  }, []);

  const scrollToPage = useCallback(
    (page: number) => {
      const pageEl = surfaceRef.current?.querySelectorAll<HTMLElement>(
        "[data-page]",
      )[page - 1];
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [],
  );

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => {
      const next = Math.min(prev + 1, totalPages);
      if (next === prev) {
        showToast("Halaman terakhir — baca chapter berikutnya di detail seri.");
        return prev;
      }
      scrollToPage(next);
      return next;
    });
  }, [totalPages, scrollToPage, showToast]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => {
      const next = Math.max(prev - 1, 1);
      if (next === prev) {
        showToast("Halaman pertama.");
        return prev;
      }
      scrollToPage(next);
      return next;
    });
  }, [scrollToPage, showToast]);

  const zoomIn = useCallback(() => {
    setZoomLevel((z) => Math.min(z + 0.2, 2.5));
  }, []);

  const bookmarkPage = useCallback(() => {
    showToast(`Bookmark disimpan — Halaman ${currentPage}`);
  }, [currentPage, showToast]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      );
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowRight" ||
        e.key === "ArrowDown" ||
        e.key === " " ||
        e.key === "PageDown"
      ) {
        e.preventDefault();
        nextPage();
      } else if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowUp" ||
        e.key === "PageUp"
      ) {
        e.preventDefault();
        prevPage();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        setUiHidden((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextPage, prevPage]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      const pages = surfaceRef.current?.querySelectorAll<HTMLElement>("[data-page]");
      if (!pages) return;
      for (let i = 0; i < pages.length; i++) {
        const rect = pages[i].getBoundingClientRect();
        if (rect.top >= -20 && rect.top <= window.innerHeight / 2) {
          setCurrentPage(i + 1);
          break;
        }
      }
    }, 150);
  }, []);

  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setZoomLevel((z) => (z > 1 ? 1 : 1.8));
    }
    lastTapRef.current = now;
  }, []);

  if (totalPages === 0) {
    return (
      <div className="h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center gap-3 bg-black text-center px-4">
        <p className="text-sm text-zinc-300">Gambar chapter belum tersedia.</p>
        <Link href={serieHref} className="text-xs text-cyan-400 hover:underline">
          Kembali ke detail seri
        </Link>
      </div>
    );
  }

  const progress = Math.round((currentPage / totalPages) * 100);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-black text-zinc-100">
      {/* Info bar */}
      <div
        className={`bg-gradient-to-b from-black/95 to-transparent backdrop-blur-sm px-3 sm:px-4 py-2.5 flex items-center justify-between text-xs transition-opacity duration-200 shrink-0 ${
          uiHidden ? "opacity-0 pointer-events-none h-0 py-0 overflow-hidden" : "opacity-100"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="bg-violet-600/20 border border-violet-500/30 text-violet-200 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0">
            {chapterLabel}
          </span>
          <Link
            href={serieHref}
            className="text-zinc-400 hover:text-white truncate max-w-[40vw] sm:max-w-xs"
          >
            {title}
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-zinc-400 text-[11px] shrink-0">
          <span className="text-white font-semibold tabular-nums">
            {currentPage} / {totalPages}
          </span>
          <span className="font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
            {progress}%
          </span>
          <span className="tabular-nums hidden xs:inline">{clock}</span>
          <span className="hidden sm:inline">92%</span>
        </div>
      </div>

      {/* Chapter floating header */}
      <div
        className={`absolute top-[4.25rem] left-1/2 -translate-x-1/2 z-30 bg-black/75 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full font-display text-xs font-bold transition-opacity pointer-events-none ${
          uiHidden ? "opacity-0" : "opacity-90"
        }`}
      >
        {title} — {chapterLabel}
      </div>

      {/* Reader surface vertical scroll */}
      <div
        ref={surfaceRef}
        onScroll={handleScroll}
        onClick={handleDoubleTap}
        className="reader-surface no-scrollbar flex-1 overflow-y-auto bg-black scroll-smooth snap-y snap-mandatory"
      >
        {images.map((src, i) => (
          <div
            key={i}
            data-page
            className="snap-start snap-always flex justify-center bg-black"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${title} — Halaman ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              referrerPolicy="no-referrer"
              draggable={false}
              className="w-full max-w-[820px] object-contain select-none brightness-[0.96] contrast-[1.08]"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
            />
          </div>
        ))}
      </div>

      {/* Tap navigation zones (desktop arrows, mobile side taps) */}
      <button
        type="button"
        onClick={prevPage}
        aria-label="Halaman Sebelumnya"
        className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 border border-white/10 text-white/70 hover:text-white hover:bg-black/85 grid place-items-center backdrop-blur-sm"
      >
        <span className="text-lg leading-none">‹</span>
      </button>
      <button
        type="button"
        onClick={nextPage}
        aria-label="Halaman Berikutnya"
        className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 border border-white/10 text-white/70 hover:text-white hover:bg-black/85 grid place-items-center backdrop-blur-sm"
      >
        <span className="text-lg leading-none">›</span>
      </button>

      {/* Bottom toolbar */}
      <nav
        aria-label="Kontrol Reader"
        className={`shrink-0 bg-gradient-to-t from-black via-black/95 to-transparent px-4 py-3 flex items-center justify-center gap-2 transition-all duration-200 ${
          uiHidden ? "opacity-0 pointer-events-none translate-y-4 h-0 py-0 overflow-hidden" : "opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={prevPage}
          aria-label="Sebelumnya"
          className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-zinc-200 hover:bg-white/10 active:scale-95 text-sm"
        >
          ◀
        </button>
        <button
          type="button"
          onClick={() => setUiHidden((v) => !v)}
          aria-label="Sembunyikan Antarmuka"
          className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-zinc-200 hover:bg-white/10 active:scale-95 text-sm"
        >
          ◉
        </button>
        <button
          type="button"
          onClick={nextPage}
          aria-label="Berikutnya"
          className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-zinc-200 hover:bg-white/10 active:scale-95 text-sm"
        >
          ▶
        </button>
        <button
          type="button"
          onClick={zoomIn}
          aria-label="Perbesar"
          className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-zinc-200 hover:bg-white/10 active:scale-95 text-sm"
        >
          +
        </button>
        <button
          type="button"
          onClick={bookmarkPage}
          aria-label="Bookmark"
          className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-zinc-200 hover:bg-white/10 active:scale-95 text-sm"
        >
          ★
        </button>
        <Link
          href={serieHref}
          aria-label="Detail Chapter"
          className="w-11 h-11 rounded-xl bg-violet-600/20 border border-violet-500/40 grid place-items-center text-violet-200 hover:bg-violet-600/30 active:scale-95 text-sm"
        >
          ≡
        </Link>
      </nav>

      {/* Zoom indicator */}
      <div className="fixed top-[4.25rem] right-3 sm:right-4 z-30 bg-violet-600/15 border border-violet-500/25 text-violet-200 px-2 py-1 rounded-md text-[11px] font-bold pointer-events-none opacity-90">
        {Math.round(zoomLevel * 100)}%
      </div>

      {/* Toast */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-20 left-1/2 -translate-x-1/2 bg-zinc-950/90 border border-white/10 px-4 py-2 rounded-full text-xs z-40 pointer-events-none transition-opacity duration-200 ${
          toast ? "opacity-100" : "opacity-0"
        }`}
      >
        {toast ?? " "}
      </div>
    </div>
  );
}
