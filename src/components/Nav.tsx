"use client";

import Link from "next/link";
import { useState } from "react";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0d0d0d]/85 backdrop-blur-md border-b border-[#27272a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/"
            className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent hover:opacity-95"
          >
            Izanami
          </Link>

          {/* Links */}
          <nav aria-label="Navigasi Utama" className="hidden md:flex items-center gap-6 text-xs font-medium tracking-wide">
            <Link href="/" className="text-[#f4f4f5] hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/explore" className="text-[#a1a1aa] hover:text-white transition-colors">
              Explore
            </Link>
            <Link href="/library" className="text-[#a1a1aa] hover:text-white transition-colors">
              Library
            </Link>
          </nav>
        </div>

        {/* Right side: Search bar + user avatar dropdown */}
        <div className="flex items-center gap-3">
          <form
            action="/search"
            method="GET"
            className="relative hidden sm:flex items-center"
          >
            <input
              type="search"
              name="q"
              placeholder="Cari judul manga, manhwa..."
              className="w-48 md:w-64 bg-[#1a1a1a] border border-[#27272a] focus:border-[#7c3aed] rounded-full py-1.5 pl-8 pr-3 text-xs text-[#f4f4f5] placeholder-[#52525b] outline-none transition-all focus:w-72"
            />
            <span
              className="absolute left-2.5 text-[#71717a] text-xs pointer-events-none"
              aria-hidden="true"
            >
              🔍
            </span>
          </form>

          {/* Mobile search link */}
          <Link
            href="/search"
            aria-label="Cari komik"
            className="sm:hidden p-2 text-[#a1a1aa] hover:text-white"
          >
            🔍
          </Link>

          {/* User Avatar Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-haspopup="true"
              aria-label="Menu Pengguna"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4c1d95] to-[#0891b2] border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-sm cursor-pointer hover:ring-2 hover:ring-[#7c3aed]/50 transition-all"
            >
              IZ
            </button>

            {open && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#27272a] rounded-xl shadow-2xl py-1.5 text-xs text-[#f4f4f5] z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-[#27272a]">
                    <p className="font-semibold text-white">Pembaca Izanami</p>
                    <p className="text-[10px] text-[#71717a]">user@izanami.id</p>
                  </div>
                  <Link
                    href="/library"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 text-[#a1a1aa] hover:text-white hover:bg-[#27272a]/50"
                  >
                    📚 Komik Favorit
                  </Link>
                  <Link
                    href="/library"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 text-[#a1a1aa] hover:text-white hover:bg-[#27272a]/50"
                  >
                    ⏱ Riwayat Baca
                  </Link>
                  <div className="border-t border-[#27272a] my-1" />
                  <span className="block px-3 py-1.5 text-[10px] text-[#52525b]">
                    Mode: Dark (Default)
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
